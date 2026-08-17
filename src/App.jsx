import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Edit3,
  LoaderCircle,
  Plus,
  Search,
  Server,
  Trash2,
  Users,
  X,
  Cloud,
} from 'lucide-react'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://fastapi-app.wonderfulmeadow-0eabcbb1.uaenorth.azurecontainerapps.io'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return users
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    )
  }, [users, query])

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    const text = await response.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        `Request failed with status ${response.status}`
      throw new Error(message)
    }

    return data
  }

  async function loadUsers() {
    setLoading(true)
    setError('')
    try {
      const data = await request('/users')
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  async function checkDatabase() {
    setStatus('checking')
    try {
      await request('/db-test')
      setStatus('online')
    } catch {
      setStatus('offline')
    }
  }

  useEffect(() => {
    Promise.all([loadUsers(), checkDatabase()])
  }, [])

  function openCreate() {
    setEditingUser(null)
    setForm({ name: '', email: '' })
    setModalOpen(true)
  }

  function openEdit(user) {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email })
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setModalOpen(false)
    setEditingUser(null)
    setForm({ name: '', email: '' })
  }

  async function submitUser(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const body = JSON.stringify(form)
      if (editingUser) {
        await request(`/users/${editingUser.id}`, {
          method: 'PUT',
          body,
        })
      } else {
        await request('/users', {
          method: 'POST',
          body,
        })
      }
      await loadUsers()
      await checkDatabase()
      closeModal()
    } catch (err) {
      setError(err.message || 'Unable to save user.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser(id) {
    const confirmed = window.confirm('Delete this user?')
    if (!confirmed) return

    setDeletingId(id)
    setError('')

    try {
      await request(`/users/${id}`, { method: 'DELETE' })
      await loadUsers()
      await checkDatabase()
    } catch (err) {
      setError(err.message || 'Unable to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">
            <Cloud size={19} />
          </span>
          <span>
            <strong>Cloud Users</strong>
            <small>Azure + FastAPI</small>
          </span>
        </a>

        <div className="topbar-actions">
          <a
            className="docs-link"
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
          >
            API Docs
            <ArrowUpRight size={15} />
          </a>
          <div className={`status-pill ${status}`}>
            <span className="status-dot" />
            {status === 'online'
              ? 'Database online'
              : status === 'checking'
                ? 'Checking...'
                : 'Database offline'}
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Live cloud application
            </div>
            <h1>
              Manage your users
              <span> from one polished dashboard.</span>
            </h1>
            <p>
              A production-style React frontend connected to your Azure-hosted
              FastAPI API and PostgreSQL database.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={openCreate}>
                <Plus size={18} />
                Add user
              </button>
              <a
                className="secondary-btn"
                href={`${API_BASE_URL}/docs`}
                target="_blank"
                rel="noreferrer"
              >
                Explore API
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <div>
                <span className="hero-card-kicker">Architecture</span>
                <h3>Full-stack cloud flow</h3>
              </div>
              <Activity size={20} />
            </div>
            <div className="flow">
              <div className="flow-node">
                <div className="flow-icon react-icon">R</div>
                <div>
                  <strong>React</strong>
                  <span>Frontend</span>
                </div>
              </div>
              <div className="flow-line" />
              <div className="flow-node">
                <div className="flow-icon api-icon">A</div>
                <div>
                  <strong>FastAPI</strong>
                  <span>REST API</span>
                </div>
              </div>
              <div className="flow-line" />
              <div className="flow-node">
                <div className="flow-icon db-icon">DB</div>
                <div>
                  <strong>PostgreSQL</strong>
                  <span>Azure database</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Users size={19} /></div>
            <span>Total users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Database size={19} /></div>
            <span>Database</span>
            <strong>PostgreSQL</strong>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Server size={19} /></div>
            <span>Backend</span>
            <strong>FastAPI</strong>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircle2 size={19} /></div>
            <span>Deployment</span>
            <strong>Azure</strong>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Directory</span>
              <h2>User management</h2>
              <p>View, create, update, and delete records through your live API.</p>
            </div>
            <button className="primary-btn small" onClick={openCreate}>
              <Plus size={16} />
              Add user
            </button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email..."
              />
            </div>
            <button className="ghost-btn" onClick={() => Promise.all([loadUsers(), checkDatabase()])}>
              Refresh
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError('')} aria-label="Dismiss error">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <LoaderCircle className="spin" size={24} />
                      <span>Loading users...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <Users size={25} />
                      <span>{query ? 'No matching users found.' : 'No users yet.'}</span>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td><span className="id-badge">#{user.id}</span></td>
                      <td>
                        <div className="user-cell">
                          <div className="avatar">{user.name?.charAt(0)?.toUpperCase() || '?'}</div>
                          <div>
                            <strong>{user.name}</strong>
                            <span>Active user</span>
                          </div>
                        </div>
                      </td>
                      <td className="email-cell">{user.email}</td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" title="Edit" onClick={() => openEdit(user)}>
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Delete"
                            onClick={() => deleteUser(user.id)}
                            disabled={deletingId === user.id}
                          >
                            {deletingId === user.id ? (
                              <LoaderCircle className="spin" size={16} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          <span>Connected to your Azure FastAPI backend</span>
          <span className="footer-separator">•</span>
          <span>FastAPI + PostgreSQL</span>
        </footer>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="panel-kicker">{editingUser ? 'Edit record' : 'New record'}</span>
                <h3>{editingUser ? 'Update user' : 'Add a user'}</h3>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitUser}>
              <label>
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="e.g. Tamil Kumaran"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="name@example.com"
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? <LoaderCircle className="spin" size={16} /> : editingUser ? <Edit3 size={16} /> : <Plus size={16} />}
                  {saving ? 'Saving...' : editingUser ? 'Save changes' : 'Create user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
