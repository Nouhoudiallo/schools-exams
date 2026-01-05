"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DevoirClient({ devoirId }: { devoirId: string }) {
  const durationSeconds = 20 * 60;
  const [remaining, setRemaining] = useState(durationSeconds);
  const [startedAt] = useState(() => Date.now());

  const progress = useMemo(() => {
    const done = Math.max(0, durationSeconds - remaining);
    return Math.min(1, done / durationSeconds);
  }, [remaining]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, durationSeconds - elapsed));
    }, 250);

    return () => window.clearInterval(interval);
  }, [durationSeconds, startedAt]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return (
    <div className="grid gap-4">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-white/60">Session devoir</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">Devoir #{devoirId}</h2>
            <div className="text-right">
              <p className="text-xs text-white/60">Temps restant</p>
              <p className="font-mono text-xl">{formatTime(remaining)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400/80 to-cyan-300/80"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">
            Si tu quittes la page, l’examen peut être invalidé automatiquement.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="bg-black/20">
            <p className="text-sm font-medium">Consigne</p>
            <p className="mt-1 text-sm text-white/70">
              Résous les questions. Sauvegarde régulièrement tes réponses.
            </p>
          </Card>
          <Card className="bg-black/20">
            <p className="text-sm font-medium">Conseil</p>
            <p className="mt-1 text-sm text-white/70">
              Reste sur cette page. Évite de changer d’onglet.
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              window.alert(
                "Démo UI: ici tu déclencherais une sauvegarde vers le backend (non modifié).",
              );
            }}
          >
            Sauvegarder
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              window.alert("Démo UI: ici tu soumettrais le devoir (backend non modifié). ");
            }}
          >
            Soumettre
          </Button>
        </div>
      </Card>
    </div>
  );
}
