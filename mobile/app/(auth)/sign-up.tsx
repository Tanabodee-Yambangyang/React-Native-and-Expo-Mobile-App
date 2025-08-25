import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertBox from "@/components/AlertBox";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) { // dev purposes
    return (
      <View className="w-full h-full flex-1 justify-center items-center gap-4 px-6">
        <Text className='text-xl font-bold'>Verify your email</Text>

        {error ? (
          <AlertBox
            message={'Something went wrong, please try again.'}
            type={'error'}
            setter={setError}
          />
        ) : null}

        <TextInput
          className={
            `
            bg-white px-4 py-2 rounded-md w-full border
              ${isFocused || code.length > 0 ? "" : "text-center"} 
              ${error ? "border-red-500" : "border-gray-200"}
            `
          }
          value={code}
          placeholder={isFocused ? "" : "Enter your verification code"}
          placeholderTextColor="gray"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity onPress={onVerifyPress} className='bg-blue-400 border-blue-400 px-4 py-2 rounded-md'>
          <Text className='text-white'>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={ true }
      enableAutomaticScroll={ true }
    >
      <View className='w-full h-full flex-1 justify-center items-center gap-4 px-6'>
        <>
          <Text className='text-4xl font-bold mb-10'>Create Account</Text>

          {error ? (
            <AlertBox
              message={'Something went wrong, please try again.'}
              type={'error'}
              setter={setError}
            />
          ) : null}

          <TextInput
            className={
              `
            bg-white px-4 py-2 rounded-md w-full border
            ${error ? "border-red-500" : "border-gray-200"}
            `
            }
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor="gray"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <View className='bg-white w-full flex flex-row items-center rounded-md '>
            <TextInput
              className={
                `
            bg-white px-4 py-2 rounded-md w-full border
            ${error ? "border-red-500" : "border-gray-200"}
            `
              }
              value={password}
              placeholder="Enter password"
              placeholderTextColor="gray"
              secureTextEntry={hidePassword}
              onChangeText={(password) => setPassword(password)}
            />
            {!hidePassword ? (
              <Feather name="eye-off" size={18} color="gray" className='absolute z-50 right-2' onPress={() => setHidePassword(prev => !prev)} />
            ) : (
              <Feather name="eye" size={18} color="gray" className='absolute z-50 right-2' onPress={() => setHidePassword(prev => !prev)} />
            )}

          </View>

          <TouchableOpacity
            onPress={onSignUpPress}
            className='flex justify-center items-center bg-blue-400 border-blue-400 px-4 py-2 rounded-md w-full'
          >
            <Text className='text-white w-full flex justify-center items-center text-center'>Sign Up</Text>
          </TouchableOpacity>

          <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
            <Text>Already have an account?</Text>
            <Link href="/sign-in">
              <Text className='text-blue-500'>Sign in</Text>
            </Link>
          </View>
        </>
      </View>
    </KeyboardAwareScrollView>
  )
}