import { object, string } from 'yup';

// Yup validation Schema
export const writePostValidation = object().shape({
  title: string().required("제목을 입력해주세요"),
  // 자유게시판이면 제한X, 독서/일기면 최소 40자 이상
  texts: string().required("내용을 입력해주세요")
    .test("texts", "독서록/일기는 최소 40자 이상 입력해주세요", (value, testContext) => {
      if (!value)
        return false;
      const type = testContext.parent.type;
      if (type != 3) {
        if (value.length < 40) {
          return false;
        }
      }
      return true;
    }),
  type: string().required("종류를 선택해주세요")
  .test("type", "정확한 종류를 선택해주세요", (value) => {
    let realValue = Number(value);
    if (realValue > 0 && realValue <= 3) {
      return true;
    }
    return false;
  })
});
