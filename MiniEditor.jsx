import { useState } from 'react'
import { T, btn, STAT_LABELS, STAT_NAMES, NIVEL_COLOR, CAT_STYLE } from '../theme.js'
import { ARMAS, MEJORAS, HECHIZOS } from '../hooks/useBand.js'

function Pill({ label, color }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
      background: color + '22', color, border: `1px solid ${color}55`,
      letterSpacing: 1, textTransform: 'uppercase',
    }}>{label}</span>
  )
}

function StatRow({ stats, extra = {} }) {
  const merged = { ...stats, ...extra }
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {STAT_LABELS.map(k => (
        <div key={k} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: T.bg, border: `1px solid ${T.border}`,
          borderRadius: 6, padding: '5px 9px', minWidth: 40,
        }}>
          <span style={{ fontSize: 10, color: T.textMut, fontFamily: 'monospace' }}>{k}</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: T.gold, lineHeight: 1.1 }}>
            {merged[k] ?? stats[k]}
          </span>
        </div>
      ))}
    </div>
  )
}

function SelectGroup({ title, options, selected, onToggle, max = 99, min = 0, renderLabel }) {
  const count = selected.filter(Boolean).length
  const overMax = count > max
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: T.textMut, letterSpacing: 2, textTransform: 'uppercase' }}>{title}</span>
        <span style={{ fontSize: 11, color: overMax ? T.red : count < min ? T.orange : T.textMut }}>
          {count}/{max === 99 ? '∞' : max}
          {count < min ? ` (mín. ${min})` : ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map(id => {
          const item = ARMAS[id] || MEJORAS[id] || HECHIZOS[id] || {}
          const isSel = selected.includes(id)
          const nombre = item.nombre || item.name || id
          const pts = item.pts ?? 0
          const disabled = !isSel && count >= max
          return (
            <button
              key={id}
              onClick={() => !disabled && onToggle(id)}
              style={{
                background: isSel ? 'rgba(200,160,60,0.12)' : 'transparent',
                border: `1px solid ${isSel ? T.goldDim : T.border}`,
                borderRadius: 6, padding: '7px 10px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                textAlign: 'left', width: '100%',
              }}
            >
              <div>
                <span style={{ fontSize: 13, color: isSel ? T.gold : T.text, fontFamily: 'Georgia' }}>
                  {renderLabel ? renderLabel(id, item) : nombre}
                </span>
                {item.esAcero && <span style={{ fontSize: 9, color: T.blue, marginLeft: 6 }}>ACERO</span>}
                {item.reglas && item.reglas !== '-' && (
                  <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>{item.reglas.slice(0,60)}{item.reglas.length > 60 ? '…' : ''}</div>
                )}
              </div>
              <span style={{ fontSize: 12, color: pts > 0 ? T.gold : T.textMut, fontFamily: 'monospace', whiteSpace: 'nowrap', marginLeft: 8 }}>
                {pts > 0 ? `+${pts}` : 'gratis'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RadioGroup({ title, options, selected, onSelect, renderLabel }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: T.textMut, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map(id => {
          const item = ARMAS[id] || MEJORAS[id] || HECHIZOS[id] || {}
          const isSel = selected === id
          const pts = item.pts ?? 0
          return (
            <button
              key={id}
              onClick={() => onSelect(isSel ? null : id)}
              style={{
                background: isSel ? 'rgba(41,128,185,0.15)' : 'transparent',
                border: `1px solid ${isSel ? T.blue : T.border}`,
                borderRadius: 6, padding: '7px 10px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                textAlign: 'left', width: '100%',
              }}
            >
              <div>
                <span style={{ fontSize: 13, color: isSel ? '#90b8e0' : T.text, fontFamily: 'Georgia' }}>
                  {renderLabel ? renderLabel(id, item) : (item.nombre || id)}
                </span>
                {item.distancia && item.distancia !== 'CaC' && (
                  <span style={{ fontSize: 10, color: T.textDim, marginLeft: 6 }}>{item.distancia}</span>
                )}
              </div>
              <span style={{ fontSize: 12, color: pts > 0 ? T.gold : T.textMut, fontFamily: 'monospace', marginLeft: 8 }}>
                {pts > 0 ? `+${pts}` : 'gratis'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function MiniEditor({ mini, faccion, calcPts, onUpdate, onRemove, onSetLider }) {
  const [open, setOpen] = useState(false)
  const tropa = mini.tropaRef
  const pts = calcPts(mini)

  const toggleArma = (id) => {
    const curr = mini.armas
    if (curr.includes(id)) {
      onUpdate({ armas: curr.filter(x => x !== id) })
    } else {
      const maxArm = tropa.armas[0]?.max || 2
      if (curr.length < maxArm) {
        onUpdate({ armas: [...curr, id] })
      }
    }
  }

  const toggleMejora = (id) => {
    const curr = mini.mejoras
    if (curr.includes(id)) {
      onUpdate({ mejoras: curr.filter(x => x !== id) })
    } else {
      const maxMej = tropa.mejoras[0]?.max || 2
      if (curr.length < maxMej) {
        onUpdate({ mejoras: [...curr, id] })
      }
    }
  }

  const toggleEquipo = (id) => {
    const curr = mini.equipo
    onUpdate({ equipo: curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id] })
  }

  const setHechizo = (nivel, id) => {
    onUpdate({ hechizos: { ...mini.hechizos, [nivel]: id } })
  }

  // Stats con mejoras aplicadas
  const extraStats = {}
  if (mini.mejoras.includes('warm-mhj-agi')) extraStats.A = (tropa.stats.A || 0) + 1
  if (mini.mejoras.includes('warm-mhj-vio')) extraStats.F = (tropa.stats.F || 0) + 1
  if (mini.mejoras.includes('warm-mhj-res')) extraStats.D = (tropa.stats.D || 0) + 1

  // Formas Cambiapieles
  const formaActual = tropa.formas?.find(f => f.nombre === mini.forma)
  const statsActivos = formaActual ? { ...tropa.stats, ...formaActual.stats } : tropa.stats

  return (
    <div style={{
      background: T.card, border: `1px solid ${mini.esLider ? T.goldDim : T.border}`,
      borderRadius: 10, overflow: 'hidden', marginBottom: 10,
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', cursor: 'pointer',
          background: mini.esLider ? 'rgba(200,160,60,0.08)' : 'transparent',
        }}
        onClick={() => setOpen(!open)}
      >
        {mini.esLider && <span style={{ fontSize: 14 }}>👑</span>}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{mini.tipo}</span>
            {mini.esBruja && <Pill label="BRUJA" color={T.purple} />}
          </div>
          <div style={{ fontSize: 11, color: T.textDim }}>
            {mini.armas.map(id => ARMAS[id]?.nombre).filter(Boolean).join(' + ') || 'Sin armas'}
          </div>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.gold, fontFamily: 'monospace' }}>
          {pts} pts
        </span>
        <span style={{ color: T.textMut, fontSize: 14 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${T.border}` }}>

          {/* Stats */}
          <div style={{ margin: '12px 0' }}>
            <StatRow stats={tropa.stats} extra={extraStats} />
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 6 }}>
              {tropa.pd} · {tropa.reglas?.slice(0,80)}{tropa.reglas?.length > 80 ? '…' : ''}
            </div>
          </div>

          {/* Líder */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <button onClick={onSetLider} style={btn(mini.esLider ? 'success' : 'ghost', { fontSize: 12, padding: '6px 12px' })}>
              {mini.esLider ? '👑 Es el Líder' : 'Nombrar Líder'}
            </button>
            <button onClick={onRemove} style={btn('danger', { fontSize: 12, padding: '6px 12px' })}>
              Eliminar
            </button>
          </div>

          {/* Formas (Cambiapieles) */}
          {tropa.formas?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T.textMut, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                Forma de Metamorfosis
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {tropa.formas.map(f => (
                  <button
                    key={f.nombre}
                    onClick={() => onUpdate({ forma: mini.forma === f.nombre ? null : f.nombre })}
                    style={btn(mini.forma === f.nombre ? 'success' : 'ghost', { fontSize: 12, padding: '6px 12px' })}
                  >
                    {f.nombre.replace('Forma ', '')}
                  </button>
                ))}
              </div>
              {formaActual && (
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 6, fontStyle: 'italic' }}>
                  {formaActual.reglas?.slice(0,100)}…
                </div>
              )}
            </div>
          )}

          {/* Armas */}
          {tropa.armas[0]?.opciones?.length > 0 && (
            <SelectGroup
              title={`Armas (mín ${tropa.armas[0].min}, máx ${tropa.armas[0].max})`}
              options={tropa.armas[0].opciones}
              selected={mini.armas}
              onToggle={toggleArma}
              min={tropa.armas[0].min}
              max={tropa.armas[0].max}
            />
          )}

          {/* Blindaje */}
          {tropa.blindaje?.length > 0 && (
            <RadioGroup
              title="Blindaje"
              options={tropa.blindaje}
              selected={mini.blindaje}
              onSelect={id => onUpdate({ blindaje: id })}
            />
          )}

          {/* Equipo */}
          {tropa.equipo?.length > 0 && (
            <SelectGroup
              title="Equipo adicional"
              options={tropa.equipo}
              selected={mini.equipo}
              onToggle={toggleEquipo}
            />
          )}

          {/* Mejoras */}
          {tropa.mejoras?.[0]?.opciones?.length > 0 && (
            <SelectGroup
              title={`Mejoras (máx ${tropa.mejoras[0].max})`}
              options={tropa.mejoras[0].opciones}
              selected={mini.mejoras}
              onToggle={toggleMejora}
              max={tropa.mejoras[0].max}
            />
          )}

          {/* Familiar */}
          {tropa.familiares?.length > 0 && (
            <RadioGroup
              title="Familiar (máx 1)"
              options={tropa.familiares}
              selected={mini.familiar}
              onSelect={id => onUpdate({ familiar: id })}
            />
          )}

          {/* Hechizos */}
          {Object.entries(tropa.hechizos || {}).map(([nivel, ids]) => ids?.length > 0 && (
            <div key={nivel} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                  background: NIVEL_COLOR[nivel] + '22', color: NIVEL_COLOR[nivel],
                  border: `1px solid ${NIVEL_COLOR[nivel]}55`,
                }}>NIVEL {nivel}</span>
                <span style={{ fontSize: 11, color: T.textMut, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Elige 1 hechizo
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ids.map(id => {
                  const h = HECHIZOS[id]
                  if (!h) return null
                  const isSel = mini.hechizos[nivel] === id
                  return (
                    <button key={id} onClick={() => setHechizo(nivel, isSel ? null : id)}
                      style={{
                        background: isSel ? 'rgba(52,152,219,0.12)' : 'transparent',
                        border: `1px solid ${isSel ? T.blue : T.border}`,
                        borderRadius: 6, padding: '7px 10px', cursor: 'pointer',
                        textAlign: 'left', width: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: isSel ? '#90b8e0' : T.text, fontFamily: 'Georgia' }}>
                          {h.nombre}
                        </span>
                        <span style={{ fontSize: 10, color: T.textDim }}>{h.alcance}</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>
                        {h.efecto?.slice(0,80)}{h.efecto?.length > 80 ? '…' : ''}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Bruja */}
          {tropa.tieneBruja && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => onUpdate({ esBruja: !mini.esBruja })}
                style={btn(mini.esBruja ? 'success' : 'ghost', { fontSize: 12, padding: '8px 14px' })}
              >
                {mini.esBruja ? '🧙 Convertida en Bruja (+15 pts)' : 'Convertir en Bruja (+15 pts)'}
              </button>
              {mini.esBruja && (
                <div style={{ fontSize: 11, color: '#e0a0e0', marginTop: 6, padding: '6px 10px', background: 'rgba(142,68,173,0.1)', borderRadius: 6 }}>
                  La Bruja tiene acceso a Elementos + Maldición + Muerte + Brujería. Siempre conoce Sometimiento.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
