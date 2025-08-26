import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import AlertBox from "@/components/AlertBox";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('Something went wrong. Please try again.');
  const [hidePassword, setHidePassword] = useState(true)

  const getClerkErrorMessage = (code: string): string => {
    switch (code) {
      case 'form_password_incorrect':
        return 'Incorrect password. Please try again.';
      case 'form_identifier_not_found':
        return 'No account found with this email address.';
      case 'form_param_format_invalid':
        return 'Invalid email or password format.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
      const code = err.errors?.[0]?.code;
      setErrorMessage(getClerkErrorMessage(code));
      setError(true);
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View className='w-full h-full flex-1 justify-center items-center gap-4 px-6'>
        <Text className='text-4xl font-bold mb-10'> Welcome! </Text>

        {error ? (
          <AlertBox
            message={errorMessage}
            type={'error'}
            setter={setError}
          />
        ) : null}

        <TextInput
          className={
            `
            bg-white px-4 py-2 rounded-md w-full border
            ${error && errorMessage.includes("email") ? "border-red-500 text-red-500" : "border-gray-200 text-black"}
            `
          }
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={error && errorMessage.includes("email") ? "red" : "gray"}
          onChangeText={(emailAddress) => {
            setEmailAddress(emailAddress);
            if (error) {
              setError(false);
              setErrorMessage('');
            }
          }}
        />
        <View className='bg-white w-full flex flex-row items-center rounded-md '>
          <TextInput
            className={
              `
                bg-white px-4 py-2 rounded-md w-full border
                  ${error && errorMessage.includes("password") ? "border-red-500 text-red-500" : "border-gray-200 text-black"}
                `
            }
            value={password}
            placeholder="Enter password"
            secureTextEntry={hidePassword}
            placeholderTextColor={error && errorMessage.includes("password") ? "red" : "gray"}
            onChangeText={(password) => {
              setPassword(password);
              if (error) {
                setError(false);
                setErrorMessage('');
              }
            }}
          />
          {!hidePassword ? (
            <Feather name="eye-off" size={18} color={error && errorMessage.includes("password") ? "red" : "gray"} className='absolute z-50 right-2' onPress={() => setHidePassword(prev => !prev)} />
          ) : (
            <Feather name="eye" size={18} color={error && errorMessage.includes("password") ? "red" : "gray"} className='absolute z-50 right-2' onPress={() => setHidePassword(prev => !prev)} />
          )}
        </View>

        <TouchableOpacity
          onPress={onSignInPress}
          className='flex justify-center items-center bg-blue-400 border-blue-400 px-4 py-2 rounded-md w-full'
        >
          <Text className='text-white w-full flex justify-center items-center text-center'> Continue </Text>
        </TouchableOpacity>

        <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Text>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text className='text-blue-500'>Sign up</Text>
          </Link>
        </View>

      </View>
    </KeyboardAwareScrollView>
  )
}