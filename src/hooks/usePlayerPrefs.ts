import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@choreo_player_prefs';

export interface PlayerPrefs {
  playbackRate: number;
  mirrored: boolean;
}

const DEFAULTS: PlayerPrefs = { playbackRate: 1, mirrored: false };

/**
 * Loads and persists playback rate + mirror preference.
 * `loaded` is false until AsyncStorage has resolved — callers should
 * defer rendering the player until true so the initial embed HTML
 * is built with the correct rate.
 */
export function usePlayerPrefs() {
  const [prefs, setPrefs] = useState<PlayerPrefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setPrefs({ ...DEFAULTS, ...saved });
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const updatePrefs = useCallback((patch: Partial<PlayerPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { prefs, loaded, updatePrefs };
}
