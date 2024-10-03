/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import WelcomeScreenModal from "./components/WelcomeScreenModal.tsx";
import {CameraScreen} from "./components/CameraScreen.tsx";
import {SignupForm} from "./components/SignupForm.tsx";
import RNSecureStorage from 'rn-secure-storage';
import {Profile} from "./components/Profile.tsx";
import {Inbox} from "./components/Inbox.tsx";
import {SendPhoto} from "./components/SendPhoto.tsx";
import {SeeSnap} from "./components/SeeSnap.tsx";

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function App() {
    /*const [tokenIsSet, setTokenIsSet] = useState(false);
    useEffect(() => {
        isTokenSet();
    }, [tokenIsSet])*/
    const isDarkMode = useColorScheme() === 'dark';

    /*const isTokenSet = async () => {
        await RNSecureStorage.exist('token').then((res) => {
            console.log(res)
            if (res) {
                setTokenIsSet(true)
            } else {
                setTokenIsSet(false)
            }
        }).catch((error) => {
            console.log(error)
        })
    }*/

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (

        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Home"} screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={WelcomeScreenModal}/>
                <Stack.Screen name="Camera" component={CameraScreen}/>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="Inbox" component={Inbox}/>
                <Stack.Screen name="SendPhoto" component={SendPhoto}/>
                <Stack.Screen name="SeeSnap" component={SeeSnap}/>
            </Stack.Navigator>
        </NavigationContainer>
    );

}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
