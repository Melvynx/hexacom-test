import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Results } from "@/lib/types";

interface ResultsDisplayEnProps {
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
  Empathique: "Empathic: warm, attentive, harmony-seeking",
  Travaillomane: "Workaholic: logical, organized, detail-oriented",
  Persévérant: "Perseverant: dedicated, observant, opinion-driven",
  Promoteur: "Promoter: persuasive, charming, result-oriented",
  Rebelle: "Rebel: spontaneous, creative, playful",
  Rêveur: "Dreamer: calm, imaginative, thoughtful",
};

export function ResultsDisplayEn({ results }: ResultsDisplayEnProps) {
  const types = Object.keys(results.totals) as Array<
    keyof typeof results.totals
  >;
  const sortedTypes = [...types].sort(
    (a, b) => results.totals[b] - results.totals[a]
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your HEXACOMM Profile</CardTitle>
          <CardDescription>
            Base: <strong>{results.base}</strong> | Phase:{" "}
            <strong>{results.phase}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Global Profile</h3>
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
            <h3 className="font-medium mb-4">Dominant Type: {results.base}</h3>
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
                <h3 className="font-medium text-destructive">Stress Alert</h3>
                <p>
                  Your stress index for your dominant type is high (
                  {results.stressIndex[results.base]} / 24). This may indicate
                  you are currently expressing several stress behaviors.
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
