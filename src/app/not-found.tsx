import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: '50vh'
      }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', margin: 0 }}>
          404
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '1.25rem' }}>
          This page could not be found.
        </p>
        <Link 
          href="/"
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--color-accent)',
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
