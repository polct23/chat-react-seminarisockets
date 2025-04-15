import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  transport: {
    target: "pino-pretty", // Define el transport como pino-pretty
    options: {
      colorize: true, // Habilita colores en la salida
      translateTime: true, // Traduce la marca de tiempo a un formato legible
    },
  },
  base: {
    pid: false, // Elimina el ID del proceso de los logs
  },
  timestamp: () => `,"time":"${dayjs().format()}"`, // Agrega una marca de tiempo personalizada
});

export default log;