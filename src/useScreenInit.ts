import { useMemo } from 'react';
import { manifest } from './canvas.manifest.ts';

type ScreenState = Record<string, unknown>;

export function useScreenInit(): ScreenState {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {};
    }

    const screenId = new URLSearchParams(window.location.search).get('mp_screen');

    if (!screenId) {
      return {};
    }

    return manifest?.screens?.[screenId]?.state ?? {};
  }, []);
}
