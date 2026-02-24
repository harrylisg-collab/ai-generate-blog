import Link from "next/link";

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            fontSize: '0.8rem',
            color: 'var(--color-accent)',
            background: 'transparent',
            border: '1px solid var(--color-accent)',
            borderRadius: '999px',
            textDecoration: 'none',
            transition: 'all 150ms ease',
          }}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
