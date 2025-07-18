import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({ children }: React.PropsWithChildren) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top }}
            className='flex-1 bg-white'
        >
            {children}
        </View>
    )
}

export default SafeScreen