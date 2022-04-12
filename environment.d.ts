// Type definition for process.env
// https://stackoverflow.com/a/53981706/554821

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AIRTABLE_API_KEY: string;
      AIRTABLE_BASE: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {}
