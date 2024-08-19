import axios from "axios";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import axiosInterceptors from "./common/axios.intercepter.ts";
import "./index.css";
import React from "react";
import store, { persistor } from "./common/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ApiLoader from "./components/ApiLoader.tsx";
import "@fortawesome/fontawesome-free/css/all.css";
axiosInterceptors(axios);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApiLoader />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
