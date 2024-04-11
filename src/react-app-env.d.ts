/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string; // API URL 환경 변수 타입 선언
  }
}
