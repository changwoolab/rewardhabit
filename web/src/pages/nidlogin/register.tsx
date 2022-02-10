import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../../components/InputField";
import { object, string, ref, ValidationError } from "yup";
import {
  useCheckImmediateDuplicateMutation,
  useRegisterMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../../components/Layout";

interface registerProps {}

// Register validate => WEB LEVEL로 Test + SERVER LEVEL 중복검사!
const Register: React.FC<registerProps> = () => {
  const [, register] = useRegisterMutation();
  const [, checkDup] = useCheckImmediateDuplicateMutation();
  const router = useRouter();

  // 중복을 확인해주는 함수
  const checker = async (mode: string, input: string) => {
    const res = await checkDup({ mode: mode, input: input });
    if (!res.data) return false;
    return res.data.checkImmediateDuplicate;
  };

  // Yup validation Schema
  const RegisterValidation = object().shape({
    userId: string()
      .required("아이디를 입력해주세요")
      .min(3, "아이디는 3글자 ~ 12글자 사이여야 합니다.")
      .max(12, "아이디는 3글자 ~ 12글자 사이여야 합니다.")
      .matches(
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*$/,
        "영문자와 숫자만 조합하여 아이디를 만들어주세요"
      )
      .test(
        "userId",
        "이미 사용중인 아이디입니다.",
        async (value): Promise<boolean | ValidationError> => {
          if (!value) return false;
          return checker("userId", value);
        }
      ),
    password: string()
      .required("비밀번호를 입력해주세요")
      .min(8, "비밀번호는 8글자 ~ 16글자 사이여야 합니다.")
      .max(16, "비밀번호는 8글자 ~ 16글자 사이여야 합니다.")
      .matches(
        /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/,
        "특수문자를 하나 이상 포함하여 비밀번호를 만들어주세요"
      ),
    confirmPassword: string()
      .required("비밀번호확인을 입력해주세요")
      .oneOf([ref("password")], "비밀번호가 일치하지 않습니다"),
    fullName: string().required("이름을 입력해주세요"),
    email: string()
      .required("이메일을 입력해주세요")
      .email("유효하지 않은 이메일 주소입니다")
      .test(
        "email",
        "이미 사용중인 이메일입니다.",
        async (value): Promise<boolean | ValidationError> => {
          if (!value) return false;
          return checker("email", value);
        }
      ),
    userName: string()
      .required("별명을 입력해주세요")
      .min(2, "별명은 2글자 ~ 8글자 사이여야 합니다.")
      .max(8, "별명은 2글자 ~ 8글자 사이여야 합니다.")
      .test(
        "userName",
        "이미 사용중인 별명입니다.",
        async (value): Promise<boolean | ValidationError> => {
          if (!value) return false;
          return checker("userName", value);
        }
      ),
    bank: string().required("은행명을 입력해주세요"),
    account: string()
      .required("계좌를 입력해주세요")
      .test(
        "account",
        "이미 사용중인 계좌입니다.",
        async (value): Promise<boolean | ValidationError> => {
          if (!value) return false;
          return checker("account", value);
        }
      ),
  });

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          userId: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          email: "",
          userName: "",
          bank: "",
          account: "",
        }}
        validationSchema={RegisterValidation}
        onSubmit={async (values, { setErrors }) => {
          let val: {
            userId: string;
            password: string;
            confirmPassword?: string;
            fullName: string;
            email: string;
            userName: string;
            bank: string;
            account: string;
          } = values;
          delete val.confirmPassword;
          const reg = await register({ inputs: val });
          if (reg.error)
            alert("서버 오류가 발생했습니다\n새로고침 후 다시 진행해주세요.");

          // 혹시 모를 Error가 발생했을 경우, Set Error
          if (reg.data?.register.errors) {
            if (reg.data.register.errors[0].field == "notExpected")
              alert("서버 오류가 발생했습니다\n 잠시 후 다시 실행해주세요");
            else setErrors(toErrorMap(reg.data.register.errors));
          }

          // 회원가입 성공시 index page로
          if (reg.data?.register) {
            alert("회원가입되었습니다");
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="userId" label="아이디" />
            <InputField name="userName" label="별명" />
            <InputField name="email" label="이메일 주소" />
            <InputField name="password" label="비밀번호" type="password" />
            <InputField
              name="confirmPassword"
              label="비밀번호확인"
              type="password"
            />
            <InputField name="fullName" label="이름" />
            <InputField name="bank" label="은행명" />
            <InputField name="account" label="계좌번호" />
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              {" "}
              회원가입{" "}
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
