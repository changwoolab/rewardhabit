import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import http from "https"
import { Button, Center } from '@chakra-ui/react';

interface successProps {}

const success: React.FC<successProps> = ({}) => {
    const router = useRouter();
    const {type, target, reward, term, paymentKey, orderId, amount} = router.query;

    /** 보상습관 서버에 구독 정보 저장 */
    const saveSubscriptToServer = async () => {
        
        return true;
    }

    /** Toss Payments로부터 결제승인 */
    const getApproval = () => {
      let body = "";
      const options = {
        method: "POST",
        hostname: "api.tosspayments.com",
        port: null,
        path: `/v1/payments/${paymentKey}`,
        headers: {
          Authorization:
            "Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==",
          "Content-Type": "application/json",
        },
      };

      const req = http.request(options, async (res) => {
        const chunks: any = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          let tmp = Buffer.concat(chunks);
          body = tmp.toString();
          let j = JSON.parse(body);
          console.log(j.code);
        });
      });

      req.write(JSON.stringify({ amount, orderId }));
      req.end();
      return body;
    };
    return (
      <Layout variant="regular">
        <Center>
          <Button
            colorScheme={"teal"}
            onClick={async () => {
              let ans = getApproval();
              alert("아직 구현되지 않은 기능입니다 ㅜㅜ");
            }}
          >
            결제 완료하기
          </Button>
        </Center>
      </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(success);