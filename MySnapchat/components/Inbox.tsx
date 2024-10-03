import React, {useEffect, useState} from 'react'
import GestureRecognizer from "react-native-swipe-gestures";
import {Alert, Image, Pressable, ScrollView, Text, View} from 'react-native';
import useSWR from "swr";
import RNSecureStorage from "rn-secure-storage";
import uuid from 'react-native-uuid';
import {ReactNativeModal as Modal} from "react-native-modal";

export const Inbox = ({navigation}) => {
    const [snapsArray, setSnapsArray] = useState([]);
    const [usernameArray, setUsernameArray] = useState([]);
    const [token, setToken] = useState('')
    const [userSnap, setUserSnap] = useState([])
    const [snapIsVisible, setSnapIsVisible] = useState(false)
    // const [snapDuration, setSnapDuration] = useState(0)
    const [snapImage, setSnapImage] = useState('')
    let username = '';
    const getSnaps = async (...args) => {
        const resultToken = await RNSecureStorage.getItem('token')
        setToken(resultToken)
        fetch(...args, {
            method: 'GET',
            headers: {Authorization: `Bearer ${resultToken}`},
        }).then(res => res.json()).then(response => {
            setSnapsArray(response.data)
            setLoaded(true)
        })

    }

    const {data, error, isLoading} = useSWR('https://snapchat.epidoc.eu/snap', getSnaps)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if (!loaded) return
        snapsArray.forEach((value, index) => {
            // console.log(value, index)
            fetch(`https://snapchat.epidoc.eu/user/${value.from}`, {
                method: 'GET',
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => res.json()).then(response => {
                // console.log(response)
                const snapID = value._id
                const username = response.data.username;
                // console.log(username)
                setUserSnap(state => [...state, {username: username, snapID: snapID}])
            })
        })
    }, [loaded]);
    if (isLoading) return <Text>Chargement...</Text>
    if (snapsArray.length === 0) {
        return (
            <GestureRecognizer
                style={{flex: 1}}
                onSwipeLeft={(state) => navigation.navigate('Camera')}
            >
                <Text>Vous n'avez pas de snaps ici !</Text>
            </GestureRecognizer>
        )
    }
    if (userSnap.length === 0) return;
    const seeSnap = async (snapID: string) => {
        fetch(`https://snapchat.epidoc.eu/snap/seen/${snapID}`, {
            method: 'PUT',
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => res.json()).then(response => {
            for (let prop in response) {
                if (response[prop] === 'Snap already seen.') {
                    Alert.alert('Snap', 'Snap déjà vu');
                    return
                } else {
                    fetch(`https://snapchat.epidoc.eu/snap/${snapID}`, {
                        method: 'GET',
                        headers: {Authorization: `Bearer ${token}`}
                    }).then(res => res.json()).then(response => {
                        const snapDuration = response.data.duration
                        setSnapImage(response.data.image)
                        setSnapIsVisible(true)
                        setTimeout(() => {
                            setSnapIsVisible(false);
                        }, (snapDuration * 1000))
                    })
                }
            }
        })
    }

    return (
        <>
            <Modal isVisible={snapIsVisible}>
                <View>
                    <Image source={{uri: snapImage}} style={{height: '100%', width: '100%'}}/>
                </View>
            </Modal>
            <GestureRecognizer
                style={{flex: 1}}
                onSwipeLeft={(state) => navigation.navigate('Camera')}
            >
                <ScrollView>
                    <Text style={{fontSize: 23, marginBottom: 10, textDecorationLine: 'underline'}}>Inbox</Text>
                    {userSnap.map((snap, index) => (
                        <View key={uuid.v4()} style={{flexDirection: 'row', marginBottom: 10}}>
                            <Text style={{fontSize: 16, marginRight: 10}}>{snap.username}</Text>
                            <Pressable onPress={() => seeSnap(snap.snapID)} style={{
                                backgroundColor: 'lightgrey',
                                borderRadius: 30,
                                padding: 2
                            }}><Text>Voir le snap</Text></Pressable>
                        </View>
                    ))}
                </ScrollView>
            </GestureRecognizer>
        </>
    )
}
