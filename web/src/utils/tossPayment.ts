import { loadTossPayments } from "@tosspayments/payment-sdk";

/** 토스 페이먼트 SDK, 
 * 토스로 결제 후 success 시 리다이렉트 되는 url에서 보상서버 서버에 쿼리해서 
 * 구독 정보 저장하도록 */
export const tossPayment = (
  amount: number,
  orderId: string,
  orderName: string,
  customerName: string,
  queryParameters: {
    type?: number;
    target: number;
    reward: number;
    term: number;
    payment: number;
}
) => {
  const { type, target, reward, term } = queryParameters;
  const successUrl = `http://localhost:3000/payment/success?type=${type}&target=${target}&reward=${reward}&term=${term}`
  const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; // 테스트 키
  loadTossPayments(clientKey).then((tossPayments) => {
    tossPayments.requestPayment("카드", {
      // 결제 수단 파라미터
      // 결제 정보 파라미터
      amount,
      orderId, //EX) "DFH3izf-2GIax8OKHBT75",
      orderName, // EX) "토스 티셔츠 외 2건",
      customerName, // EX) "박토스",
      successUrl,
      failUrl: "http://localhost:3000/payment/fail",
    });
  });
};
