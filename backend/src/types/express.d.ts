import { RequestHandler } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      role: string;
      isAuthorized: boolean;
    }
  }
}

declare module 'xss-clean' {
  const xss: () => RequestHandler;
  export default xss;
}

declare module 'compression' {
  const compression: () => RequestHandler;
  export default compression;
}

declare module 'cookie-parser' {
  const cookieParser: () => RequestHandler;
  export default cookieParser;
}

declare module 'morgan' {
  const morgan: (format: string) => RequestHandler;
  export default morgan;
} 