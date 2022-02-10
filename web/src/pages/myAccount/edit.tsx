import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Box,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import { ContainerBox } from "../../components/ContainerBox";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { MyAccountLayout } from "../../components/myAccountLayout";
import { SideBar } from "../../components/SideBar";
import { useMyAccountQuery, useUpdateMyAccountMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface editAccountProps {}

interface EditAccountBoxProps {
  borderColor: string;
  editModeHook: [
    "edit" | "readOnly",
    React.Dispatch<React.SetStateAction<"edit" | "readOnly">>
  ];
  boxName: string;
  boxTitle: string;
  boxDesc: string;
}

const EditAccountBox: React.FC<EditAccountBoxProps> = ({
  borderColor,
  editModeHook,
  boxName,
  boxTitle,
  boxDesc,
}) => {
  const [editMode, setEditMode] = editModeHook;
  return (
    <Box mt={2}>
      <ContainerBox borderColor="gray">
        <Text mt={6} w={"144px"} textAlign="center">
          <strong>{boxTitle}</strong>
        </Text>
        <Box mb={7}>
          <Flex justifyContent={"left"}>
            <Box>
              {editMode === "readOnly" ? (
                <InputField readOnly name={boxName} borderColor={borderColor} />
              ) : (
                <InputField name={boxName} />
              )}
            </Box>
            <IconButton
              aria-label={`edit ${boxName}`}
              icon={<EditIcon />}
              ml={4}
              alignSelf={"end"}
              onClick={() => {
                if (editMode == "readOnly") {
                  setEditMode("edit");
                } else {
                  setEditMode("readOnly");
                }
              }}
            />
          </Flex>
          <Text ml={4} mt={1} fontSize={"xs"} color={"gray"}>
            {boxDesc}
          </Text>
        </Box>
      </ContainerBox>
    </Box>
  );
};

const editAccount: React.FC<editAccountProps> = ({}) => {
  const { colorMode } = useColorMode();
  const inputFieldBorderColor = colorMode === "dark" ? "black" : "white";
  const [accountInfo] = useMyAccountQuery();
  const [, updateMyAccount] = useUpdateMyAccountMutation();
  const editHook = {
    userName: useState<"edit" | "readOnly">("readOnly"),
    fullName: useState<"edit" | "readOnly">("readOnly"),
    email: useState<"edit" | "readOnly">("readOnly"),
    bank: useState<"edit" | "readOnly">("readOnly"),
    account: useState<"edit" | "readOnly">("readOnly"),
  };

  if (!accountInfo.data?.myAccount.user) {
    return <Layout variant="large">Loading...</Layout>;
  }
  return (
    <>
      <MyAccountLayout>
        <Formik
          initialValues={accountInfo.data?.myAccount.user}
          onSubmit={async (values, { setErrors }) => {
            const {fullName, email, userName, bank, account} = values;
            const res = await updateMyAccount({
              inputs: {
                fullName,
                email,
                userName,
                bank,
                account,
              },
            });
            if(res && !res.error) {
              alert("수정되었습니다");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Text fontSize={"lg"} mb={4}>
                <strong>사용자 계정</strong>
              </Text>
              <ContainerBox borderColor="gray">
                <Text mt={6} w={"144px"} textAlign="center">
                  <strong>아이디</strong>
                </Text>
                <Box mb={7}>
                  <InputField
                    readOnly
                    name="userId"
                    borderColor={inputFieldBorderColor}
                  />
                  <Text ml={4} mt={1} fontSize={"xs"} color={"gray"}>
                    보상습관 계정의 아이디입니다.
                  </Text>
                </Box>
              </ContainerBox>
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.userName}
                boxName="userName"
                boxTitle="별명"
                boxDesc="보상습관 별명입니다."
              />
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.email}
                boxName="email"
                boxTitle="이메일"
                boxDesc="아이디, 비밀번호 찾기 등 본인확인이 필요한 경우 사용할
                      이메일 주소입니다."
              />

              <Text fontSize={"lg"} mt={4}>
                <strong>환급 계좌 설정</strong>
              </Text>
              <Text fontSize={"xs"} color={"gray"} mb={4}>
                본인의 부주의로 잘못 입력하여 다른 계좌로 송금된 경우 재환급이 불가능하므로, 정확히 입력해주세요
              </Text>

              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.fullName}
                boxName="fullName"
                boxTitle="이름"
                boxDesc="환급시 사용할 계좌명의입니다."
              />
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.bank}
                boxName="bank"
                boxTitle="은행명"
                boxDesc="환급시 사용할 계좌의 은행명입니다. EX)신한"
              />
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.account}
                boxName="account"
                boxTitle="계좌번호"
                boxDesc="환급시 사용할 계좌의 계좌번호입니다."
              />
              <Box textAlign={"center"}>
                <Button
                  m={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  회원정보 수정
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </MyAccountLayout>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(editAccount);
