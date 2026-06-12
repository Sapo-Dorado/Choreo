import React, { useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import MirrorToggle from '../components/MirrorToggle';
import SpeedControl from '../components/SpeedControl';
import { parseYouTubeId } from '../utils/youtube';

interface PlayerScreenProps {
  videoUrl: string;
  onBack: () => void;
}

export default function PlayerScreen({ videoUrl, onBack }: PlayerScreenProps) {
  const playerRef = useRef<YoutubeIframeRef | null>(null);

  const [playbackRate, setPlaybackRate] = useState(1);
  const [mirrored, setMirrored] = useState(false);
  const [playing, setPlaying] = useState(true);

  const videoId = parseYouTubeId(videoUrl);
  const { width: playerWidth } = useWindowDimensions();
  const playerHeight = Math.round(playerWidth * (9 / 16));

  function handleRateChange(rate: number) {
    setPlaybackRate(rate);
  }

  if (!videoId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Could not load video — invalid YouTube URL or ID.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.playerWrapper,
            { width: playerWidth, height: playerHeight },
            { transform: [{ scaleX: mirrored ? -1 : 1 }] },
          ]}
        >
          <YoutubePlayer
            ref={playerRef}
            height={playerHeight}
            videoId={videoId}
            play={playing}
            playbackRate={playbackRate}
            onChangeState={(state) => {
              if (state === 'paused') setPlaying(false);
              if (state === 'playing') setPlaying(true);
            }}
            initialPlayerParams={{ rel: false, controls: true }}
          />
        </View>

        <View style={styles.controls}>
          <SpeedControl
            currentRate={playbackRate}
            onRateChange={handleRateChange}
          />
          <MirrorToggle
            mirrored={mirrored}
            onToggle={() => setMirrored((m) => !m)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
  },
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 16,
  },
  backText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  playerWrapper: {
    // No overflow: 'hidden' — it clips mirrored content on iOS due to transform interaction
  },
  controls: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#ff5555',
    fontSize: 16,
    textAlign: 'center',
  },
});
