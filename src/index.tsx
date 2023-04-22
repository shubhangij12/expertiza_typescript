import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./custom.scss";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
* my-app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.scss
│   │   │   └── ...
│   │   ├── Layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Header.scss
│   │   │   └── ...
│   │   └── ...
│   ├── hooks/
│   │   ├── useCustomHook1.ts
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx
│   │   │   └── HomePage.scss
│   │   ├── AboutPage/
│   │   │   ├── AboutPage.tsx
│   │   │   └── AboutPage.scss
│   │   └── ...
│   ├── store/
│   │   ├── slices/
│   │   │   ├── feature1Slice.ts
│   │   │   └── ...
│   │   ├── rootReducer.ts
│   │   └── store.ts
│   ├── routes/
│   │   └── index.tsx
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   ├── index.tsx
│   └── index.scss
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
* */
