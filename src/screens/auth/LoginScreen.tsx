import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import AppLogo from "../../components/AppLogo";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";

interface LoginFormState {
  identifier: string;
  password: string;
}

const LoginScreen = ({ navigation }: any) => {
  const [formState, setFormState] = useState<LoginFormState>({
    identifier: '',
    password: '',
  });

  const handleInputChange = (field: keyof LoginFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    const { identifier, password } = formState;

    if (!identifier.trim()) {
      Alert.alert('ERROR', 'Please enter your email or username.');
      return;
    }
    if (!password) {
      Alert.alert('ERROR', 'Please enter your password.');
      return;
    }

    // TODO: Replace with real SQLite / API auth check
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor="#0d0d0d" barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <AppLogo />

        {/* Form card */}
        <View style={styles.formCard}>
          <AuthInput
            label="Email or Username"
            placeholder="Enter your email or username"
            value={formState.identifier}
            onChangeText={(val: string) => handleInputChange('identifier', val)}
            keyboardType="email-address"
          />
          <AuthInput
            label="Password"
            placeholder="Enter your password"
            value={formState.password}
            onChangeText={(val: string) => handleInputChange('password', val)}
            isPassword
          />
          <AuthButton label="Log In" onPress={handleLogin} />
        </View>

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerPrompt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 24,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerPrompt: {
    color: '#555555',
    fontSize: 14,
  },
  registerLink: {
    color: '#8ce629',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;