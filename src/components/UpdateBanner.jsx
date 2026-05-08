export default function UpdateBanner({ onUpdate }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 64,
      left: 0,
      right: 0,
      background: '#1a0a00',
      borderTop: '1px solid #c9a84c',
      borderBottom: '1px solid #c9a84c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      zIndex: 45,
    }}>
      <span style={{ fontSize: 13, fontFamily: 'Oswald, sans-serif', color: '#f5e6c8' }}>
        Nueva versión disponible
      </span>
      <button
        onClick={onUpdate}
        style={{
          background: 'linear-gradient(135deg,#c9a84c,#e8c97a)',
          color: '#0d0d0d',
          fontFamily: 'Oswald, sans-serif',
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: 1,
          border: 'none',
          borderRadius: 6,
          padding: '6px 14px',
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        Actualizar
      </button>
    </div>
  )
}
