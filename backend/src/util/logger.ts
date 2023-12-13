/* eslint-disable no-console */

import { LOGGING_LEVEL } from './config';

class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: string, ...params: any[]) {
    if (LOGGING_LEVEL === 'info') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      console.log(message, ...params);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: string, ...params: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.error(message, ...params);
  }
}

const logger = new Logger();

export default logger;
