export const selectOptions = [
  { value: "1", option: "성찰일기" },
  { value: "2", option: "독서록" },
  { value: "3", option: "인공지능에게 질문하기" },
];

/** 패키지 선택 옵션 */
export const packageSelectOptions = ["선택안함", "패키지1", "패키지2", "패키지3"];

/** 본인/자녀 선택 가능하도록 */
export const targetSelectOptions = [{ value: "0", option: "본인" }];

/** 시간 select Options */
export const hourSelectOptions = () => {
  let li = [];
  for (let i = 0; i < 24; i++) {
    let value: string = "";
    if (i < 10) value += "0";
    value += `${i}`;
    li.push({
      value,
      option: value,
    });
  }
  return li;
};

/** 분 select Options */
export const minSelectOptions = [
  { value: "00", option: "00" },
  { value: "30", option: "30" },
];
