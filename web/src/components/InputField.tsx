import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

function validateName(value) {
    console.log(value);
    let error;
    if (!value) {
        error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
        error = "Jeez! You're not a fan 😱"
    }
    return error;
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    placeholder?: string;
    name: string;
    type?: string;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, meta, helper] = useField(props);
    return (
        <FormControl validate={validateName}>
            {console.log(field, meta, helper)}
            <FormLabel htmlFor={field.name}>아이디</FormLabel>
            <Input 
                {...field}
                id={field.name}
                type={props.type}
                label={props.label}
                placeholder={props.placeholder} />
            { meta.touched && meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null }
        </FormControl>
    );
}

