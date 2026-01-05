import { Container } from "@/src/components/Container";
import { Card } from "@/src/components/ui/Card";

export default async function DevoirPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="py-10">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Devoir #{id}</h1>
          <p className="text-white/70">Interface de session (UI uniquement).</p>
        </div>

        <Card className="bg-black/20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">Session devoir</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">Maths - Équations</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Temps restant</p>
              <p className="font-mono text-xl">20:00</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-violet-400/80 to-cyan-300/80" />
            </div>
            <p className="mt-2 text-xs text-white/60">Progression de la session</p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card className="bg-white/5 lg:col-span-2">
              <p className="text-xs uppercase tracking-wide text-white/60">Question 1</p>
              <p className="mt-1 text-sm font-medium">Résoudre l’équation</p>
              <div className="mt-3 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                <p className="font-mono text-sm">2x + 5 = 17</p>
              </div>

              <p className="mt-4 text-xs text-white/60">Ta réponse</p>
              <div className="mt-2 h-11 w-full rounded-xl bg-black/40 ring-1 ring-white/10" />

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/10 transition hover:bg-white/15"
                >
                  Sauvegarder
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-white/20 to-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/15 transition hover:from-white/25 hover:to-white/15"
                >
                  Soumettre
                </a>
              </div>
            </Card>

            <Card className="bg-white/5">
              <p className="text-sm font-medium">Récapitulatif</p>
              <div className="mt-3 grid gap-2">
                <div className="rounded-xl bg-black/25 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">Questions</p>
                  <p className="mt-1 text-sm font-medium">10</p>
                </div>
                <div className="rounded-xl bg-black/25 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">Répondu</p>
                  <p className="mt-1 text-sm font-medium">1</p>
                </div>
                <div className="rounded-xl bg-black/25 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">Statut</p>
                  <p className="mt-1 text-sm font-medium">En cours</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/60">Navigation</p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={
                      i === 0
                        ? "h-9 rounded-xl bg-white/15 ring-1 ring-white/20"
                        : "h-9 rounded-xl bg-white/5 ring-1 ring-white/10"
                    }
                  />
                ))}
              </div>
            </Card>
          </div>
        </Card>
      </Container>
    </main>
  );
}
