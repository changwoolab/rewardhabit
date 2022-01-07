import { Box, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

function validateName(value) {
    let error;
    if (!value) {
        error = 'Name is required'
    } else if (value.toString().toLowerCase() !== 'naruto') {
        error = "Jeez! You're not a fan 😱"
    }
    return error;
}

interface InputFieldtProps {
    name: string;
    label: string;
    type?: string
}

export const InputField: React.FC<InputFieldtProps> = (props) => {
    return (
        <Field name={props.name} validate={validateName}>
            {() => <SubInputField {...props}/>}
        </Field>
    );
}

type SubInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
}

export const SubInputField: React.FC<SubInputFieldProps> = ({label, size:_, ...props}) => {
    const [field, {touched, error}] = useField(props);
    props.placeholder = label;
    return (
        <Box mt={4}>
        <FormControl isInvalid={touched && !!error}>
            <FormLabel htmlFor={field.name}>아이디</FormLabel>
            <Input {...field} {...props} id={field.name} />
            { touched && !!error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
        </FormControl>
        </Box>
    );
}

