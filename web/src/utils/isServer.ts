
// Undefined면 브라우저가 없다는 뜻 => 서버라는 뜻!
export const isServer = () => typeof window === "undefined";