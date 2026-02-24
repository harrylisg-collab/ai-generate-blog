import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, flexShrink: 0 }}>
          AI Generate Blog System
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SearchBar />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
