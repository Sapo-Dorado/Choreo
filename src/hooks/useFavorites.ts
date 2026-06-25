import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@choreo_favorites';

export interface Favorite {
  id: string;
  url: string;
  label: string; // video ID or custom name
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setFavorites(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  const persist = useCallback((list: Favorite[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addFavorite = useCallback((url: string, label: string) => {
    setFavorites((prev) => {
      // Don't add duplicates — just move existing to front
      const filtered = prev.filter((f) => f.url !== url);
      const next: Favorite[] = [
        { id: String(Date.now()), url, label, addedAt: Date.now() },
        ...filtered,
      ];
      persist(next);
      return next;
    });
  }, [persist]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback(
    (url: string) => favorites.some((f) => f.url === url),
    [favorites],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
