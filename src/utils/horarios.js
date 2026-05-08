export const DEFAULT_HORARIO = { horaInicio: '09:00', horaFin: '19:00' }

export function generateSlots(horaInicio, horaFin) {
  const slots = []
  const [sH, sM] = horaInicio.split(':').map(Number)
  const [eH, eM] = horaFin.split(':').map(Number)
  const start = sH * 60 + (sM || 0)
  const end = eH * 60 + (eM || 0)
  for (let t = start; t < end; t += 30) {
    const h = Math.floor(t / 60)
    const m = t % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return slots
}

export function getSlotsForDate(dateStr, config) {
  const dayConfig = config?.horariosPorDia?.[dateStr]
  if (dayConfig?.cerrado) return []
  const horario = dayConfig?.horaInicio
    ? { horaInicio: dayConfig.horaInicio, horaFin: dayConfig.horaFin }
    : (config?.horarioDefault || DEFAULT_HORARIO)
  return generateSlots(horario.horaInicio, horario.horaFin)
}

export function isDayClosed(dateStr, config) {
  return config?.horariosPorDia?.[dateStr]?.cerrado === true
}

export function hasSpecialHours(dateStr, config) {
  const d = config?.horariosPorDia?.[dateStr]
  return d && !d.cerrado && d.horaInicio
}

export function generateAllTimeOptions() {
  const opts = []
  for (let h = 6; h <= 22; h++) {
    opts.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 22) opts.push(`${String(h).padStart(2, '0')}:30`)
  }
  return opts
}
