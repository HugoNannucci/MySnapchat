import React from 'react'
import {Button, StyleSheet, Text, View, Alert} from "react-native";
import {FieldValues, FormProvider, SubmitErrorHandler, SubmitHandler, useForm} from "react-hook-form";
import {MyTextInput} from "./FormComponents/MyTextInput.tsx";
import RNSecureStorage from 'rn-secure-storage';

export const LoginForm = ({navigation}) => {
    const {...methods} = useForm();

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        try {
            fetch('https://snapchat.epidoc.eu/user', {
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if (typeof response.data === 'object') {
                    console.log(response)
                    const token = response.data.token;
                    const username = response.data.username;
                     RNSecureStorage.multiSet({"token": token, "username": username}, {}).then((res)=>{
                        console.log(res);
                     }).catch((error)=>{
                        console.log(error);
                     })
                    navigation.navigate('Camera')
                } else {
                    Alert.alert('Connexion', 'Les identifiants ne correspondent pas.')
                }
            })
        } catch (error) {
            console.log(error);
        }
    };
    const onError: SubmitErrorHandler<FieldValues> = (errors, e) => {
        return console.log(errors)
    };
    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Formulaire de connexion</Text>
            </View>
            <View>
                <FormProvider {...methods}>
                    <MyTextInput
                        label={"Adresse e-mail"}
                        name={"email"}
                        placeholder={"john.doe@john.com"}
                        rules={{required: "L'adresse e-mail est requise !"}}
                        keyboardType={"email-address"}
                    />
                    <MyTextInput
                        label={"Mot de passe"}
                        name={"password"}
                        placeholder={"******"}
                        rules={{required: "Le mot de passe est requis !"}}
                        keyboardType={"default"}
                        secureTextEntry={true}
                    />
                </FormProvider>
                <View>
                    <Button color={'yellow'} title={"Se connecter"} onPress={methods.handleSubmit(onSubmit, onError)}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: "auto",
        fontSize: 25,
        marginTop: 23,
        marginBottom: 23,
        color: 'white',
        textDecorationLine: "underline"
    },
    titleContainer: {
        backgroundColor: 'black'
    }
})