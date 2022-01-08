
// 여기서는 Server와 연결하여 중복검사를 해야함.

const valUserId = async (value: string) => {
    if (!/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*$/i.test(value)) return "영문자와 숫자만 조합하여 아이디를 만들어주세요"
    
}

const valPassword = async (value: string) => {
    if (!/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/.test(value)) return "특수문자를 포함하여 비밀번호를 만들어주세요"
};

const valEmail = async (value: string) => {

};

const valUserName = async (value: string) => {
};


export const validateRegister = {
    userId: valUserId,
    password: valPassword,
    email: valEmail,
    userName: valUserName,
}


