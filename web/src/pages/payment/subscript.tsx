import { Box, Button, Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import styles from "../../style/hrStyle.module.css";
import { InputField } from "../../components/InputField";
import { Form, Formik } from "formik";
import {
  packageSelectOptions,
  targetSelectOptions,
} from "../../utils/selectOptions";
import { SubscriptBox } from "../../components/SubscriptBox";
import Script from "next/script";
import { tossPayment } from "../../utils/tossPayment";

interface subscriptProps {}

/* 
    1. 구독 패키지 상품 알려주기 (1달 30만원 + 랜덤기프트상자 1개, 2달 60만원 + 랜덤기프트상자 2개, 3달 90만원 + 랜덤기프트상자 3개)
    2. (학부모 계정이라면 추가적으로) 관리할 자녀 선택할 수 있도록, 자녀가 여러명일 수 있으므로
    3. 나머지는 다 똑같음
*/
const subscript: React.FC<subscriptProps> = ({}) => {
  // 다크모드인지 확인 후 색깔 결정
  const { colorMode } = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";
  const hrStyle = colorMode === "dark" ? styles.hr_dark : styles.hr_light;

  // Values
  const [packageValues, setPackageValues] = useState({
    type: 0,
    target: 0,
    reward: 0,
    term: 0,
    payment: 0,
  });

  // 여러번 적기 싫어서 정의
  const packageButton = (
    title: string,
    packageName: string,
    fullPrice: string,
    price: string,
    subscriptTerm: string,
    refund: string,
    extra: string,
    variables: {
      type: number;
      target: number;
      reward: number;
      term: number;
      payment: number;
    }
  ) => {
    return (
      <Button
        h={"100%"}
        w={"100%"}
        flex={1}
        m={"2px"}
        colorScheme={"teal"}
        variant={"outline"}
        onClick={() => {
          setPackageValues(variables);
        }}
      >
        <Box w={"100%"}>
          <Box m={4}>
            <Text color={color} fontSize={"xx-large"}>
              {title}
            </Text>
          </Box>
          <hr className={hrStyle} />
          <Box mt={4}>
            <Text color={color} fontSize={"lg"}>
              {packageName}
            </Text>
          </Box>
          <Box mt={4} mb={4}>
            <Text as="del" color="gray">
              정가: {fullPrice}원
            </Text>
            <strong>
              <Text color={color} fontSize={"xx-large"}>
                {price}원
              </Text>
            </strong>
          </Box>
          <hr className={hrStyle} />
          <Box mt={4}>
            <Text color={color}>구독 기간</Text>
            <strong>
              <Text mt={1} mb={4} color={color} fontSize={"lg"}>
                {subscriptTerm}일
              </Text>
            </strong>
            <Text color={color}>일당 환급 액수</Text>
            <strong>
              <Text mt={1} mb={4} color={color} fontSize={"lg"}>
                {refund}원
              </Text>
            </strong>
            <Text color={color}>추가 특별 보상</Text>
            <strong>
              <Text mt={1} mb={4} color={color} fontSize={"lg"}>
                {extra}회
              </Text>
            </strong>
          </Box>
        </Box>
      </Button>
    );
  };

  return (
    <Layout variant="large">
      <Flex justifyContent={"center"}>
        {packageButton(
          "PACKAGE 1",
          "31일 습관 0원 패키지",
          "310,000",
          "299,000",
          "31",
          "10,000",
          "1",
          {
            type: 1,
            target: 0,
            reward: 10000,
            term: 31,
            payment: 299000,
          }
        )}
        {packageButton(
          "PACKAGE 2",
          "62일 습관 0원 패키지",
          "620,000",
          "599,000",
          "62",
          "10,000",
          "2",
          {
            type: 2,
            target: 0,
            reward: 10000,
            term: 62,
            payment: 599000,
          }
        )}
        {packageButton(
          "PACKAGE 3",
          "93일 습관 0원 패키지",
          "930,000",
          "899,000",
          "93",
          "10,000",
          "3",
          {
            type: 3,
            target: 0,
            reward: 10000,
            term: 93,
            payment: 899000,
          }
        )}
      </Flex>

      <Formik
        initialValues={{ target: 0 }}
        onSubmit={(value) => {
          // target만 따로 받고, 넣어서 보내주면 됨.
          console.log(value);
        }}
      >
        {({ isSubmitting, values }) => {
          return (
            <>
              <Form>
                <Box
                  mt={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  borderColor={color}
                >
                  <Flex m={4} justifyContent={"center"}>
                    <SubscriptBox desc="선택한 패키지">
                      <InputField
                        width={"80%"}
                        name="package"
                        value={packageSelectOptions[packageValues.type]}
                        readOnly
                      />
                    </SubscriptBox>
                    <SubscriptBox desc="대상">
                      <Box w="80%" m="auto">
                        <InputField
                          name="target"
                          placeholder="대상 선택"
                          select
                          selectOptions={targetSelectOptions}
                        />
                      </Box>
                    </SubscriptBox>
                    <SubscriptBox desc="일일반환액">
                      <InputField
                        width={"80%"}
                        name="reward"
                        placeholder="일일반환액 입력"
                        type="number"
                        value={packageValues.reward}
                        readOnly
                      />
                    </SubscriptBox>
                    <SubscriptBox desc="기간(일)">
                      <InputField
                        width={"80%"}
                        name="term"
                        placeholder="기간(일수) 입력"
                        type="number"
                        value={packageValues.term}
                        readOnly
                      />
                    </SubscriptBox>
                    <SubscriptBox desc="결제금액">
                      <InputField
                        width={"80%"}
                        name="payment"
                        value={packageValues.payment}
                        readOnly
                      />
                    </SubscriptBox>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"30%"} colorScheme="teal" onClick={() => {
                      tossPayment()
                    }}>
                      패키지 구매하기
                    </Button>
                  </Box>
                </Box>
              </Form>
            </>
          );
        }}
      </Formik>

      <strong>
        <Text fontSize={"lg"} mt={4}>
          일반 구매
        </Text>
      </strong>
      <Formik
        initialValues={{ target: 0, reward: 0, term: 0, payment: 0 }}
        onSubmit={(value) => {
          console.log(value);
        }}
      >
        {({ isSubmitting, values }) => {
          return (
            <>
              <Form>
                <Box
                  mt={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  borderColor={color}
                >
                  <Flex m={4} justifyContent={"center"}>
                    {/* 대상 -> 본인(0)/자녀(id), 일일반환액, 총 기간, 결제 금액 */}
                    <SubscriptBox desc="대상">
                      <Box w="80%" m="auto">
                        <InputField
                          name="target"
                          placeholder="대상 선택"
                          select
                          selectOptions={targetSelectOptions}
                        />
                      </Box>
                    </SubscriptBox>
                    <SubscriptBox desc="일일반환액">
                      <Box m="auto">
                        <InputField
                          width={"80%"}
                          name="reward"
                          placeholder="일일반환액 입력"
                          type="number"
                        />
                      </Box>
                    </SubscriptBox>
                    <SubscriptBox desc="기간(일)">
                      <InputField
                        width={"80%"}
                        name="term"
                        placeholder="기간(일수) 입력"
                        type="number"
                      />
                    </SubscriptBox>
                    <SubscriptBox desc="결제금액">
                      <InputField
                        width={"80%"}
                        name="payment"
                        value={values.reward * values.term}
                        readOnly
                      />
                    </SubscriptBox>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"30%"} colorScheme="teal" type="submit">
                      구매하기
                    </Button>
                  </Box>
                </Box>
              </Form>
            </>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(subscript);
