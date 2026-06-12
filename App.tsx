import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useShareIntent } from 'expo-share-intent';
import HomeScreen from './src/screens/HomeScreen';
import PlayerScreen from './src/screens/PlayerScreen';

type Screen = 'home' | 'player';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [videoUrl, setVideoUrl] = useState('');

  const { shareIntent, resetShareIntent } = useShareIntent();

  useEffect(() => {
    if (shareIntent?.webUrl) {
      setVideoUrl(shareIntent.webUrl);
      setScreen('player');
      resetShareIntent();
    }
  }, [shareIntent, resetShareIntent]);

  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <StatusBar style="light" />
      {screen === 'player' ? (
        <PlayerScreen
          videoUrl={videoUrl}
          onBack={() => setScreen('home')}
        />
      ) : (
        <HomeScreen
          onPlay={(url) => {
            setVideoUrl(url);
            setScreen('player');
          }}
        />
      )}
    </View>
  );
}
