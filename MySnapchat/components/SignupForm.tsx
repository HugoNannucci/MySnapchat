/* eslint-disable */
import React, {useState} from 'react';
import {Button, Text, View, StyleSheet, Alert} from 'react-native';
import {useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldValues} from 'react-hook-form';
import {MyTextInput} from './FormComponents/MyTextInput.tsx';

type FormValues = {
    username: string;
    email: string;
    password: string;
};

export const SignupForm = ({navigation}) => {

    const {...methods} = useForm();

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        try {
            fetch('https://snapchat.epidoc.eu/user', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                for (let prop in response) {
                    if (prop === '_id') {
                        Alert.alert('Inscription', 'Inscription réussie. Veuillez vous connecter.')
                    } else {
                        Alert.alert('Inscription', 'Inscription échouée. Veuillez réessayer.')
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    };
    const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
        return console.log(errors)
    };

    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Formulaire d'inscription</Text>
            </View>
            <View>
                <FormProvider {...methods}>
                    <MyTextInput
                        label={"Nom d'utilisateur"}
                        name={"username"}
                        placeholder={"John"}
                        rules={{required: "Le nom d'utilisateur est requis !"}}
                        keyboardType={"default"}
                    />
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
                    <Button color={'yellow'} title={"S'inscrire"} onPress={methods.handleSubmit(onSubmit, onError)}/>
                </View>
            </View>
        </>
    );
};

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