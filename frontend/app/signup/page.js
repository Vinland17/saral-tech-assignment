'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.username) return 'Username is required.';
    if (!emailRegex.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      router.push('/signin');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f13',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              width: '36px', height: '36px',
              background: '#f5c518',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '800', color: '#0f0f13'
            }}>T</div>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>TodoApp</span>
          </div>
          <p style={{ color: '#888', fontSize: '14px' }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1a1a24',
          border: '1px solid #2a2a3a',
          borderRadius: '16px',
          padding: '2rem',
        }}>
          {error && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Username', name: 'username', type: 'text', placeholder: 'johndoe' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'john@example.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#aaa',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    background: '#0f0f13',
                    border: '1px solid #2a2a3a',
                    borderRadius: '8px',
                    padding: '11px 14px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#f5c518'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#888' : '#f5c518',
                color: '#0f0f13',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: '600' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}