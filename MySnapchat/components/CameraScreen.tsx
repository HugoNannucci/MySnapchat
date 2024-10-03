import React, {useCallback, useEffect, useRef, useState} from 'react'
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native'
import {Camera, Templates, useCameraDevice, useCameraFormat, useCameraPermission} from "react-native-vision-camera";
import {ErrorCamera} from "./ErrorCamera.tsx";
import {useIsFocused} from "@react-navigation/native";
import {useAppState} from "@react-native-community/hooks";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";
import GestureRecognizer from "react-native-swipe-gestures";
import Permissions, {PERMISSIONS} from "react-native-permissions";
import RNSecureStorage from "rn-secure-storage";
import {launchImageLibrary} from "react-native-image-picker";

export const CameraScreen = ({navigation}) => {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, []);

    const [camera, setCamera] = useState<'front' | 'back'>('back');
    let device = useCameraDevice(camera)
    const isFocused = useIsFocused();
    const appState = useAppState();
    const isActive = isFocused && appState === 'active';
    const {hasPermission, requestPermission} = useCameraPermission()
    const cameraRef = useRef<Camera>(null)
    const format = useCameraFormat(device, Templates.Snapchat)

    if (!hasPermission) requestPermission();

    const askPermission = async () => {
        const permissions = await Permissions.checkMultiple([
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        ]);
        if (permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] !== Permissions.RESULTS.GRANTED
            && permissions[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] !== Permissions.RESULTS.GRANTED
            && permissions[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== Permissions.RESULTS.GRANTED
            && permissions[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== Permissions.RESULTS.GRANTED) {
            const granted = await Permissions.requestMultiple(
                [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                    PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
                    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]
            );
        }
    }

    const capturePhoto = async () => {
        await askPermission();
        const photoTaken = await cameraRef.current.takePhoto()
        const URI = await CameraRoll.saveAsset(`file://${photoTaken.path}`, {
            type: 'photo',
        })
        console.log(photoTaken)
        await RNSecureStorage.setItem('photoURI', `file://${photoTaken.path}`, {}).then((res) => {
            navigation.navigate('SendPhoto')
        }).catch((error) => {
            console.log(error)
        })
    }

    const photoLibrary = async () => {
        await askPermission();
        try {
            const result = await launchImageLibrary({mediaType: 'photo'})
            const uri = result.assets[0].uri
            await RNSecureStorage.setItem('photoURI', `${uri}`, {}).then((res) => {
                navigation.navigate('SendPhoto')
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }

    }

    const switchCamera = useCallback(() => {
        setCamera((value) => (value === 'back' ? 'front' : 'back'))
    }, [])

    if (device === undefined) return <ErrorCamera/>
    if (hasPermission) {
        return (
            <>
                <GestureRecognizer
                    style={{flex: 1}}
                    onSwipeLeft={(state) => navigation.navigate('Profile')}
                    onSwipeRight={(state) => navigation.navigate('Inbox')}
                >
                    <Camera ref={cameraRef}
                            style={styles.camera}
                            device={device}
                            isActive={isActive}
                            androidPreviewViewType="texture-view"
                            photo={true}
                            format={format}
                    />
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={switchCamera} style={styles.switchButton}><Text>Changer de
                            caméra</Text></Pressable>
                        <Pressable style={styles.switchButton} onPress={capturePhoto}><Text>Prendre la
                            photo</Text></Pressable>
                        <Pressable style={styles.switchButton} onPress={photoLibrary}><Text>Choisir la photo dans
                            l'album</Text></Pressable>
                    </View>
                </GestureRecognizer>
            </>
        )
    }
}

const styles = StyleSheet.create({
    camera: {
        flex: 1
    },
    switchButton: {
        width: 100,
        flex: 3,
        height: 50,
        borderRightColor: 'grey',
        borderRightWidth: 1
    },
    buttonContainer: {
        flexDirection: 'row'
    }
})