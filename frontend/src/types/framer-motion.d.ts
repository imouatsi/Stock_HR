declare module 'framer-motion' {
  import * as React from 'react';

  export const motion: {
    div: React.FC<any>;
    span: React.FC<any>;
    button: React.FC<any>;
    path: React.FC<any>; // Add missing path
    tr: React.FC<any>; // Add missing tr
    // Add other motion components as needed
  };

  export const AnimatePresence: React.FC<{ children: React.ReactNode }>;

  export function useAnimation(): any;
  export function useMotionValue(initial: number): any;
  export function useTransform(value: any, transform: (input: any) => any): any;
  export function animate(from: any, to: any, options?: any): any;
}
