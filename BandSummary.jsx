import { T, btn } from '../theme.js'

export default function BandSummary({
  faccion, miniaturas, totalPts, maxMinis, aceCount, errores,
  nombreBanda, setNombreBanda,
  onAddMini, onExport, onImport,
}) {
  const pct = Math.min(100, (totalPts / 400) * 100)
  const acePct = faccion?.maxAcero ? Math.min(100, (aceCount / faccion.maxAcero) * 100) : 0

  const tiposCount = {}
  miniaturas.forEach(m => { tiposCount[m.tipo] = (tiposCount[m.tipo] || 0) + 1 })

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, overflow: 'hidden',
      position: 'sticky', top: 10,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(90deg, #3d1a00, #2a1000)`,
        borderBottom: `2px solid #7a4010`,
        padding: '12px 16px',
      }}>
        <input
          value={nombreBanda}
          onChange={e => setNombreBanda(e.target.value)}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: T.gold, fontSize: 18, fontWeight: 700, fontFamily: 'Georgia',
            width: '100%', letterSpacing: 0.5,
          }}
          placeholder="Nombre de la banda"
        />
        <div style={{ fontSize: 12, color: T.textMut, marginTop: 2 }}>{faccion?.nombre}</div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Pts bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: T.textDim }}>Puntos de banda</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: totalPts > 400 ? T.red : T.gold, fontFamily: 'monospace' }}>
              {totalPts} / 400
            </span>
          </div>
          <div style={{ height: 6, background: T.border, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3, transition: 'width 0.3s',
              width: `${pct}%`,
              background: totalPts > 400 ? T.red : totalPts > 360 ? T.orange : T.green,
            }} />
          </div>
        </div>

        {/* Miniaturas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: T.textDim }}>Miniaturas</span>
          <span style={{ fontSize: 13, color: T.text, fontFamily: 'monospace' }}>
            {miniaturas.length} / {maxMinis}
          </span>
        </div>

        {/* Acero */}
        {faccion?.maxAcero !== null && faccion?.maxAcero > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: T.textDim }}>Armas de acero</span>
              <span style={{ fontSize: 13, color: aceCount > (faccion.maxAcero || 3) ? T.red : T.text, fontFamily: 'monospace' }}>
                {aceCount} / {faccion.maxAcero || 3}
              </span>
            </div>
            <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2, transition: 'width 0.3s',
                width: `${acePct}%`,
                background: aceCount >= (faccion.maxAcero || 3) ? T.red : T.blue,
              }} />
            </div>
          </div>
        )}

        {faccion?.maxAcero === null && (
          <div style={{ fontSize: 11, color: T.green, marginBottom: 8 }}>✓ Sin límite de acero (Tribu del Rostro Negro)</div>
        )}

        {/* Composición */}
        {Object.keys(tiposCount).length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {Object.entries(tiposCount).map(([tipo, n]) => (
              <div key={tipo} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.textDim, marginBottom: 2 }}>
                <span>{tipo}</span>
                <span style={{ fontFamily: 'monospace', color: T.text }}>×{n}</span>
              </div>
            ))}
          </div>
        )}

        {/* Errores */}
        {errores.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {errores.map((e, i) => (
              <div key={i} style={{
                fontSize: 11, color: '#e88070',
                background: 'rgba(192,57,43,0.1)',
                border: '1px solid rgba(192,57,43,0.3)',
                borderRadius: 6, padding: '6px 10px', marginBottom: 4,
              }}>{e}</div>
            ))}
          </div>
        )}

        {errores.length === 0 && miniaturas.length > 0 && (
          <div style={{
            fontSize: 11, color: '#90e0a8',
            background: 'rgba(39,174,96,0.1)',
            border: '1px solid rgba(39,174,96,0.3)',
            borderRadius: 6, padding: '6px 10px', marginBottom: 12,
          }}>✓ Lista válida</div>
        )}

        {/* Añadir tropa */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: T.textMut, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
            Añadir tropa
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {faccion?.tropas.map(tropa => (
              <button
                key={tropa.id}
                onClick={() => onAddMini(tropa)}
                disabled={miniaturas.length >= maxMinis}
                style={btn('ghost', {
                  fontSize: 12, padding: '8px 12px',
                  display: 'flex', justifyContent: 'space-between',
                  opacity: miniaturas.length >= maxMinis ? 0.4 : 1,
                })}
              >
                <span>{tropa.tipo}</span>
                <span style={{ color: T.gold, fontFamily: 'monospace' }}>{tropa.pts} pts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button onClick={onExport} style={btn('primary', { fontSize: 12, padding: '8px 14px', flex: 1 })}>
            📋 Exportar
          </button>
          <button onClick={onImport} style={btn('ghost', { fontSize: 12, padding: '8px 14px', flex: 1 })}>
            📂 Importar
          </button>
        </div>
      </div>

      {/* Rules */}
      {faccion?.reglasBanda?.length > 0 && (
        <details style={{ borderTop: `1px solid ${T.border}` }}>
          <summary style={{
            padding: '10px 16px', cursor: 'pointer',
            fontSize: 12, color: T.textDim, listStyle: 'none',
          }}>
            📜 Reglas de banda ({faccion.reglasBanda.length})
          </summary>
          <div style={{ padding: '0 16px 12px' }}>
            {faccion.reglasBanda.map((r, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 3 }}>{r.nombre}</div>
                <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.6 }}>{r.texto}</div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
