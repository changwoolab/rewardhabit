
// 이메일 보내줄 때 사용하는 형식
export const emailForm = (
  title: string,
  message: string,
  request: string,
  response: string
) => {
  return `
    <div align="center" style="border-style: solid;border-width: thin;border-color:#dadce0;border-radius: 8px;padding: 40px 20px;margin-left: 300px;margin-right: 300px;">
    <table align="center" border="0" cellpadding="0" style="width:100%;max-width:700px;margin:0 auto;padding:0;border: 1px solid #eee;">
      <tbody>
        <tr>
          <td style="width: 600px;max-width:700px;padding:20px 15px;background:#3b4890;text-align:center;font-size:32px;line-height:1.3;color:#fff;letter-spacing:-0.025em;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;font-weight: bold;word-break: keep-all;">
            ${title}
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:700px;margin:0 auto;padding:0;">
              <tbody>
                <tr>
                  <td style="width:100%;max-width:700px;text-align:center;font-size:14px;line-height:1.3;color:#dfe3fe;letter-spacing:-0.025em;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;font-weight: normal; padding-top: 3px;word-break: keep-all">
                  ${message}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table border="0" cellpadding="0" style="width:100%;max-width:700px;">
              <tbody>
                <tr>
                  <td style="width:100%;max-width:740px;padding:0 25px">
                    <table border="0" cellpadding="0" style="width:100%;max-width:740px;">
                      <tbody>
                        <tr>
                          <td style="font-weight:bold;font-size:18px;color:#000;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;letter-spacing:-0.025em;padding-top: 20px">
                            ${request} :
                            <span style="color: #3b4890;">${response}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <tr>
          <td style="padding-top: 20px;">
            <table border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:700px;border-collapse:collapse">
              <tbody>
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:700px;border-collapse:collapse;background-color: #eeeeee;">
                      <tbody>
                        <tr>
                          <td style="font-size:13px;line-height:18px;color:#000;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;letter-spacing:-0.025em;padding:20px 25px 0">
                            - 본 이메일은 발신전용 이메일입니다. 궁금하신 사항은 보상습관 고객센터로 문의하시길 바랍니다.
                          </td>
                        </tr>
                        <tr>
                            <td style="font-size:13px;line-height:18px;color:#000;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;letter-spacing:-0.025em;padding:20px 25px 0">
                              - 타인이 귀하의 이메일을 자신의 정보로 입력했을 때, 이 이메일이 발송될 수 있습니다.
                            </td>
                        </tr>
                        <tr>
                        <td style="font-size:13px;line-height:18px;color:#000;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;letter-spacing:-0.025em;padding:20px 25px 0">
                            - 잘못 수신된 이메일이라면, <a href="">[보상습관 고객센터]</a>를 통해 연락주시기 바랍니다.
                        </td>
                        </tr>
                      </tbody>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:700px;border-collapse:collapse">
                      <tbody>
                        <tr>
                          <td style="font-size:12px;color:#000;font-family:AppleSDGothicNeo-Regular,HelveticaNeue,'맑은고딕',Malgun Gothic,나눔고딕,NanumGothic,'돋움',Dotum,Sans-serif;text-align:center;letter-spacing:-0.025em;padding:15px 0 20px">
                            Copyright ⓒ RewardHabit. All rights reserved.
                          </td>
                        </tr> 
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        </tr>
      </tbody>
    </table>
    </div>
    `;
};