import React, {useState} from 'react'
import {Pressable, StyleSheet, Text} from 'react-native'
import GestureRecognizer from "react-native-swipe-gestures";
import RNSecureStorage from "rn-secure-storage";

export const Profile = ({navigation}) => {
    const [username, setUsername] = useState<string|null>('')
    RNSecureStorage.getItem("username").then((response) => {
        setUsername(response);
    }).catch((error) => {
        console.log(error)
    });
    const Deconnexion = () => {
        RNSecureStorage.clear().then(result => console.log(result))
        navigation.navigate('Home')
    }

    return (
        <>
            <GestureRecognizer
                style={{flex: 1, alignItems: 'center'}}
                onSwipeRight={(state) => navigation.navigate('Camera')}
            >
                <Text style={styles.title}>Bonjour {username}</Text>
                <Pressable onPress={Deconnexion} style={styles.button}><Text>Se déconnecter</Text></Pressable>
            </GestureRecognizer>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'yellow',
        width: 120,
        borderRadius: 50,
        padding: 3,
        marginTop: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 23
    }
})