import { Box, Button, color, Flex, Heading, Link, Stack, Text, useColorMode } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { MyAccountLayout } from '../../components/myAccountLayout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"
import { Formik, Form } from 'formik';
import { InputField } from '../../components/InputField';
import { SubscriptBox } from '../../components/SubscriptBox';
import { packageSelectOptions, targetSelectOptions } from '../../utils/selectOptions';

interface habitProps {}

const habit: React.FC<habitProps> = ({}) => {
  // 다크모드인지 확인 후 색깔 결정
  const {colorMode} = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";

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

    return (
        <MyAccountLayout>
          <Box>
            <Text>내 습관</Text>
          </Box>
          <Box>
            <Text>내 시간표</Text>
          </Box>
          <Box>
            <Text>습관 추가하기</Text>
            <Text>주의점) 시작시간/종료시간 중 하나라도 입력하지 않으면, "종일"로 구분됩니다.</Text>
            <Formik initialValues={{
              habitDay: "", habitName: "", habitStart: "", habitEnd: ""}} onSubmit={(value) => {
                let temp = "";
                for(let i = 0; i < 7; i++) {
                  if (days[i] === true) temp += `${i+1}`;
                }
                value.habitDay = temp;
                console.log(value);
            }}
          >
          {({ isSubmitting, values }) => {
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
                      <InputField width={"80%"} name="habitStart" placeholder="예시) 05:21" />
                    </SubscriptBox>
                    <SubscriptBox desc="습관종료시각">
                      <InputField width={"80%"} name="habitEnd" placeholder="예시) 17:32" />
                    </SubscriptBox>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"20%"} colorScheme='teal' type='submit'>습관추가</Button>
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