import { Box, Button, Flex, Image, Text, useColorMode } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import styles from "../../style/hrStyle.module.css"
import { InputField } from '../../components/InputField';
import { Form, Formik } from 'formik';
import { packageSelectOptions, targetSelectOptions } from '../../utils/selectOptions';

interface subscriptProps {}

/* 
    1. 구독 패키지 상품 알려주기 (1달 30만원 + 랜덤기프트상자 1개, 2달 60만원 + 랜덤기프트상자 2개, 3달 90만원 + 랜덤기프트상자 3개)
    2. (학부모 계정이라면 추가적으로) 관리할 자녀 선택할 수 있도록, 자녀가 여러명일 수 있으므로
    3. 나머지는 다 똑같음
*/
const subscript: React.FC<subscriptProps> = ({}) => {



    // 다크모드인지 확인 후 색깔 결정
    const {colorMode} = useColorMode();
    const color = colorMode === "dark" ? "white" : "black";
    const hrStyle = colorMode === "dark" ? styles.hr_dark : styles.hr_light;

    // Values
    const [packageValues, setPackageValues] = useState({
        package: 0, target: 0, dailyRefund: 0, term: 0, payment: 0
    });

    return (
        <Layout variant="large">
          <Flex justifyContent={"center"}>
            <Button h={"100%"} w={"100%"} flex={1} m={"2px"} colorScheme={"teal"} variant={"outline"} onClick={() => {
                setPackageValues({
                    package: 1, target: 0, dailyRefund: 10000, term: 31, payment: 299000
                })
            }}>
                <Box w={"100%"}>
                  <Box m={4}>
                    <Text color={color} fontSize={"xx-large"}>PACKAGE 1</Text>
                  </Box>
                  <hr className={hrStyle}/>
                  <Box mt={4}>
                    <Text color={color} fontSize={"lg"}>31일 습관 0원 패키지</Text>
                  </Box>
                  <Box mt={4} mb={4}>
                    <Text as="del" color="gray">정가: 310,000원</Text>
                    <strong><Text color={color} fontSize={"xx-large"}>299,000원</Text></strong>
                  </Box>
                  <hr className={hrStyle}/>
                  <Box mt={4}>
                    <Text color={color}>구독 기간</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>31일</Text></strong>
                    <Text color={color}>일당 환급 액수</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>10,000원</Text></strong>
                    <Text color={color}>추가 특별 보상</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>1회</Text></strong>
                  </Box>
                </Box>
            </Button>

            <Button h={"100%"} w={"100%"} flex={1} m={"2px"} colorScheme={"teal"} variant={"outline"} onClick={() => {
                setPackageValues({
                    package: 2, target: 0, dailyRefund: 10000, term: 62, payment: 599000
                })
            }}>
                <Box w={"100%"}>
                  <Box m={4}>
                    <Text color={color} fontSize={"xx-large"}>PACKAGE 2</Text>
                  </Box>
                  <hr className={hrStyle}/>
                  <Box mt={4}>
                    <Text color={color} fontSize={"lg"}>62일 습관 0원 패키지</Text>
                  </Box>
                  <Box mt={4} mb={4}>
                    <Text as="del" color="gray">정가: 620,000원</Text>
                    <strong><Text color={color} fontSize={"xx-large"}>599,000원</Text></strong>
                  </Box>
                  <hr className={hrStyle}/>
                  <Box mt={4}>
                    <Text color={color}>구독 기간</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>62일</Text></strong>
                    <Text color={color}>일당 환급 액수</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>10,000원</Text></strong>
                    <Text color={color}>추가 특별 보상</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>2회</Text></strong>
                  </Box>
                </Box>
            </Button>
            
            <Button h={"100%"} w={"100%"} flex={1} m={"2px"} colorScheme={"teal"} variant={"outline"} onClick={() => {
                setPackageValues({
                    package: 3, target: 0, dailyRefund: 10000, term: 93, payment: 899000
                })
            }}>
                <Box w={"100%"}>
                  <Box m={4}>
                    <Text color={color} fontSize={"xx-large"}>PACKAGE 3</Text>
                  </Box>
                  <hr className={hrStyle}/>
                  <Box mt={4}>
                    <Text color={color} fontSize={"lg"}>93일 습관 0원 패키지</Text>
                  </Box>
                  <Box mt={4} mb={4}>
                    <Text as="del" color="gray">정가: 930,000원</Text>
                    <strong><Text color={color} fontSize={"xx-large"}>899,000원</Text></strong>
                  </Box>
                  <hr className={hrStyle}/>
                  <Box mt={4}>
                    <Text color={color}>구독 기간</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>93일</Text></strong>
                    <Text color={color}>일당 환급 액수</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>10,000원</Text></strong>
                    <Text color={color}>추가 특별 보상</Text>
                    <strong><Text mt={1} mb={4} color={color} fontSize={"lg"}>3회</Text></strong>
                  </Box>
                </Box>
            </Button>
          </Flex>

          <Formik initialValues={{target: 0}} onSubmit={(value) => {
            console.log(value)
          }}
          >
          {({ isSubmitting, values }) => {
          return(
          <>
            <Form>
                <Box mt={4} borderWidth='1px' borderRadius='lg' overflow='hidden' borderColor={color}>
                  <Flex m={4} justifyContent={"center"}>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>선택한 패키지</Text>
                      <hr className={hrStyle}/>
                      <Box>
                        <InputField width={"80%"} name="package" value={packageSelectOptions[packageValues.package]} readOnly/>
                      </Box>
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>대상</Text>
                      <hr className={hrStyle}/>
                      <Box w="80%" m="auto">
                      <InputField name="target" placeholder="대상 선택" 
                          select selectOptions={targetSelectOptions} />
                      </Box>
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>일일반환액</Text>
                      <hr className={hrStyle}/>
                      <InputField width={"80%"} name="dailyRefund" placeholder="일일반환액 입력" type="number" 
                       value={packageValues.dailyRefund} readOnly />
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>기간(일)</Text>
                      <hr className={hrStyle}/>
                      <InputField width={"80%"} name="term" placeholder="기간(일수) 입력" type="number" 
                        value={packageValues.term} readOnly/>
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>결제 금액</Text>
                      <hr className={hrStyle}/>
                      <InputField width={"80%"} name="payment" value={packageValues.payment} readOnly />
                    </Box>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"30%"} colorScheme='teal' type='submit'>패키지 구매하기</Button>
                  </Box>
                </Box>
              </Form>
              </>
            )}}
          </Formik>

          <strong><Text fontSize={"lg"} mt={4}>일반 구매</Text></strong>
          <Formik initialValues={
           { target: 0, dailyRefund: 0, term: 0, payment: 0 }
          } onSubmit={(value) => {
            console.log(value);
          }}
          >
          {({ isSubmitting, values }) => {
          return(
          <>
            <Form>
                <Box mt={4} borderWidth='1px' borderRadius='lg' overflow='hidden' borderColor={color}>
                  <Flex m={4} justifyContent={"center"}>
                    {/* 대상 -> 본인(0)/자녀(id), 일일반환액, 총 기간, 결제 금액 */}
                    <Box flex={1} textAlign={"center"} alignContent={"center"}>
                      <Text mb={2}>대상</Text>
                      <hr className={hrStyle}/>
                      <Box w="80%" m="auto">
                      <InputField name="target" placeholder="대상 선택" 
                          select selectOptions={targetSelectOptions} />
                      </Box>
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>일일반환액</Text>
                      <hr className={hrStyle}/>
                      <Box m="auto">
                      <InputField width={"80%"} name="dailyRefund" placeholder="일일반환액 입력" type="number" />
                      </Box>
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>기간(일)</Text>
                      <hr className={hrStyle}/>
                      <InputField width={"80%"} name="term" placeholder="기간(일수) 입력" type="number" />
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text mb={2}>결제 금액</Text>
                      <hr className={hrStyle}/>
                      <InputField width={"80%"} name="payment" value={values.dailyRefund * values.term} readOnly />
                    </Box>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"30%"} colorScheme='teal' type='submit'>구매하기</Button>
                  </Box>
                </Box>
              </Form>
              </>
            )}}
          </Formik>
        </Layout>
        
    );
}

export default withUrqlClient(createUrqlClient)(subscript);