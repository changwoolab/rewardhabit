import session from 'express-session';

// session data : userId 정의
declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}