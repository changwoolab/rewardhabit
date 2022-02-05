import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  textarea?: boolean;
  select?: boolean;
  selectOptions?: {
    value: string;
    option: string;
  }[];
  borderColor?: string;
  mt?: number | string;
};

export const InputField: React.FC<InputFieldProps> = ({
  mt,
  label,
  borderColor,
  size: _,
  textarea,
  select,
  selectOptions,
  ...props
}) => {
  const [field, { touched, error }] = useField(props);
  const { colorMode } = useColorMode();
  if (!borderColor) borderColor = colorMode === "dark" ? "white" : "black";
  if (!props.placeholder) props.placeholder = label;
  if (!mt) mt = 4;
  // input or Textarea or Select를 결정하는 컴포넌트 형성
  let InputOrElse: any = Input;
  let body: any = null;
  if (textarea) {
    InputOrElse = Textarea;
  } else if (select) {
    body = [];
    InputOrElse = Select;
    selectOptions?.map((values) => {
      body.push(
        <option key={values.value} value={values.value}>
          {values.option}
        </option>
      );
    });
  }

  return (
    <Box mt={mt}>
      <FormControl isInvalid={touched && !!error}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        <InputOrElse
          borderColor={borderColor}
          {...field}
          {...props}
          id={field.name}
        >
          {body}
        </InputOrElse>
        {touched && !!error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : null}
      </FormControl>
    </Box>
  );
};
