import React, {useState} from 'react'
import {Alert, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import RNSecureStorage from "rn-secure-storage";
import {Picker} from "@react-native-picker/picker";
import {ReactNativeModal as Modal} from "react-native-modal";
import useSWR from "swr";
import base64 from 'react-native-base64';

export const SendPhoto = ({navigation}) => {
    const [photo, setPhoto] = useState<string>('')
    RNSecureStorage.getItem("photoURI").then((response) => {
        if (response !== null) setPhoto(response);
    }).catch((error) => {
        console.log(error);
    });
    const [duration, setDuration] = useState<number>(0);
    const [sendVisible, setSendVisible] = useState(false)
    const [usersArray, setUsersArray] = useState([])

    const getUsers = async (...args) => {
        const token = await RNSecureStorage.getItem('token');
        fetch(...args, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res => res.json()).then(data => {
            setUsersArray(data.data)
        })
    }
    const {data, error, isLoading} = useSWR('https://snapchat.epidoc.eu/user', getUsers)

    if (photo !== '') {
        const onSubmit = async (userID) => {
            try {
                const token = await RNSecureStorage.getItem('token');
                const result = await fetch(photo);
                const data = await result.blob();
                const encodedImage = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(data)
                })
                const body = {
                    to: userID,
                    image: `${encodedImage}`,
                    duration: duration
                }
                fetch('https://snapchat.epidoc.eu/snap', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify(body)
                }).then(res => res.json()).then(response => {
                    for (let prop in response) {
                        if (prop === 'success') {
                            Alert.alert('Envoie', 'Photo envoyée !');
                            setSendVisible(current => !current)
                            navigation.navigate('Camera')
                        } else {
                            if (response[prop] === "A duration as int should be provided.") {
                                Alert.alert('Envoie', 'Veuillez choisir une durée de snap.')
                            } else {
                                Alert.alert('Envoie', "Erreur lors de l'envoie.")
                            }
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        const toggleVisibilitySend = () => {
            setSendVisible(current => !current)
        }
        return (
            <>
                <Modal isVisible={sendVisible} style={styles.modal}>
                    <View style={styles.container}>
                        <ScrollView style={styles.liste}>
                            <Text style={{fontSize: 18}}>Envoyer à : </Text>
                            {usersArray.map((user) => (
                                <View key={user._id} style={styles.user}>
                                    <Text>{user.username}</Text>
                                    <Pressable onPress={() => onSubmit(user._id)} style={styles.sendButton}><Text
                                        style={{color: 'white'}}>Envoyer</Text></Pressable>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.toggleButtonContainer}>
                            <Pressable onPress={toggleVisibilitySend}><Text style={{color: 'white'}}>Fermer cet
                                écran</Text></Pressable>
                        </View>
                    </View>
                </Modal>
                <Image style={{width: '100%', height: '90%'}} source={{uri: photo}}></Image>
                <View style={styles.buttonContainer}>
                    <View style={{flex: 3}}>
                        <Picker selectedValue={duration}
                                onValueChange={(durationValue) =>
                                    setDuration(durationValue)
                                }>
                            <Picker.Item label="Durée" value=""/>
                            <Picker.Item label="1" value={1}/>
                            <Picker.Item label="2" value={2}/>
                            <Picker.Item label="3" value={3}/>
                            <Picker.Item label="4" value={4}/>
                            <Picker.Item label="5" value={5}/>
                        </Picker>
                    </View>
                    <Pressable onPress={() => navigation.navigate('Camera')} style={styles.switchButton}><Text>Reprendre
                        une photo</Text></Pressable>
                    <Pressable onPress={toggleVisibilitySend}
                               style={styles.switchButton}><Text>Choisir le contact</Text></Pressable>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row'
    },
    switchButton: {
        width: 100,
        flex: 3,
        height: 50,
        alignItems: 'center',
        borderLeftColor: 'grey',
        borderLeftWidth: 1
    },
    container: {
        flex: 1,
        height: '100%',
        width: '60%',
        flexDirection: 'column',
        backgroundColor: '#E6E6FA',
    },
    toggleButtonContainer: {
        height: '5%',
        backgroundColor: 'black',
    },
    modal: {
        flex: 1,
        alignItems: 'center'
    },
    liste: {
        height: '95%'
    },
    user: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 5
    },
    sendButton: {
        backgroundColor: 'blue',
        borderRadius: 30,
        marginLeft: 15,
        padding: 2
    }
})
