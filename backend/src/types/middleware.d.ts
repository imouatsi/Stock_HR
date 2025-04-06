import { RequestHandler } from 'express';

declare module 'cookie-parser' {
  const cookieParser: () => RequestHandler;
  export default cookieParser;
}

declare module 'compression' {
  const compression: () => RequestHandler;
  export default compression;
}

declare module 'morgan' {
  const morgan: (format: string) => RequestHandler;
  export default morgan;
}

declare module 'cors' {
  const cors: () => RequestHandler;
  export default cors;
}

declare module 'helmet' {
  const helmet: () => RequestHandler;
  export default helmet;
} 