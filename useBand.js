import { useState, useCallback } from 'react'
import ARMAS_DATA from '../data/armas.json'
import MEJORAS_DATA from '../data/mejoras.json'
import HECHIZOS_DATA from '../data/hechizos.json'

export const ARMAS    = ARMAS_DATA
export const MEJORAS  = MEJORAS_DATA
export const HECHIZOS = HECHIZOS_DATA

let nextId = 1
const uid = () => `mini_${nextId++}`

const newMini = (tropa, faccion) => ({
  uid: uid(),
  tipo: tropa.tipo,
  tropaRef: tropa,
  nombre: tropa.tipo,  // editable
  esLider: false,
  // selecciones
  armas: [],
  blindaje: null,
  equipo: [],
  mejoras: [],
  familiar: null,
  hechizos: { '1': null, '2': null, '3': null },
  esBruja: false,
  forma: null,  // Cambiapieles
})

const calcPts = (mini) => {
  let pts = mini.tropaRef.pts
  mini.armas.forEach(id => { pts += ARMAS[id]?.pts || 0 })
  if (mini.blindaje) pts += ARMAS[mini.blindaje]?.pts || 0
  mini.equipo.forEach(id => { pts += ARMAS[id]?.pts || 0 })
  mini.mejoras.forEach(id => { pts += MEJORAS[id]?.pts || 0 })
  if (mini.familiar) pts += MEJORAS[mini.familiar]?.pts || 0
  Object.values(mini.hechizos).forEach(id => { if (id) pts += HECHIZOS[id]?.pts || 0 })
  if (mini.esBruja) pts += 15
  return pts
}

export function useBand() {
  const [faccion, setFaccion] = useState(null)
  const [miniaturas, setMiniaturas] = useState([])
  const [nombreBanda, setNombreBanda] = useState('Mi Banda')

  const totalPts = miniaturas.reduce((sum, m) => sum + calcPts(m), 0)

  const aceCount = miniaturas.reduce((sum, m) => {
    return sum + m.armas.filter(id => ARMAS[id]?.esAcero).length
  }, 0)

  const maxMinis = faccion ? (() => {
    if (totalPts <= 100) return 3
    if (totalPts <= 200) return 6
    if (totalPts <= 300) return 9
    if (totalPts <= 400) return 12
    return 15
  })() : 0

  // Validaciones
  const errores = []
  if (faccion) {
    if (totalPts > 400) errores.push(`⚠ Superado el límite de 400 pts (${totalPts} pts)`)
    if (faccion.maxAcero !== null && aceCount > (faccion.maxAcero || 0)) {
      errores.push(`⚠ Máximo ${faccion.maxAcero} armas de acero (tienes ${aceCount})`)
    }
    // Nigromante obligatorio (Polvo y Huesos)
    if (faccion.id === 'polhu') {
      const tieneNigro = miniaturas.some(m => m.tipo === 'Hechicero' && !m.esBruja)
      if (!tieneNigro) errores.push('⚠ Polvo y Huesos necesita al menos 1 Nigromante (Hechicero) como Líder')
    }
    // Líder obligatorio
    const tieneL = miniaturas.some(m => m.esLider)
    if (miniaturas.length > 0 && !tieneL) errores.push('⚠ La banda necesita un Líder')
    // Solo 1 Bruja
    const brujas = miniaturas.filter(m => m.esBruja).length
    if (brujas > 1) errores.push('⚠ Solo puede haber 1 Bruja por banda')
  }

  const addMini = useCallback((tropa) => {
    setMiniaturas(prev => [...prev, newMini(tropa, faccion)])
  }, [faccion])

  const removeMini = useCallback((uid) => {
    setMiniaturas(prev => prev.filter(m => m.uid !== uid))
  }, [])

  const updateMini = useCallback((uid, changes) => {
    setMiniaturas(prev => prev.map(m => m.uid === uid ? { ...m, ...changes } : m))
  }, [])

  const setLider = useCallback((uid) => {
    setMiniaturas(prev => prev.map(m => ({ ...m, esLider: m.uid === uid })))
  }, [])

  const selectFaccion = useCallback((f) => {
    setFaccion(f)
    setMiniaturas([])
  }, [])

  const exportBanda = () => {
    const data = { nombre: nombreBanda, faccion: faccion?.id, fecha: new Date().toISOString(), miniaturas, totalPts }
    return JSON.stringify(data, null, 2)
  }

  const importBanda = (json) => {
    try {
      const data = JSON.parse(json)
      setNombreBanda(data.nombre || 'Mi Banda')
      setMiniaturas(data.miniaturas || [])
    } catch(e) { alert('Error al importar la lista') }
  }

  return {
    faccion, selectFaccion,
    miniaturas, addMini, removeMini, updateMini, setLider,
    totalPts, aceCount, maxMinis, errores,
    nombreBanda, setNombreBanda,
    calcPts,
    exportBanda, importBanda,
  }
}
