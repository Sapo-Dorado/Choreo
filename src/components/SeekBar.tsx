import React, { useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';

interface SeekBarProps {
  current: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SeekBar({ current, duration, onSeek }: SeekBarProps) {
  const barWidth = useRef(0);
  // While dragging, show finger position immediately regardless of WebView reports
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const reportedProgress = duration > 0 ? Math.min(current / duration, 1) : 0;
  const progress = dragRatio !== null ? dragRatio : reportedProgress;

  const displayCurrent = dragRatio !== null ? dragRatio * duration : current;

  function ratioFromEvent(e: GestureResponderEvent): number {
    if (barWidth.current <= 0) return 0;
    const x = e.nativeEvent.locationX;
    return Math.max(0, Math.min(x / barWidth.current, 1));
  }

  function handleGrant(e: GestureResponderEvent) {
    const ratio = ratioFromEvent(e);
    setDragRatio(ratio);
    onSeek(ratio * Math.max(duration, 0));
  }

  function handleMove(e: GestureResponderEvent) {
    const ratio = ratioFromEvent(e);
    setDragRatio(ratio);
    onSeek(ratio * Math.max(duration, 0));
  }

  function handleRelease() {
    setDragRatio(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(displayCurrent)}</Text>
      <View
        style={styles.trackWrap}
        onLayout={e => { barWidth.current = e.nativeEvent.layout.width; }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleGrant}
        onResponderMove={handleMove}
        onResponderRelease={handleRelease}
        onResponderTerminate={handleRelease}
      >
        <View style={styles.trackBg} />
        <View style={[styles.trackFill, { width: `${progress * 100}%` as any }]} />
        <View style={[styles.thumb, { left: `${progress * 100}%` as any }]} />
      </View>
      <Text style={styles.time}>{formatTime(duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    color: '#aaa',
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    minWidth: 32,
    textAlign: 'center',
  },
  trackWrap: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
  },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#444',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#e62117',
  },
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: -6,
    top: 8,
  },
});
