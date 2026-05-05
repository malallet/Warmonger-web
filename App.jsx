import { useState, useEffect, useCallback } from 'react'
import { T } from './theme.js'
import { useBand } from './hooks/useBand.js'
import FactionSelector from './components/FactionSelector.jsx'
import MiniEditor from './components/MiniEditor.jsx'
import BandSummary from './components/BandSummary.jsx'

// Hook para detectar ancho de ventana de forma segura (no en render)
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}

export default function App() {
  const {
    faccion, selectFaccion,
    miniaturas, addMini, removeMini, updateMini, setLider,
    totalPts, aceCount, maxMinis, errores,
    nombreBanda, setNombreBanda,
    calcPts, exportBanda, importBanda,
  } = useBand()

  const [vista, setVista] = useState('editor')
  const width = useWindowWidth()
  const isMobile = width < 700

  const handleExport = useCallback(() => {
    const json = exportBanda()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => alert('✓ Lista copiada al portapapeles'))
    } else {
      const ta = document.createElement('textarea')
      ta.value = json
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch(e) {}
      document.body.removeChild(ta)
      alert('✓ Lista copiada al portapapeles')
    }
  }, [exportBanda])

  const handleImport = useCallback(() => {
    const json = prompt('Pega aquí tu lista exportada:')
    if (json) importBanda(json)
  }, [importBanda])

  const handleChangeFaccion = () => {
    if (miniaturas.length === 0 || confirm('¿Cambiar de facción? Perderás la banda actual.')) {
      selectFaccion(null)
    }
  }

  if (!faccion) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>
        <FactionSelector onSelect={selectFaccion} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#0a0700', borderBottom: `1px solid ${T.border}`,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={handleChangeFaccion} style={{
          background: 'transparent', border: 'none',
          color: T.textDim, cursor: 'pointer', fontSize: 20, padding: 0,
        }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 16, fontWeight: 700, color: T.gold,
            fontFamily: 'Georgia',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {nombreBanda}
          </div>
          <div style={{ fontSize: 11, color: T.textDim }}>{faccion.nombre}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 18, fontWeight: 700,
            color: totalPts > 400 ? T.red : T.gold,
            fontFamily: 'monospace',
          }}>{totalPts} pts</div>
          <div style={{ fontSize: 10, color: T.textMut }}>/ 400</div>
        </div>

        {isMobile && (
          <div style={{ display: 'flex', gap: 4 }}>
            {['editor','resumen'].map(v => (
              <button key={v} onClick={() => setVista(v)} style={{
                background: vista === v ? 'rgba(200,160,60,0.15)' : 'transparent',
                border: `1px solid ${vista === v ? T.goldDim : T.border}`,
                color: vista === v ? T.gold : T.textDim,
                borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
                fontSize: 11, fontFamily: 'Georgia',
              }}>
                {v === 'editor' ? '⚔' : '📋'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex', gap: 16, padding: 16,
        maxWidth: 1000, margin: '0 auto',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
      }}>
        {(!isMobile || vista === 'editor') && (
          <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
            {errores.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {errores.map((e, i) => (
                  <div key={i} style={{
                    fontSize: 12, color: '#e88070',
                    background: 'rgba(192,57,43,0.1)',
                    border: '1px solid rgba(192,57,43,0.3)',
                    borderRadius: 6, padding: '6px 10px', marginBottom: 4,
                  }}>{e}</div>
                ))}
              </div>
            )}
            {miniaturas.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: T.textMut, background: T.card,
                border: `1px dashed ${T.border}`, borderRadius: 10,
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⚔</div>
                <div style={{ fontSize: 14, color: T.textDim }}>
                  Usa el panel de Resumen para añadir tropas
                </div>
              </div>
            ) : (
              miniaturas.map(mini => (
                <MiniEditor
                  key={mini.uid}
                  mini={mini}
                  faccion={faccion}
                  calcPts={calcPts}
                  onUpdate={changes => updateMini(mini.uid, changes)}
                  onRemove={() => removeMini(mini.uid)}
                  onSetLider={() => setLider(mini.uid)}
                />
              ))
            )}
          </div>
        )}

        {(!isMobile || vista === 'resumen') && (
          <div style={{ width: isMobile ? '100%' : 280, flexShrink: 0 }}>
            <BandSummary
              faccion={faccion}
              miniaturas={miniaturas}
              totalPts={totalPts}
              maxMinis={maxMinis}
              aceCount={aceCount}
              errores={errores}
              nombreBanda={nombreBanda}
              setNombreBanda={setNombreBanda}
              onAddMini={addMini}
              onExport={handleExport}
              onImport={handleImport}
            />
          </div>
        )}
      </div>
    </div>
  )
}
