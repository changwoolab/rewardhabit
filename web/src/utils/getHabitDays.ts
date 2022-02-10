
/** 습관 요일 리턴. EX 0110000 -> 화수 */
export function getHabitDays(habitDay: string) {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  let habitDays = [];
  for (let i = 0; i < 7; i++) {
    if (habitDay[i] == "1")
      habitDays.push(days[i]);
  }
  return habitDays;
}
