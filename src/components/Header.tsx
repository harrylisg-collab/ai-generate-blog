import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600 }}>
          AI Generate Blog System
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
