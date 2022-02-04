import { Box, Button, Flex, Heading, Link, Stack, Text, useColorMode } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { MyAccountLayout } from '../../components/myAccountLayout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"
import { Formik, Form } from 'formik';
import { InputField } from '../../components/InputField';
import { SubscriptBox } from '../../components/SubscriptBox';
import { useCreateHabitMutation, useMyHabitsQuery } from '../../generated/graphql';
import { object, string, ValidationError } from 'yup';
import { useRouter } from 'next/router';
import { EditDeleteButton } from '../../components/CEDButton';

interface habitProps {}

const habit: React.FC<habitProps> = ({}) => {
  const router = useRouter();

  const initialValue = {
    habitDay: "", habitName: "", habitStart: "", habitEnd: ""
  };

  // 다크모드인지 확인 후 색깔 결정
  const {colorMode} = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";

  // MyHabit Hook
  const [{data: myHabits}] = useMyHabitsQuery();

  // createHabit Hook
  const [, createHabit] = useCreateHabitMutation();

  // 요일 선택 기능 State
  let days: boolean[] = [];
  for (let i = 0; i < 7; i++) days.push(false);
  const DayButton = (day: string, idx: number) => {
    const [clicked, setClicked] = useState<boolean>(false);
    const color = clicked ? "teal" : undefined;
    return (
      <Button size={"sm"} colorScheme={color} onClick={() => {
        days[idx] = !days[idx];
        setClicked(!clicked)
      }}>{day}</Button>
    )
  }

  const checker = (value: string | undefined) => {
    if (!value) return false;
    const splitted = value.split(":")
    if (!splitted[0] || !splitted[1]) return false;
    if (splitted[0].length != 2 || splitted[1].length != 2) return false;
    if ((Number(splitted[0]) >= 0 && Number(splitted[0]) <= 23) 
        && Number(splitted[1]) >= 0 && Number(splitted[1]) <= 59) return true;
    return false;
  }
  const habitValidationSchema = object().shape({
    habitStart: string().test("habitStart", "정확히 입력하세요 예)05:20", checker), 
    habitEnd: string().test("habitEnd", "정확히 입력하세요 예)17:20", checker), 
  });

    return (
        <MyAccountLayout>
          <Box>
            <Text>내 습관</Text>
            {!myHabits ? null : <Stack spacing={1}>
                {myHabits?.myHabits.map((p) => !p ? null : (
                  <Box key={p.id} p={2} shadow="md" borderwidth="1px">
                    <Flex>
                      <Box flex={1}>
                        <Heading fontSize="xl">습관명: {p.habitName}</Heading>
                        <Flex>
                        <Text>시작시간: {p.habitStart}</Text>
                        <Text ml={4}>종료시간: {p.habitEnd}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Stack>}
          </Box>
          <Box>
            <Text>내 시간표</Text>
          </Box>
          <Box textAlign={"center"}>
            <Text>습관 추가하기</Text>
            <Text>시작시간/종료시간 중 하나 이상 입력하지 않으면, "종일"로 구분됩니다</Text>
            <Text>종일로 구분되지 않으려면 둘 다 입력해주세요</Text>
            <Formik initialValues={initialValue} validationSchema={habitValidationSchema}
              onSubmit={async (value, actions) => {
                let temp = "";
                for(let i = 0; i < 7; i++) {
                  if (days[i] === true) temp += `${i+1}`;
                }
                value.habitDay = temp;
                const res = await createHabit({habitInput: value});
                if (res) {
                  alert("습관이 추가되었습니다")
                  actions.resetForm({values: initialValue});
                }
            }}
          >
          {({ isSubmitting }) => {
          return(
          <>
            <Form>
                <Box mt={4} borderWidth='1px' borderRadius='lg' overflow='hidden' borderColor={color}>
                  <Flex m={4} justifyContent={"center"}>
                    <SubscriptBox desc="요일선택">
                      <Flex mt={1} justifyContent={"center"}>
                        {DayButton("월", 0)}
                        {DayButton("화", 1)}
                        {DayButton("수", 2)}
                        {DayButton("목", 3)}
                      </Flex>
                      <Flex justifyContent={"center"}>
                        {DayButton("금", 4)}
                        {DayButton("토", 5)}
                        {DayButton("일", 6)}
                      </Flex>
                      <InputField mt={1} width={"100%"} name="habitDay" type={"hidden"} readOnly/>
                    </SubscriptBox>
                    <SubscriptBox desc="습관명">
                      <Box w="80%" m="auto">
                      <InputField name="habitName" placeholder="EX) 운동하기"/>
                      </Box>
                    </SubscriptBox>
                    <SubscriptBox desc="습관시작시각">
                      <InputField width={"80%"} name="habitStart" placeholder="예시) 05:20" />
                    </SubscriptBox>
                    <SubscriptBox desc="습관종료시각">
                      <InputField width={"80%"} name="habitEnd" placeholder="예시) 17:30" />
                    </SubscriptBox>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"20%"} colorScheme='teal' isLoading={isSubmitting} type='submit'>습관추가</Button>
                  </Box>
                </Box>
              </Form>
              </>
            )}}
          </Formik>
          </Box>
        </MyAccountLayout>
    );
}

export default withUrqlClient(createUrqlClient)(habit);