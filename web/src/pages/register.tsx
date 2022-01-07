import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import Wrapper from '../components/Wrapper';
import {InputField} from '../components/InputField';


interface registerProps {
    
}

const Register: React.FC<registerProps> = () => {
    return (
        <Wrapper variant='small'>
        <Formik
          initialValues={{ userId: "", password: "" }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
                <InputField name="userId" label="아이디"/>
                <InputField name="password" label="비밀번호" type="password"/>
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