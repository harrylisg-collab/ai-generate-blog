"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        aria-label="Search posts"
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.9rem',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          width: '150px',
          transition: 'width 150ms ease',
        }}
        onFocus={(e) => e.target.style.width = '200px'}
        onBlur={(e) => e.target.style.width = '150px'}
      />
    </form>
  );
}
