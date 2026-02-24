"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "author" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setUsers([data, ...users]);
      setShowForm(false);
      setForm({ email: "", password: "", name: "", role: "author" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>Users</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Add User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', background: 'var(--color-surface)', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>Add New User</h2>
          
          {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-background)', color: 'var(--color-text)' }}
              >
                <option value="author">Author</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create User"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {users.length === 0 ? (
        <p style={{ color: 'var(--color-secondary)' }}>No users yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Role</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0' }}>{user.name || '-'}</td>
                <td style={{ padding: '1rem 0' }}>{user.email}</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    background: user.role === 'admin' ? '#dcfce7' : user.role === 'editor' ? '#dbeafe' : '#f3f4f6',
                    color: user.role === 'admin' ? '#166534' : user.role === 'editor' ? '#1e40af' : '#6b7280'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                  {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
