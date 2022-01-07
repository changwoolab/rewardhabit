import { FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant='small'>
        <Formik
          initialValues={{ userId: "", password: "" }}
          onSubmit={(values, actions) => {
            console.log(values);
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Field name='userId'>
                {({ field, form }) => (
                  <FormControl>
                      {console.log(form)}
                    <FormLabel htmlFor='userId'>아이디</FormLabel>
                    <Input 
                        {...field}
                        value = {values.userId}
                        onChange={handleChange}
                        id='userId' 
                        placeholder='아이디'
                    />
                   <FormErrorMessage>{form.errors.userId}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

                <InputField name="password" label="비밀번호"/>


              <Button
                mt={4}
                colorScheme='teal'
                isLoading={isSubmitting}
                type='submit'
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default Register;