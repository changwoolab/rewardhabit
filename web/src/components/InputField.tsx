import { Box, FormControl, FormLabel, Input, FormErrorMessage, Textarea, ComponentWithAs, InputProps, TextareaProps } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
}


export const InputField: React.FC<InputFieldProps> = ({label, size:_, textarea, ...props}) => {
    const [field, {touched, error}] = useField(props);
    props.placeholder = label;

    // input or Textarea를 결정하는 컴포넌트 형성
    let InputOrTextarea: any = Input;
    if (textarea) {
        InputOrTextarea = Textarea;
    }

    return (
        <Box mt={4}>
        <FormControl isInvalid={touched && !!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea {...field} {...props} id={field.name} />
            { touched && !!error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
        </FormControl>
        </Box>
    );
}

