import http from "https";

/** Toss Payments로부터 결제승인 */
export const getApproval = (paymentKey: string, amount: string, orderId: string) => {
  let result;
  
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

  const req = http.request(options, (res) => {
    const chunks: any = [];

    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", () => {
        const body = Buffer.concat(chunks);
        result = JSON.parse(body.toString());
        console.log(result);
    });
  });

  req.write(JSON.stringify({ amount, orderId }));
  req.end();

  return result;
};
