"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem 0' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        Subscribe to Newsletter
      </h3>
      <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Get the latest posts delivered to your inbox.
      </p>
      
      {status === "success" ? (
        <div style={{ 
          padding: '1rem', 
          background: '#dcfce7', 
          borderRadius: '4px',
          color: '#16a34a',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          ✓ {message}
        </div>
      ) : status === "error" ? (
        <div style={{ 
          padding: '1rem', 
          background: '#fee2e2', 
          borderRadius: '4px',
          color: '#dc2626',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          ✕ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            style={{
              flex: 1,
              maxWidth: '300px',
              padding: '0.6rem 0.75rem',
              fontSize: '0.9rem',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              background: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: '0.6rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#fff',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: '4px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
