import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#8ce629',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed',
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default AuthButton;