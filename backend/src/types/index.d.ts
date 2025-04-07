declare module 'xss-clean' {
    const xss: () => import('express').RequestHandler;
    export default xss;
}

declare module 'compression' {
    const compression: () => import('express').RequestHandler;
    export default compression;
}

declare module 'cookie-parser' {
    const cookieParser: () => import('express').RequestHandler;
    export default cookieParser;
}

declare module 'morgan' {
    const morgan: (format: string) => import('express').RequestHandler;
    export default morgan;
} 