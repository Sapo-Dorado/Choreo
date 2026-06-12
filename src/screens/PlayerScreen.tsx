import React, { useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import WebView from 'react-native-webview';
import MirrorToggle from '../components/MirrorToggle';
import SpeedControl from '../components/SpeedControl';
import { parseYouTubeId } from '../utils/youtube';

interface PlayerScreenProps {
  videoUrl: string;
  onBack: () => void;
}

// Injected once on WebView load.
// Sets up window._choreo with setRate/setMirror helpers that apply directly
// to the HTML5 <video> element — bypassing the YouTube IFrame API entirely.
// A 500ms poll keeps settings applied since YouTube's player can reset them.
const SETUP_SCRIPT = `
(function() {
  var state = { rate: 1, mirror: false };

  function apply() {
    var v = document.querySelector('video');
    if (!v) return;
    if (v.playbackRate !== state.rate) v.playbackRate = state.rate;
    var t = state.mirror ? 'scaleX(-1)' : 'none';
    if (v.style.transform !== t) {
      v.style.transform = t;
      v.style.webkitTransform = t;
    }
  }

  setInterval(apply, 500);

  window._choreo = {
    setRate: function(r) { state.rate = r; apply(); },
    setMirror: function(m) { state.mirror = m; apply(); },
  };
})();
true;
`;

export default function PlayerScreen({ videoUrl, onBack }: PlayerScreenProps) {
  const webViewRef = useRef<WebView | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [mirrored, setMirrored] = useState(false);

  const videoId = parseYouTubeId(videoUrl);
  const { width: playerWidth } = useWindowDimensions();
  const playerHeight = Math.round(playerWidth * (9 / 16));

  function handleRateChange(rate: number) {
    setPlaybackRate(rate);
    webViewRef.current?.injectJavaScript(`window._choreo.setRate(${rate}); true;`);
  }

  function handleMirrorToggle() {
    const newMirrored = !mirrored;
    setMirrored(newMirrored);
    webViewRef.current?.injectJavaScript(`window._choreo.setMirror(${String(newMirrored)}); true;`);
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

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&controls=1&rel=0&playsinline=1&modestbranding=1`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        <WebView
          ref={webViewRef}
          source={{ uri: embedUrl }}
          style={{ width: playerWidth, height: playerHeight }}
          injectedJavaScript={SETUP_SCRIPT}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          allowsFullscreenVideo
        />

        <View style={styles.controls}>
          <SpeedControl
            currentRate={playbackRate}
            onRateChange={handleRateChange}
          />
          <MirrorToggle
            mirrored={mirrored}
            onToggle={handleMirrorToggle}
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
