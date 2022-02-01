import { Box, Button, Flex, Image, Text, useColorMode } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import styles from "../../style/hrStyle.module.css"
import { InputField } from '../../components/InputField';
import { Form, Formik } from 'formik';
import { packageSelectOptions } from '../../utils/selectOptions';

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
    const [values, setValues] = useState({
        package: 0, target: 0, dailyRefund: 0, term: 0, payment: 0
    });

    return (
        <Layout variant="large">
          <Flex justifyContent={"center"}>
            <Button h={"100%"} w={"100%"} flex={1} m={"2px"} colorScheme={"teal"} variant={"outline"} onClick={() => {
                setValues({
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
                setValues({
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
                setValues({
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
          <Formik initialValues={values} onSubmit={(value) => {
            console.log(values);
          }}>
          {({ isSubmitting }) => (
          <>
            <Form>
                <Box mt={4} borderWidth='1px' borderRadius='lg' overflow='hidden' borderColor={color}>
                  <Flex m={4} justifyContent={"center"}>
                    {/* 패키지, 대상 -> 본인(0)/자녀(id), 일일반환액, 총 기간, 결제 금액 */}
                    <Box flex={1} textAlign={"center"}>
                      <Text>패키지</Text>
                      <InputField width={"80%"} name="package" placeholder="패키지 선택" 
                          select selectOptions={packageSelectOptions} />
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text>대상</Text>
                      <InputField width={"80%"} name="target" placeholder="대상 선택" 
                          select selectOptions={packageSelectOptions} />
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text>일일반환액</Text>
                      <InputField width={"80%"} name="dailyRefund" placeholder="일일반환액 입력" type="number" />
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text>기간(일)</Text>
                      <InputField width={"80%"} name="term" placeholder="기간(일수) 입력" type="number" />
                    </Box>
                    <Box flex={1} textAlign={"center"}>
                      <Text>결제 금액</Text>
                      <InputField width={"80%"} name="payment" readOnly />
                    </Box>
                  </Flex>
                  <Box textAlign={"center"}>
                    <Button mb={4} w={"30%"} colorScheme='teal' type='submit'>구매하기</Button>
                  </Box>
                </Box>
              </Form>
              </>
            )}
          </Formik>
        </Layout>
        
    );
}

export default withUrqlClient(createUrqlClient)(subscript);