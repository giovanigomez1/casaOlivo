const TIMEZONE = 'America/Mexico_City'

// Fecha de hoy en México como "YYYY-MM-DD", sin importar dónde corra el servidor
function todayInRestaurant() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date())
}

// Próxima fecha (a partir de mañana) que caiga en ese día de la semana
// 0 = domingo, 6 = sábado
function nextDayOfWeek(dayOfWeek) {
  const [y, m, d] = todayInRestaurant().split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  do {
    date.setUTCDate(date.getUTCDate() + 1)
  } while (date.getUTCDay() !== dayOfWeek)
  return date.toISOString().slice(0, 10)
}

const saturday = nextDayOfWeek(6)
const sunday = nextDayOfWeek(0)

export default [
  // ── SÁBADO ─────────────────────────────────────────
  // 13:30 → 4 personas
  {
    name: 'Luis Martínez', email: 'luis@example.com', phone: '5523456789',
    date: saturday, time: '13:30', guests: 4, code: 'CO-1001'
  },

  // 14:00 → 2 personas
  {
    name: 'Sofía Ramírez', email: 'sofia@example.com', phone: '5587654321',
    date: saturday, time: '14:00', guests: 2, code: 'CO-1002',
    specialRequest: 'Mesa en terraza'
  },

  // 19:30 → 10 confirmadas (la cancelada de Jorge NO cuenta)
  {
    name: 'Ana García', email: 'ana@example.com', phone: '5512345678',
    date: saturday, time: '19:30', guests: 4, code: 'CO-1003',
    specialRequest: 'Cumpleaños'
  },
  {
    name: 'Diego López', email: 'diego@example.com', phone: '5599887766',
    date: saturday, time: '19:30', guests: 6, code: 'CO-1004',
    specialRequest: 'Alergia a nueces'
  },
  {
    name: 'Jorge Hernández', email: 'jorge@example.com', phone: '5511223344',
    date: saturday, time: '19:30', guests: 5, code: 'CO-1005',
    status: 'cancelled'
  },

  // 20:00 → 20 personas: horario LLENO
  {
    name: 'Valeria Torres', email: 'valeria@example.com', phone: '5555667788',
    date: saturday, time: '20:00', guests: 8, code: 'CO-1006',
    specialRequest: 'Silla para bebé'
  },
  {
    name: 'Camila Reyes', email: 'camila@example.com', phone: '5533445566',
    date: saturday, time: '20:00', guests: 6, code: 'CO-1007'
  },
  {
    name: 'Mateo Flores', email: 'mateo@example.com', phone: '5566778899',
    date: saturday, time: '20:00', guests: 6, code: 'CO-1008'
  },

  // 21:00 → 3 personas
  {
    name: 'Pablo Vargas', email: 'pablo@example.com', phone: '5544556677',
    date: saturday, time: '21:00', guests: 3, code: 'CO-1009'
  },

  // ── DOMINGO ────────────────────────────────────────
  // 14:00 → 9 personas
  {
    name: 'Fernanda Cruz', email: 'fernanda@example.com', phone: '5577889900',
    date: sunday, time: '14:00', guests: 5, code: 'CO-1010'
  },
  {
    name: 'Ricardo Morales', email: 'ricardo@example.com', phone: '5522334455',
    date: sunday, time: '14:00', guests: 4, code: 'CO-1011'
  },

  // 20:30 → 2 personas
  {
    name: 'Elena Ruiz', email: 'elena@example.com', phone: '5588990011',
    date: sunday, time: '20:30', guests: 2, code: 'CO-1012'
  },
]