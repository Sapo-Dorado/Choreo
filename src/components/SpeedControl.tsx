import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface SpeedControlProps {
  currentRate: number;
  onRateChange: (rate: number) => void;
  compact?: boolean; // hides label, smaller buttons — for fullscreen overlay
}

const SPEEDS = [0.5, 0.65, 0.75, 0.9, 1];

export default function SpeedControl({ currentRate, onRateChange, compact }: SpeedControlProps) {
  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
      {!compact && <Text style={styles.label}>Speed</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {SPEEDS.map((rate) => {
          const isActive = currentRate === rate;
          return (
            <Pressable
              key={rate}
              onPress={() => onRateChange(rate)}
              style={({ pressed }) => [
                styles.button,
                isActive && styles.buttonActive,
                pressed && !isActive && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.buttonText, isActive && styles.buttonTextActive]}>
                {Math.round(rate * 100)}%
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  wrapperCompact: {
    justifyContent: 'center',
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#e62117',
    borderColor: '#e62117',
  },
  buttonPressed: {
    backgroundColor: '#2a2a2a',
  },
  buttonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    includeFontPadding: false,
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
