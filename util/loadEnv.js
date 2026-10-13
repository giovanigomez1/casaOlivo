// Se importa PRIMERO en server.js y seed.js.
// Con ES Modules los imports se ejecutan antes que el resto del archivo,
// así que dotenv.config() tiene que vivir en su propio módulo para correr
// antes de que app.js lea process.env.
import dotenv from 'dotenv'

dotenv.config({ path: './config.env', quiet: true })
