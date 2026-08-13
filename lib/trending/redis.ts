import net from "node:net";
import tls from "node:tls";

type RedisValue = string | null;

class RespParser {
  private offset = 0;

  constructor(private readonly data: Buffer) {}

  parse(): unknown {
    if (this.offset >= this.data.length) {
      throw new Error("Redis returned an empty response");
    }

    const prefix = String.fromCharCode(this.data[this.offset]);
    this.offset += 1;

    if (prefix === "+") return this.readLine();
    if (prefix === "-") throw new Error(this.readLine());
    if (prefix === ":") return Number(this.readLine());
    if (prefix === "$") {
      const length = Number(this.readLine());
      if (length === -1) return null;
      if (this.offset + length + 2 > this.data.length) {
        throw new Error("Redis returned an incomplete response");
      }
      const value = this.data.toString("utf8", this.offset, this.offset + length);
      this.offset += length + 2;
      return value;
    }
    if (prefix === "*") {
      const length = Number(this.readLine());
      if (length === -1) return null;
      return Array.from({ length }, () => this.parse());
    }

    throw new Error("Redis returned an unsupported response");
  }

  private readLine() {
    const end = this.data.indexOf("\r\n", this.offset);
    if (end === -1) {
      throw new Error("Redis returned an incomplete response");
    }
    const value = this.data.toString("utf8", this.offset, end);
    this.offset = end + 2;
    return value;
  }
}

function parseRedisReplies(buffer: Buffer, count: number) {
  let result: unknown = null;
  const parser = new RespParser(buffer);
  for (let index = 0; index < count; index += 1) {
    result = parser.parse();
  }
  return result;
}

function encodeCommand(parts: string[]) {
  return `*${parts.length}\r\n${parts
    .map((part) => `$${Buffer.byteLength(part)}\r\n${part}\r\n`)
    .join("")}`;
}

function shouldUseTls(url: URL) {
  return url.protocol === "rediss:" || url.hostname.endsWith("upstash.io") || process.env.REDIS_TLS === "true";
}

function getRedisUrl() {
  const rawUrl = process.env.REDIS_URL?.trim();
  if (!rawUrl) throw new Error("Missing required environment variable: REDIS_URL");

  const cliUrl = rawUrl.match(/(?:^|\s)-u\s+(['"]?)(redis(?:s)?:\/\/\S+)\1/i)?.[2];
  return (cliUrl ?? rawUrl).replace(/^['"]|['"]$/g, "");
}

async function redisCommand(parts: string[]) {
  const url = new URL(getRedisUrl());
  const port = Number(url.port || 6379);
  const password = decodeURIComponent(url.password || "");
  const username = decodeURIComponent(url.username || "default");
  const authParts = password ? ["AUTH", username, password] : null;
  const commands = authParts ? [authParts, parts] : [parts];
  const payload = commands.map(encodeCommand).join("");

  const socket = shouldUseTls(url)
    ? tls.connect({ host: url.hostname, port, servername: url.hostname })
    : net.connect({ host: url.hostname, port });
  const readyEvent = socket instanceof tls.TLSSocket ? "secureConnect" : "connect";

  return await new Promise<unknown>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let settled = false;
    let timer: NodeJS.Timeout;

    function finish(error?: unknown, value?: unknown) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    }

    timer = setTimeout(() => {
      socket.destroy();
      finish(new Error("Redis command timed out"));
    }, 8_000);

    socket.once("error", (error) => {
      finish(error);
    });

    socket.on("data", (chunk) => {
      chunks.push(chunk);
      try {
        const result = parseRedisReplies(Buffer.concat(chunks), commands.length);
        socket.end();
        finish(undefined, result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("empty response") || message.includes("incomplete response")) {
          return;
        }
        socket.destroy();
        finish(error);
      }
    });

    socket.once(readyEvent, () => {
      socket.write(payload);
    });

    socket.once("end", () => {
      try {
        const result = parseRedisReplies(Buffer.concat(chunks), commands.length);
        finish(undefined, result);
      } catch (error) {
        finish(error);
      }
    });

    socket.once("close", () => {
      if (!settled && chunks.length === 0) {
        finish(new Error("Redis returned an empty response"));
      }
    });
  });
}

export async function redisGet(key: string): Promise<RedisValue> {
  return (await redisCommand(["GET", key])) as RedisValue;
}

export async function redisSet(key: string, value: string, ttlSeconds?: number) {
  const command = ttlSeconds ? ["SET", key, value, "EX", String(ttlSeconds)] : ["SET", key, value];
  return redisCommand(command);
}

export async function redisSetNx(key: string, value: string, ttlSeconds: number) {
  const result = await redisCommand(["SET", key, value, "NX", "EX", String(ttlSeconds)]);
  return result === "OK";
}

export async function redisDel(key: string) {
  return redisCommand(["DEL", key]);
}
