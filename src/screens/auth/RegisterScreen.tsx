import React from 'react';
import { View, Text, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import AppLogo from '../../components/AppLogo';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { createUser } from '../../database/db';

interface RegisterFormState{
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = ({ navigation }: any) => {
  const [formState, setFormState] = useState<RegisterFormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: keyof RegisterFormState, value: string) => {
    setFormState((prev) => ({...prev, [field]: value}));
  };

  const handleRegister = async() => {
    const {username, email, password, confirmPassword} = formState;


    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('ERROR', 'Fill in all required fields to sign up.');
      return;
    }


    if (password !== confirmPassword) {
      Alert.alert('ERROR', 'Password does not match. Please try again.');
      return;
    }

    try{
      const newUserId = await createUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log('Account create successfully on device hardware! ID:',  newUserId)
      Alert.alert('Success', 'Signed up successfully! Please log in.', [
        {
          text: 'OK',
          onPress: () => {
            //clear text box and push user back to the login screen 
            setFormState({ username: '', email: '', password: '', confirmPassword: '' });
            navigation.navigate('Login');
          }
        }
      ]);        
    } catch (error: any) {
      //catches custom error messagefrom db 
      Alert.alert('Sign Up Failed', error.message || 'An unexpected error occurred.');
    }
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

        {/* dynamic form card layoout*/}
        <View style={styles.formCard}>
          <AuthInput
            label="Username"
            placeholder="Choose a username"
            value={formState.username}
            onChangeText={(val: string) => handleInputChange('username', val)}
          />

          <AuthInput
            label="Email Address"
            placeholder="Enter your email address"
            value={formState.email}
            onChangeText={(val: string) => handleInputChange('email', val)}
            keyboardType="email-address"
          />

          <AuthInput
            label="Password"
            placeholder="Create a strong password"
            value={formState.password}
            onChangeText={(val: string) => handleInputChange('password', val)}
            isPassword
          />

          <AuthInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formState.confirmPassword}
            onChangeText={(val: string) => handleInputChange('confirmPassword', val)}
            isPassword
          />

          <AuthButton label="Sign Up" onPress={handleRegister} />
        </View>

        {/* back to login page */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    color: '#555555',
    fontSize: 14,
  },
  loginLink: {
    color: '#8ce629', 
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;