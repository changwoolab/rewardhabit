# rewardhabit
보상습관 WEB

## Notion Link

프로젝트 진행/업데이트 현황 확인은 [Notion](https://simple-almanac-6f1.notion.site/4f7d9d22627e4a06a8736c2d2d77af02?v=31fa3b18fc6a48769e8b10c3ec9e8422)에서 가능합니다

## How to start

1. redis를 실행시킵니다

>

    $ redis-server
    
2. /server/src/secret_modules/constants.ts 파일을 추가하고 다음과 같은 정보들을 추가해줍니다.

>

    
    // DB
    export const DB_NAME = ;
    export const DB_USERNAME = ;
    export const DB_PASSWORD = ;
    export const DB_HOST = ;
    export const DB_PORT = ;


    // 암호화
    export const ENCRYPT_ALGORITHM = "aes-256-cbc";
    export const ENCRYPT_KEY = Buffer.from(""); // 32byte 크기로 설정해주세요


    // COOKIE
    export const COOKIE_NAME = ;

    // EMAIL
    export const EMAIL_ID = 
    export const EMAIL_PW = 

    // FORGOT_PASSWORD
    export const FORGOT_PASSWORD_PREFIX = 

    // OPEN_AI API KEY
    export const OPENAI_API_KEY = 


3. server를 실행시킵니다.

>

    $ cd server
    $ yarn watch
    $ cd server
    $ yarn dev

4. web을 실행시킵니다.

>

    $ cd web
    $ yarn dev

 
그렇다면 web 및 서버는 다음과 같은 주소에 형성됩니다.
>

    web: localhost:3000
    server: localhost:4000/graphql
    

## Used Technology

다음과 같은 기술들을 사용하여 웹을 제작했습니다.

- React
- TypeScript
- GraphQL
- URQL/Apollo
- Node.js
- MariaDB
- TypeORM
- Redis
- Next.js
- TypeGraphQL
- Chakra-ui
- yup
