"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import type { PromptRecipe } from "@/lib/prompt-tools";

type RecipeGridProps = {
  recipes: PromptRecipe[];
};

export function RecipeGrid({ recipes }: RecipeGridProps) {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  async function copyRecipe(recipe: PromptRecipe) {
    await navigator.clipboard.writeText(recipe.prompt);
    setCopiedTitle(recipe.title);
    window.setTimeout(() => setCopiedTitle(null), 1400);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <article key={recipe.title} className={`${cardClass({ padding: "lg" })} flex flex-col`}>
          <p className="text-caption font-semibold text-brand-violet-strong">{recipe.useCase}</p>
          <h3 className="text-heading-2 mt-2 text-text-primary">{recipe.title}</h3>
          <p className="mt-4 flex-1 text-sm leading-6 text-text-secondary">{recipe.prompt}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {recipe.models.map((model) => (
              <Badge key={model} variant="neutral">
                {model}
              </Badge>
            ))}
          </div>
          <Button type="button" onClick={() => copyRecipe(recipe)} variant="secondary" className="mt-5 w-full">
            {copiedTitle === recipe.title ? "Copied template" : "Copy template"}
          </Button>
        </article>
      ))}
    </div>
  );
}
