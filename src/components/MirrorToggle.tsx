import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface MirrorToggleProps {
  mirrored: boolean;
  onToggle: () => void;
}

export default function MirrorToggle({ mirrored, onToggle }: MirrorToggleProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Mirror</Text>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.button,
          mirrored && styles.buttonActive,
          pressed && !mirrored && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, mirrored && styles.buttonTextActive]}>
          ⇆ Mirror
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#1a2a3a',
    borderColor: '#4a9eff',
  },
  buttonPressed: {
    backgroundColor: '#2a2a2a',
  },
  buttonText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#4a9eff',
    fontWeight: '700',
  },
});
