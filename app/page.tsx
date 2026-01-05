export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute top-40 right-[-120px] h-[460px] w-[460px] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
                Plateforme de devoirs
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                sessions cadrées & modernes
              </p>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                Des devoirs clairs.
                <span className="block bg-gradient-to-r from-violet-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  Une expérience élève exceptionnelle.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
                Un espace simple pour lancer un devoir, suivre le temps, et rester concentré.
                Interface rapide, responsive, et agréable.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-medium ring-1 ring-white/10 transition hover:bg-white/15"
                >
                  Accéder au tableau de bord
                </a>
                <a
                  href="/devoir/1"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-white/20 to-white/10 px-5 py-3 text-sm font-medium ring-1 ring-white/15 transition hover:from-white/25 hover:to-white/15"
                >
                  Voir la démo devoir
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Focus</p>
                  <p className="mt-1 text-sm font-medium">Mode devoir</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Progression</p>
                  <p className="mt-1 text-sm font-medium">Timer & étapes</p>
                </div>
                <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:block">
                  <p className="text-xs text-white/60">Design</p>
                  <p className="mt-1 text-sm font-medium">Moderne & fluide</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
                <div className="rounded-2xl bg-black/30 p-5">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs text-white/60">Devoir en cours</p>
                      <p className="mt-1 text-sm font-medium">Maths - Équations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Temps restant</p>
                      <p className="font-mono text-lg">12:48</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-violet-400/80 to-cyan-300/80" />
                    </div>
                    <p className="mt-2 text-xs text-white/60">Progression de la session</p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/60">Question 3/10</p>
                      <p className="mt-1 text-sm font-medium">Résoudre l’équation</p>
                      <p className="mt-2 text-xs text-white/60">2x + 5 = 17</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/60">Réponse</p>
                      <div className="mt-2 h-9 rounded-xl bg-black/40 ring-1 ring-white/10" />
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <div className="h-10 flex-1 rounded-xl bg-white/10 ring-1 ring-white/10" />
                    <div className="h-10 w-28 rounded-xl bg-gradient-to-b from-white/20 to-white/10 ring-1 ring-white/15" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium">Rapide à comprendre</p>
            <p className="mt-2 text-sm text-white/70">
              Un tableau de bord clair, des devoirs rangés, et une navigation simple.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium">Optimisé mobile</p>
            <p className="mt-2 text-sm text-white/70">
              Responsive et lisible sur téléphone, tablette et PC.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium">UI moderne</p>
            <p className="mt-2 text-sm text-white/70">
              Cartes, gradients et micro-interactions légères pour un rendu premium.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
