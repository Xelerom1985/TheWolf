export default function Home({ novedades, onSacarTurno }) {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative', background: '#0d0d0d' }}>

      {/* Fondo pelu esfumado */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '65vh',
        backgroundImage: 'url(/pelu.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        zIndex: 0,
      }}>
        {/* Overlay oscuro: semi-transparente arriba, negro total abajo */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.75) 50%, rgba(13,13,13,1) 100%)',
        }} />
      </div>

      {/* Contenido encima del fondo */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <img
          src="/logo.jpg"
          alt="The Wolf"
          style={{
            width: 160, height: 160,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #c9a84c',
            boxShadow: '0 0 40px rgba(201,168,76,0.3), 0 0 80px rgba(201,168,76,0.12)',
            marginTop: 52,
          }}
        />

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          color: '#c9a84c',
          fontSize: 36,
          letterSpacing: 4,
          margin: '16px 0 0',
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          THE WOLF
        </h1>

        <p style={{
          fontFamily: 'Special Elite, cursive',
          color: 'rgba(245,230,200,0.55)',
          fontSize: 13,
          letterSpacing: 6,
          textTransform: 'uppercase',
          margin: '4px 0 0',
        }}>
          Barbería
        </p>

        <div style={{ width: 120, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '12px 0' }} />

        <div style={{ display: 'flex', gap: 8 }}>
          {['✂ Jorge', '✂ Daniela'].map(label => (
            <span key={label} style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 20,
              padding: '3px 12px',
              fontFamily: 'Oswald, sans-serif',
              fontSize: 12,
              color: '#c9a84c',
              letterSpacing: 1,
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* Novedades */}
        {novedades.length > 0 && (
          <div style={{ width: '100%', maxWidth: 360, padding: '0 16px', marginTop: 28 }}>
            <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 8 }}>
              📢 Novedades
            </p>
            {novedades.map(n => (
              <div key={n.id} style={{
                background: 'rgba(26,26,26,0.92)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 8,
              }}>
                <p style={{ fontFamily: 'Special Elite, cursive', fontSize: 14, margin: 0, lineHeight: 1.4 }}>
                  {n.texto}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ width: '100%', maxWidth: 360, padding: '0 16px', marginTop: novedades.length ? 16 : 36 }}>
          <button
            onClick={onSacarTurno}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
              color: '#0d0d0d',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 3,
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 14,
              padding: '18px 0',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(201,168,76,0.35)',
            }}
          >
            ✂️ SACAR TURNO
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'rgba(245,230,200,0.3)',
            marginTop: 12,
            fontFamily: 'Oswald, sans-serif',
            letterSpacing: 1,
          }}>
            Turnos de 30 a 40 min · Lun a Sáb
          </p>
        </div>

        {/* Redes sociales */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 360,
          padding: '24px 16px 0',
        }}>
          {/* WhatsApp */}
          <a
            href="https://wa.me/5491134554212"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 11,
              color: 'rgba(245,230,200,0.55)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Contactanos
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/thewolf_peluqueriabarberia?igsh=MWtlMXdrc3dydzJpdQ=="
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="url(#igGrad)">
              <defs>
                <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433"/>
                  <stop offset="25%" stopColor="#e6683c"/>
                  <stop offset="50%" stopColor="#dc2743"/>
                  <stop offset="75%" stopColor="#cc2366"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 11,
              color: 'rgba(245,230,200,0.55)',
              letterSpacing: 1,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}>
              Seguinos
            </span>
          </a>
        </div>

      </div>
    </div>
  )
}
