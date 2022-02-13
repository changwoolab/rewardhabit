import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import http from "https"

interface successProps {}

const success: React.FC<successProps> = ({}) => {
    const router = useRouter();
    const {type, target, reward, term, paymentKey, orderId, amount} = router.query;
    console.log(type, target, reward, term); console.log("paymentKey", paymentKey); console.log("orderId", orderId); console.log("amount", amount);
    if (paymentKey && orderId && amount) {
        const options = {
            "method": "POST",
            "hostname": "api.tosspayments.com",
            "port": null,
            "path": `/v1/payments/${paymentKey}`,
            "headers": {
            "Authorization": "Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==",
            "Content-Type": "application/json"
            }
        };
        
        const req = http.request(options, function (res) {
            const chunks: any = [];
            
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            
            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        
        req.write(JSON.stringify({amount, orderId}));
        req.end();
    }
    return (
        <Layout variant="regular">

        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(success);