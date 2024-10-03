import React, {useEffect, useState} from 'react'
import {AppRegistry, Button, StyleSheet, ToastAndroid, View} from "react-native";
import {ReactNativeModal as Modal} from 'react-native-modal';
import {SignupForm} from "./SignupForm.tsx";
import {LoginForm} from "./LoginForm.tsx";
import RNSecureStorage from "rn-secure-storage";
import unmountApplicationComponentAtRootTag = AppRegistry.unmountApplicationComponentAtRootTag;

const WelcomeScreenModal = ({navigation}) => {
    useEffect(() => {
        isAlreadyLoginned();
    }, []);
    const [loginIsVisible, setLoginIsVisible] = useState(false);
    const [connectIsVisible, setConnectIsVisible] = useState(false);
    const toggleVisibilityLogin = () => {
        setLoginIsVisible(current => !current);
    }
    const toggleVisibilityConnection = () => {
        setConnectIsVisible(current => !current);
    }

    const isAlreadyLoginned = () => {
        RNSecureStorage.exist('token').then((res) => {
            if (res) {
                navigation.navigate('Camera')
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.modalContainer}>
                <Button title={"Cliquez pour vous inscrire"} onPress={toggleVisibilityLogin}/>
                <Modal isVisible={loginIsVisible}>
                    <View style={styles.formContainer}>
                        <SignupForm navigation={navigation}/>
                        <View>
                            <Button color={'black'} title={"Fermer cet écran"} onPress={toggleVisibilityLogin}/>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Button title={"Cliquez ici pour vous connecter"} onPress={toggleVisibilityConnection}/>
                <Modal isVisible={connectIsVisible}>
                    <View style={styles.formContainer}>
                        <LoginForm navigation={navigation}/>
                        <View>
                            <Button color={'black'} title={"Fermer cet écran"} onPress={toggleVisibilityConnection}/>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#E6E6FA',
        width: '80%',
        margin: 'auto',
        marginTop: '80%'
    },
    formContainer: {
        backgroundColor: 'white'
    },
    modalContainer: {
        marginBottom: 15
    }
});

export default WelcomeScreenModal
