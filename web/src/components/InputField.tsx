import { Box, FormControl, FormLabel, Input, FormErrorMessage, Textarea, Select } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    name: string;
    textarea?: boolean;
    select?: boolean;
    selectOptions?: {
        value: string,
        option: string,
    }[];
}


export const InputField: React.FC<InputFieldProps> = ({label, size:_, textarea, select, selectOptions, ...props}) => {
    const [field, {touched, error}] = useField(props);
    if (!props.placeholder) props.placeholder = label;

    // input or Textarea or Select를 결정하는 컴포넌트 형성
    let InputOrElse: any = Input;
    let body: any = null;
    if (textarea) {
        InputOrElse = Textarea;
    } else if (select) {
        body = [];
        InputOrElse = Select;
        selectOptions?.map(values => {
            body.push(<option key={values.value} value={values.value}>{values.option}</option>)
        })
    }

    return (
        <Box mt={4}>
        <FormControl isInvalid={touched && !!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrElse {...field} {...props} id={field.name} >
                {body}
            </InputOrElse>
            { touched && !!error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
        </FormControl>
        </Box>
    );
}

