
const valUserId = async (value: string) => {
    if (!value) return "값을 입력해주세요";
    if (value.length < 3 || value.length > 12) return "아이디는 3글자 ~ 11글자 사이로 만들어주세요"
    if (!/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*$/i.test(value)) return "영문자와 숫자만 조합하여 아이디를 만들어주세요"
}

const valPassword = async (value: string) => {
    if (!value) return "값을 입력해주세요";
    if (value.length < 8 || value.length > 16) return "비밀번호는 8글자 ~ 16글자 사이로 만들어주세요"
    if (!/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/.test(value)) return "특수문자를 포함하여 비밀번호를 만들어주세요"
};

const valName = async (value: string) => {
    if (!value) return "값을 입력해주세요";
};

const valEmail = async (value: string) => {
    if (!value) return "값을 입력해주세요";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return "유효하지 않은 이메일 주소입니다.";
    }
};

const valUserName = async (value: string) => {
    if (!value) return "값을 입력해주세요";
    if (value.length < 2 || value.length > 9) return "별명은 2글자 ~ 8글자 사이로 만들어주세요"
};

const valBank = async (value: string) => {
    if (!value) return "값을 입력해주세요";
};

const valAccount = async (value: string) => {
    if (!value) return "값을 입력해주세요";
};

export const validateRegister = {
    userId: valUserId,
    password: valPassword,
    lastName: valName,
    firstName: valName,
    email: valEmail,
    userName: valUserName,
    bank: valBank,
    account: valAccount
}


