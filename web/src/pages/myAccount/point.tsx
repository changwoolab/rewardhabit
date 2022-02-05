import { withUrqlClient } from "next-urql";
import React from "react";
import { MyAccountLayout } from "../../components/myAccountLayout";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface pointProps {}

const point: React.FC<pointProps> = ({}) => {
  return <MyAccountLayout>포인트확인/환급하기</MyAccountLayout>;
};

export default withUrqlClient(createUrqlClient)(point);
