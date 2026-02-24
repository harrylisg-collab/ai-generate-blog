import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="container" style={{ 
      borderTop: '1px solid var(--color-border)', 
      paddingTop: '1rem',
      paddingBottom: '2rem',
      color: 'var(--color-secondary)',
      fontSize: '0.875rem',
      marginTop: '3rem'
    }}>
      <Newsletter />
      <p style={{ marginTop: '1.5rem' }}>
        © {new Date().getFullYear()} AI Generate Blog System. All rights reserved.
      </p>
    </footer>
  );
}
