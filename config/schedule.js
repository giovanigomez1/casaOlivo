// Configuración del horario del restaurante
const SCHEDULE = {
  timezone: 'America/Mexico_City',
  openingTime: '13:00',
  lastSeating: '21:30',      // cierra a las 22:00; última reserva 30 min antes
  slotMinutes: 30,
  closedDays: [1],           // 0 = domingo, 1 = lunes, ... 6 = sábado
  maxGuestsPerSlot: 20,      // capacidad por horario
  maxGuestsPerReservation: 10,
};

// "13:30" -> 810
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// 810 -> "13:30"
function toHHMM(total) {
  const h = String(Math.floor(total / 60)).padStart(2, '0');
  const m = String(total % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// Genera ['13:00', '13:30', ..., '21:30']
function generateSlots() {
  const slots = [];
  const start = toMinutes(SCHEDULE.openingTime);
  const end = toMinutes(SCHEDULE.lastSeating);
  for (let t = start; t <= end; t += SCHEDULE.slotMinutes) {
    slots.push(toHHMM(t));
  }
  return slots;
}

const TIME_SLOTS = generateSlots();

// Verifica formato "YYYY-MM-DD" y que la fecha exista (rechaza 2026-02-30)
function isValidDateString(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

// Día de la semana de "YYYY-MM-DD", sin problemas de zona horaria
function getDayOfWeek(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function isClosedDay(dateStr) {
  return SCHEDULE.closedDays.includes(getDayOfWeek(dateStr));
}

function isValidSlot(time) {
  return TIME_SLOTS.includes(time);
}

// Fecha y hora actuales en la zona del restaurante, no del servidor
function getNowInRestaurant() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE.timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  };
}

// ¿Esa fecha y hora ya pasaron?
function isPastSlot(dateStr, time) {
  const now = getNowInRestaurant();
  if (dateStr < now.date) return true;
  if (dateStr > now.date) return false;
  return time <= now.time; // es hoy: compara la hora
}

export {
  SCHEDULE,
  TIME_SLOTS,
  isValidDateString,
  isClosedDay,
  isValidSlot,
  isPastSlot,
  getNowInRestaurant,
};