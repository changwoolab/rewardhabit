import { habitInputFrontEnd } from "../pages/myAccount/habit";

export const validateHabits = (days: boolean[], value: habitInputFrontEnd) => {
  // 요일 검증
  let habitDay = "";
  for (let i = 0; i < 7; i++) {
    if (days[i] === true) habitDay += "1";
    else habitDay += "0";
  }
  if (habitDay == "0000000") {
    alert("요일을 선택해주세요");
    return null;
  }
  let { bgColor, habitName, startHour, startMin, endHour, endMin } = value;
  // 습관명 검증
  if (!habitName) {
    alert("습관명을 입력해주세요");
    return null;
  }
  // 습관 시간 검증
  let allDay = days[7];
  if (!allDay) {
    if (!startHour || !startMin || !endHour || !endMin) {
      alert("습관 시간을 입력해주세요");
      return null;
      // 시작 시각이 종료 시각보다 큰 경우는 안 됨
    }
    if (Number(startHour + startMin) >= Number(endHour + endMin)) {
      alert("시작시각은 종료시각보다 앞서야 합니다.");
      return null;
    }
  }
  let habitStart = startHour + ":" + startMin;
  let habitEnd = endHour + ":" + endMin;
  return { habitDay, allDay, bgColor, habitName, habitStart, habitEnd };
};
