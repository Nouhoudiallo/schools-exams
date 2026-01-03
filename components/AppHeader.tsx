import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <span className="text-sm font-semibold">SE</span>
          </span>
          <span className="text-sm font-semibold tracking-tight">Schools Exams</span>
        </a>

        <nav className="hidden items-center gap-2 sm:flex">
          <a href="/dashboard" className="text-sm text-white/80 hover:text-white">
            Tableau de bord
          </a>
          <a href="/devoir/1" className="text-sm text-white/80 hover:text-white">
            Démo devoir
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/dashboard" variant="secondary" className="hidden sm:inline-flex">
            Espace élève
          </Button>
          <Button href="/devoir/1" variant="primary">
            Commencer
          </Button>
        </div>
      </Container>
    </header>
  );
}
