export function ConsentMode() {
  return (
    <script
      id="google-consent-mode"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}

        const storedConsent = (() => {
          try {
            const raw = window.localStorage.getItem("aiverseworld-cookie-consent");
            if (!raw) return null;
            if (raw === "accepted") return { analytics: true, marketing: true };
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })();

        gtag("consent", "default", {
          ad_storage: storedConsent?.marketing ? "granted" : "denied",
          ad_user_data: storedConsent?.marketing ? "granted" : "denied",
          ad_personalization: storedConsent?.marketing ? "granted" : "denied",
          analytics_storage: storedConsent?.analytics ? "granted" : "denied",
          functionality_storage: "granted",
          security_storage: "granted"
        });

        window.addEventListener("aiverseworld-cookie-consent-change", () => {
          try {
            const raw = window.localStorage.getItem("aiverseworld-cookie-consent");
            const next = raw === "accepted" ? { analytics: true, marketing: true } : JSON.parse(raw || "{}");
            gtag("consent", "update", {
              ad_storage: next.marketing ? "granted" : "denied",
              ad_user_data: next.marketing ? "granted" : "denied",
              ad_personalization: next.marketing ? "granted" : "denied",
              analytics_storage: next.analytics ? "granted" : "denied"
            });
          } catch {}
        });
      `,
      }}
    />
  );
}
