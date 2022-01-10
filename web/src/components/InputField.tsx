import { Box, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

interface MoreInputFieldtProps {
    name: string;
    label: string;
    type?: string
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
}

export const MoreInputField: React.FC<MoreInputFieldtProps> = (props) => {
    return (
        <Field name={props.name}>
            {() => <InputField {...props}/>}
        </Field>
    );
}

export const InputField: React.FC<InputFieldProps> = ({label, size:_, ...props}) => {
    const [field, {touched, error}] = useField(props);
    props.placeholder = label;
    return (
        <Box mt={4}>
        <FormControl isInvalid={touched && !!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} />
            { touched && !!error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
        </FormControl>
        </Box>
    );
}

