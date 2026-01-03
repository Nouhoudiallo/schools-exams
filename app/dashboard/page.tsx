import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const devoirs = [
  {
    id: "1",
    titre: "Maths - Équations (20 min)",
    statut: "À faire",
    matiere: "Maths",
  },
  {
    id: "2",
    titre: "Français - Analyse de texte (30 min)",
    statut: "À faire",
    matiere: "Français",
  },
  {
    id: "3",
    titre: "Histoire - QCM (15 min)",
    statut: "Fait",
    matiere: "Histoire",
  },
];

export default function DashboardPage() {
  return (
    <main className="py-10">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
          <p className="text-white/70">
            Retrouve tes devoirs, lance une session et suis ton avancement.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devoirs.map((d) => (
            <Card key={d.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-white/60">{d.matiere}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium">{d.titre}</p>
                </div>
                <span
                  className={
                    d.statut === "Fait"
                      ? "rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200 ring-1 ring-emerald-400/20"
                      : "rounded-full bg-white/10 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10"
                  }
                >
                  {d.statut}
                </span>
              </div>

              <div className="mt-auto flex items-center gap-2">
                <Button href={`/devoir/${d.id}`} variant="primary" className="w-full">
                  Ouvrir
                </Button>
                <Button href={`/devoir/${d.id}`} variant="secondary" className="hidden w-full sm:inline-flex">
                  Aperçu
                </Button>
              </div>

              <a href={`/devoir/${d.id}`} className="text-xs text-white/60 hover:text-white">
                Voir les détails
              </a>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}
