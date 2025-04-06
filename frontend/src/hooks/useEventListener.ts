import { useEffect, useRef } from 'react';

type EventMap = WindowEventMap & HTMLElementEventMap & DocumentEventMap;

export const useEventListener = <K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element: Window | Document | HTMLElement = window,
  options?: boolean | AddEventListenerOptions
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: EventMap[K]) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}; 