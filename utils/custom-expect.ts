import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';
import { validateSchema } from './schema-validator';

let apiLogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger;
};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      shouldMatchSchema(dirName: string, fileName: string): Promise<R>;
    }
  }
}

export const expect = baseExpect.extend({
  async shouldMatchSchema(recieved: any, dirName: string, fileName: string) {
    let pass: boolean;
    let message = '';

    try {
      await validateSchema(dirName, fileName, recieved);
      pass = true;
      message = 'Schema validation Passed';
    } catch (error: any) {
      pass = false;
      const logs = apiLogger.getRecentLogs();
      message = `${error.message}\n\nRecent API Activity: \n${logs}`;
    }
    return {
      message: () => message,
      pass,
    };
  },
});
