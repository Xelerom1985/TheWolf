const items = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'misturno', label: 'Mis Turnos', icon: '📅' },
  { id: 'admin', label: 'Admin', icon: '⚙️', adminOnly: true },
]

export default function Navbar({ page, setPage, authed }) {
  const visible = items.filter(i => !i.adminOnly || authed)

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#141414',
      borderTop: '1px solid rgba(201,168,76,0.2)',
      display: 'flex',
      zIndex: 40,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {visible.map(item => {
        const active = page === item.id
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#c9a84c' : 'rgba(245,230,200,0.4)',
              transition: 'color 0.2s',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: 0.5 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
