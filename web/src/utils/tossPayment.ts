import { loadTossPayments } from '@tosspayments/payment-sdk'

export const tossPayment = () => {
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; // 테스트 키
    loadTossPayments(clientKey).then((tossPayments) => {
        tossPayments.requestPayment("카드", {
            // 결제 수단 파라미터
            // 결제 정보 파라미터
            amount: 15000,
            orderId: "DFH3izf-2GIax8OKHBT75",
            orderName: "토스 티셔츠 외 2건",
            customerName: "박토스",
            successUrl: "http://localhost:3000/payment/success",
            failUrl: "http://localhost:3000/payment/fail",
        });
    });
}