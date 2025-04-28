import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Results } from "@/lib/types";

interface ResultsDisplayProps {
  results: Results;
}

const TYPE_COLORS = {
  Empathique: "bg-[var(--color-chart-1)]",
  Travaillomane: "bg-[var(--color-chart-2)]",
  Persévérant: "bg-[var(--color-chart-3)]",
  Promoteur: "bg-[var(--color-chart-4)]",
  Rebelle: "bg-[var(--color-chart-5)]",
  Rêveur: "bg-[var(--primary)]",
};

const TYPE_DESCRIPTIONS = {
  Empathique: "Chaleureux, empathique, recherche l'harmonie",
  Travaillomane: "Logique, organisé, axé sur les détails",
  Persévérant: "Dévoué, observateur, dirigé par des opinions",
  Promoteur: "Persuasif, charmant, orienté résultats",
  Rebelle: "Spontané, créatif, ludique",
  Rêveur: "Calme, imaginatif, réfléchi",
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const types = Object.keys(results.totals) as Array<
    keyof typeof results.totals
  >;

  // Sort types by score (descending)
  const sortedTypes = [...types].sort(
    (a, b) => results.totals[b] - results.totals[a]
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Votre profil PCM</CardTitle>
          <CardDescription>
            Base: <strong>{results.base}</strong> | Phase:{" "}
            <strong>{results.phase}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Profil Global</h3>
            <div className="space-y-4">
              {sortedTypes.map((type) => (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{type}</span>
                    <span className="text-muted-foreground">
                      {results.totals[type]} / 72
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${TYPE_COLORS[type] || "bg-primary"}`}
                      style={{
                        width: `${(results.totals[type] / 72) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Type Dominant: {results.base}</h3>
            <p className="text-muted-foreground mb-4">
              {TYPE_DESCRIPTIONS[results.base]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Motivation", "Force", "Stress"].map((dimension) => (
                <Card key={dimension} className="overflow-hidden">
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">{dimension}</CardTitle>
                  </CardHeader>
                  <div
                    className={`h-2 ${
                      TYPE_COLORS[results.base] || "bg-primary"
                    }`}
                    style={{
                      width: `${
                        (results.dimensionScores[results.base][
                          dimension as "Motivation" | "Force" | "Stress"
                        ] /
                          24) *
                        100
                      }%`,
                    }}
                  />
                  <CardContent className="py-4">
                    <span className="text-sm font-medium">
                      {
                        results.dimensionScores[results.base][
                          dimension as "Motivation" | "Force" | "Stress"
                        ]
                      }{" "}
                      / 24
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {results.stressIndex[results.base] !== undefined &&
            results.stressIndex[results.base]! > 12 && (
              <div className="bg-destructive/20 p-4 rounded-lg">
                <h3 className="font-medium text-destructive">Alerte Stress</h3>
                <p>
                  Votre indice de stress pour votre type dominant est élevé (
                  {results.stressIndex[results.base]} / 24). Cela peut indiquer
                  que vous exprimez actuellement plusieurs comportements sous
                  stress.
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
