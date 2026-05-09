'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api';

export default function DashboardPage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
  if (loading) return;
  if (!user || !token) {
    router.push('/signin');
    return;
  }
  fetchTodos();
}, [user, token, loading]);

  const fetchTodos = async () => {
  setFetching(true);
  try {
    const res = await fetch('http://localhost:1337/api/todos?populate=*', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json();
    console.log('FETCH TODOS RAW:', JSON.stringify(json));
    if (!res.ok) {
      setError('Failed to load todos.');
      return;
    }
    const raw = json.data || [];
    const normalized = raw.map((item) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title ?? item.attributes?.title,
      isCompleted: item.isCompleted ?? item.attributes?.isCompleted ?? false,
    }));
    setTodos(normalized);
  } catch (err) {
    console.error('Fetch todos error:', err);
    setError('Failed to load todos.');
  } finally {
    setFetching(false);
  }
};

  const handleAdd = async (e) => {
  e.preventDefault();
  if (!newTitle.trim()) return;
  setAdding(true);
  setError('');
  try {
    const res = await fetch('http://localhost:1337/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { title: newTitle.trim(), isCompleted: false } }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(`Error: ${json.error?.message || 'Unknown error'}`);
      return;
    }
    const item = json.data;
    const normalized = {
  id: item.id,
  documentId: item.documentId,
  title: item.title ?? item.attributes?.title,
  isCompleted: item.isCompleted ?? item.attributes?.isCompleted ?? false,
};
    setTodos((prev) => [normalized, ...prev]);
    setNewTitle('');
  } catch (err) {
    setError(`Network error: ${err.message}`);
  } finally {
    setAdding(false);
  }
};

  const handleToggle = async (todo) => {
  console.log('TOGGLE TODO:', JSON.stringify(todo));
  try {
    await updateTodo(todo.documentId || todo.id, !todo.isCompleted, token);
    setTodos((prev) =>
      prev.map((t) => t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t)
    );
  } catch (err) {
    console.error('Toggle error:', err.response?.data || err.message);
    setError('Failed to update todo.');
  }
};

  const handleDelete = async (todo) => {
  try {
    await deleteTodo(todo.documentId || todo.id, token);
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  } catch (err) {
    console.error('Delete error:', err.response?.data || err.message);
    setError('Failed to delete todo.');
  }
};

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const filtered = todos.filter((t) => {
    if (filter === 'pending') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const pendingCount = todos.filter((t) => !t.isCompleted).length;

  if (loading || fetching) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f13',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #2a2a3a',
          borderTop: '3px solid #f5c518',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#666', fontSize: '14px' }}>Loading your tasks...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f13', color: '#fff' }}>

      {/* Navbar */}
      <nav style={{
        background: '#1a1a24',
        borderBottom: '1px solid #2a2a3a',
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: '#f5c518',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', fontWeight: '800', color: '#0f0f13'
          }}>T</div>
          <span style={{ fontSize: '18px', fontWeight: '700' }}>TodoApp</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#0f0f13',
            border: '1px solid #2a2a3a',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '13px',
            color: '#aaa'
          }}>
            👤 {user?.username}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#f87171',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
            My Tasks
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {pendingCount} pending · {completedCount} completed
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {error}
            <button onClick={() => setError('')} style={{
              background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px'
            }}>✕</button>
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '1.5rem',
        }}>
          {[
            { label: 'Total', value: todos.length, color: '#f5c518' },
            { label: 'Pending', value: pendingCount, color: '#f97316' },
            { label: 'Completed', value: completedCount, color: '#22c55e' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#1a1a24',
              border: '1px solid #2a2a3a',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Add Todo */}
        <form onSubmit={handleAdd} style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '1.5rem',
        }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              background: '#1a1a24',
              border: '1px solid #2a2a3a',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#f5c518'}
            onBlur={e => e.target.style.borderColor = '#2a2a3a'}
          />
          <button
            type="submit"
            disabled={adding || !newTitle.trim()}
            style={{
              background: adding || !newTitle.trim() ? '#2a2a3a' : '#f5c518',
              color: adding || !newTitle.trim() ? '#666' : '#0f0f13',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: adding || !newTitle.trim() ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {adding ? '...' : '+ Add'}
          </button>
        </form>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '1.25rem',
        }}>
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#f5c518' : '#1a1a24',
                color: filter === f ? '#0f0f13' : '#666',
                border: filter === f ? 'none' : '1px solid #2a2a3a',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: filter === f ? '700' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 0',
            color: '#444',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {filter === 'completed' ? '🏆' : '📋'}
            </div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#555' }}>
              {filter === 'completed' ? 'No completed tasks yet' :
               filter === 'pending' ? 'No pending tasks!' :
               'No tasks yet'}
            </p>
            <p style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>
              {filter === 'all' ? 'Add your first task above' : ''}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((todo) => (
              <div
                key={todo.id}
                style={{
                  background: '#1a1a24',
                  border: `1px solid ${todo.isCompleted ? 'rgba(34,197,94,0.2)' : '#2a2a3a'}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(todo)}
                  style={{
                    width: '22px', height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${todo.isCompleted ? '#22c55e' : '#444'}`,
                    background: todo.isCompleted ? '#22c55e' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                >
                  {todo.isCompleted ? '✓' : ''}
                </button>

                {/* Title */}
                <span style={{
                  flex: 1,
                  fontSize: '15px',
                  color: todo.isCompleted ? '#555' : '#ddd',
                  textDecoration: todo.isCompleted ? 'line-through' : 'none',
                  cursor: 'pointer',
                }} onClick={() => handleToggle(todo)}>
                  {todo.title}
                </span>

                {/* Badge */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: todo.isCompleted ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                  color: todo.isCompleted ? '#22c55e' : '#f97316',
                  border: `1px solid ${todo.isCompleted ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)'}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>
                  {todo.isCompleted ? 'Done' : 'Pending'}
                </span>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(todo)}
                  style={{
                    background: 'rgba(220,38,38,0.1)',
                    border: '1px solid rgba(220,38,38,0.2)',
                    color: '#f87171',
                    borderRadius: '6px',
                    width: '30px', height: '30px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}