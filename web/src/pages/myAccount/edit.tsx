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
              alert("?????????????????????");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Text fontSize={"lg"} mb={4}>
                <strong>????????? ??????</strong>
              </Text>
              <ContainerBox borderColor="gray">
                <Text mt={6} w={"144px"} textAlign="center">
                  <strong>?????????</strong>
                </Text>
                <Box mb={7}>
                  <InputField
                    readOnly
                    name="userId"
                    borderColor={inputFieldBorderColor}
                  />
                  <Text ml={4} mt={1} fontSize={"xs"} color={"gray"}>
                    ???????????? ????????? ??????????????????.
                  </Text>
                </Box>
              </ContainerBox>
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.userName}
                boxName="userName"
                boxTitle="??????"
                boxDesc="???????????? ???????????????."
              />
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.email}
                boxName="email"
                boxTitle="?????????"
                boxDesc="?????????, ???????????? ?????? ??? ??????????????? ????????? ?????? ?????????
                      ????????? ???????????????."
              />

              <Text fontSize={"lg"} mt={4}>
                <strong>?????? ?????? ??????</strong>
              </Text>
              <Text fontSize={"xs"} color={"gray"} mb={4}>
                ????????? ???????????? ?????? ???????????? ?????? ????????? ????????? ?????? ???????????? ??????????????????, ????????? ??????????????????
              </Text>

              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.fullName}
                boxName="fullName"
                boxTitle="??????"
                boxDesc="????????? ????????? ?????????????????????."
              />
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.bank}
                boxName="bank"
                boxTitle="?????????"
                boxDesc="????????? ????????? ????????? ??????????????????. EX)??????"
              />
              <EditAccountBox
                borderColor={inputFieldBorderColor}
                editModeHook={editHook.account}
                boxName="account"
                boxTitle="????????????"
                boxDesc="????????? ????????? ????????? ?????????????????????."
              />
              <Box textAlign={"center"}>
                <Button
                  m={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  ???????????? ??????
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
