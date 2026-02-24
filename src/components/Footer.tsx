import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="container" style={{ 
        borderTop: '1px solid var(--color-border)', 
        paddingTop: '2rem',
        paddingBottom: '2rem',
        color: 'var(--color-secondary)',
        fontSize: '0.875rem',
        marginTop: '2rem'
      }}>
        <p>© {new Date().getFullYear()} AI Generate Blog System. All rights reserved.</p>
      </footer>
    </>
  );
}
