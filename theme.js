export const T = {
  bg:       '#0e0a04',
  surface:  '#1a1208',
  card:     '#211608',
  border:   '#3a2810',
  borderHi: '#7a4810',
  gold:     '#e8c060',
  goldDim:  '#a08030',
  text:     '#e0c898',
  textDim:  '#8a7050',
  textMut:  '#5a4530',
  red:      '#c0392b',
  green:    '#27ae60',
  blue:     '#2980b9',
  orange:   '#e67e22',
  purple:   '#8e44ad',
}

export const STAT_LABELS = ['A','C','P','F','D','CO']
export const STAT_NAMES  = {
  A:'Agilidad', C:'Combate', P:'Precisión',
  F:'Fuerza',   D:'Dureza',  CO:'Coraje',
}

export const NIVEL_COLOR = { '1': T.green, '2': T.orange, '3': T.red }

export const CAT_STYLE = {
  'Arma':            { bg:'#3d1a1a', bd:'#c0392b', tx:'#e8a090' },
  'Blindaje':        { bg:'#1a2a3d', bd:'#2980b9', tx:'#90b8e0' },
  'Equipo':          { bg:'#1a3d2a', bd:'#27ae60', tx:'#90e0a8' },
  'Mejora':          { bg:'#3d2a1a', bd:'#e67e22', tx:'#e0c090' },
  'Familiar':        { bg:'#2a1a2a', bd:'#8e44ad', tx:'#e0a0e0' },
  'Hechizo':         { bg:'#1a1a3d', bd:'#3498db', tx:'#90c0e8' },
  'Forma':           { bg:'#1a3d3d', bd:'#16a085', tx:'#90e0d8' },
}

export const btn = (variant='primary', extra={}) => ({
  border: 'none', cursor: 'pointer', borderRadius: 8,
  fontFamily: 'Georgia, serif', fontWeight: 600,
  transition: 'all 0.15s',
  padding: '10px 18px', fontSize: 14,
  ...(variant === 'primary' ? {
    background: `linear-gradient(135deg, #7a3010, #5a1e08)`,
    color: T.gold, border: `1px solid #c06020`,
  } : variant === 'danger' ? {
    background: 'rgba(192,57,43,0.15)',
    color: '#e88070', border: '1px solid #c0392b44',
  } : variant === 'ghost' ? {
    background: 'transparent',
    color: T.textDim, border: `1px solid ${T.border}`,
  } : variant === 'success' ? {
    background: 'rgba(39,174,96,0.15)',
    color: '#90e0a8', border: '1px solid #27ae6044',
  } : {}),
  ...extra,
})
