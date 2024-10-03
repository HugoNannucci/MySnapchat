/* eslint-disable */
import React from 'react'
import {View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps as RNTextInputProps} from "react-native";
import {useController, useFormContext, ControllerProps, UseControllerProps} from "react-hook-form";

interface TextInputProps extends RNTextInputProps, UseControllerProps {
    label: string,
    defaultValue?: string
}

export const MyTextInput = (props: TextInputProps) => {

    const {name} = props;
    const formContext = useFormContext();

    if (!formContext || !name) {
        const msg = !formContext ? "TextInput must be wrapped by the FormProvider" : "Name must be defined"
        console.error(msg)
        return null
    }
    return (
        <>
            <ControlledInput {...props}/>
        </>
    )
}

const ControlledInput = (props: TextInputProps) => {
    const formContext = useFormContext();
    const {formState} = formContext;
    const {name,
        label,
        rules,
        defaultValue,
        ...inputProps
    } = props;
    const {field} = useController({name, rules, defaultValue});

    return (
        <>
            <View style={styles.labelContainer}>
                {label && (<Text style={styles.label}>{label}</Text>)}
                <View>
                    <RNTextInput placeholderTextColor={'grey'} {...inputProps} style={styles.input} onChangeText={field.onChange}
                                 onBlur={field.onBlur} value={field.value}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 100,

    },
    label: {
        fontSize: 16,
        marginLeft: 15,
        marginBottom: 5
    },
    labelContainer: {
        margin: 10
    }
})
