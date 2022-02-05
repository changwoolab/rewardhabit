import { FieldError } from "../generated/graphql";

// 서버에서 오는 Error 메세지를 Formik에서 처리할 수 있도록 바꿔줌.
export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
