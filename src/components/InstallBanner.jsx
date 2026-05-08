export default function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '72px',
      left: '12px',
      right: '12px',
      background: '#2a1500',
      border: '1px solid #8B6914',
      borderRadius: '12px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
    }}>
      <img src="/logo-192.png" alt="logo" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', color: '#f5e6c8', fontSize: 14, fontWeight: 600 }}>
          The Wolf Barbería
        </p>
        <p style={{ margin: '2px 0 0', color: 'rgba(245,230,200,0.6)', fontSize: 12 }}>
          Instalá la app en tu dispositivo
        </p>
      </div>
      <button
        onClick={onInstall}
        style={{
          background: '#8B6914',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 14px',
          fontFamily: 'Oswald, sans-serif',
          fontSize: 13,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Instalar
      </button>
      <button
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(245,230,200,0.4)',
          fontSize: 18,
          cursor: 'pointer',
          padding: '0 4px',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  )
}
