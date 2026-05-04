import { useState } from 'react'
import { T, btn } from '../theme.js'
import FACCIONES from '../data/facciones.json'

const CAT_MAP = {
  huma: 'Humanos', muer: 'Muertos Vivientes',
  inha: 'Inhumanos', salv: 'Salvajes',
}
const GRUPO = {
  devo:'huma',repu:'huma',sjve:'huma',rnet:'huma',
  dolde:'muer',polhu:'muer',sanvi:'muer',
  camb:'inha',demo:'inha',dite:'inha',pncu:'inha',
  esca:'salv',mana:'salv',pigm:'salv',
}

export default function FactionSelector({ onSelect }) {
  const [hover, setHover] = useState(null)

  const grupos = {}
  FACCIONES.forEach(f => {
    const g = GRUPO[f.id] || 'otro'
    if (!grupos[g]) grupos[g] = []
    grupos[g].push(f)
  })

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: T.textMut, textTransform: 'uppercase', marginBottom: 6 }}>
          Warmonger · Bad Roll Games
        </div>
        <h1 style={{ fontSize: 26, color: T.gold, fontWeight: 700, letterSpacing: 1 }}>
          Constructor de Listas
        </h1>
        <p style={{ color: T.textDim, fontSize: 13, marginTop: 6 }}>
          Elige tu facción para empezar
        </p>
      </div>

      {Object.entries(grupos).map(([gid, facs]) => (
        <div key={gid} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, color: T.textMut, letterSpacing: 3,
            textTransform: 'uppercase', marginBottom: 10,
            borderBottom: `1px solid ${T.border}`, paddingBottom: 4,
          }}>
            {CAT_MAP[gid] || gid}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 10 }}>
            {facs.map(f => (
              <button
                key={f.id}
                onClick={() => onSelect(f)}
                onMouseEnter={() => setHover(f.id)}
                onMouseLeave={() => setHover(null)}
                style={{
                  background: hover === f.id
                    ? `linear-gradient(135deg, ${f.color}44, ${f.color}22)`
                    : `linear-gradient(135deg, ${f.color}22, ${f.color}11)`,
                  border: `1px solid ${hover === f.id ? f.color : f.color + '55'}`,
                  borderRadius: 10, padding: '14px 10px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                  transform: hover === f.id ? 'translateY(-2px)' : 'none',
                  boxShadow: hover === f.id ? `0 4px 20px ${f.color}33` : 'none',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: 'Georgia, serif', marginBottom: 4 }}>
                  {f.nombre}
                </div>
                <div style={{ fontSize: 10, color: T.textDim }}>
                  {f.tropas.length} tipos de tropa
                </div>
                {f.sinHechicero && (
                  <div style={{ fontSize: 9, color: T.orange, marginTop: 3 }}>Sin Hechiceros</div>
                )}
                {f.fuentes.length > 0 && (
                  <div style={{ fontSize: 9, color: '#90c0e8', marginTop: 3 }}>
                    {f.fuentes.length} fuentes de hechicería
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
