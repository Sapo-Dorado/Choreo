import React, { useRef } from 'react';
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
  const progress = duration > 0 ? Math.min(current / duration, 1) : 0;

  function handleTouch(e: GestureResponderEvent) {
    if (barWidth.current <= 0 || duration <= 0) return;
    const x = e.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(x / barWidth.current, 1));
    onSeek(ratio * duration);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(current)}</Text>
      <View
        style={styles.trackWrap}
        onLayout={e => { barWidth.current = e.nativeEvent.layout.width; }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
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
