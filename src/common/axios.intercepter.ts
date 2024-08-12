import { AxiosInstance } from "axios";
import store from "./store";
import { clearUser } from "../slice/userSlice";
import history from "./History";

export default function axiosInterceptors(axios: AxiosInstance) {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_BASE_URL_PROD || "http://localhost:8000";

  axios.interceptors.request.use((request) => {
    // let token = cookies?.cookies?;
    // request.headers["authorization"] = token ? "Bearer " + token : "";
    request.withCredentials = true; // send token with cookies
    return request;
  });

  axios.interceptors.response.use(
    (response: any) => {
      return response?.data || response;
    },
    async (err) => {
      let errorMsg = err?.response?.data || {};
      if (Array.isArray(errorMsg?.message)) {
        errorMsg.message = errorMsg.message[0];
      }
      if (
        (errorMsg.status === 401 || errorMsg.statusCode === 401) &&
        (errorMsg.error === "Please provide token" ||
          errorMsg.message === "Please provide token")
      ) {
        // toggleLoading.set({ show: false });
        // showToast.set({
        //   isError: true,
        //   message: "Session expired. Please login again.",
        // });
        store.dispatch(clearUser());
        history.push("/login");
      } else if (
        errorMsg.statusCode === 401 &&
        errorMsg.message === "Unknown token"
      ) {
        // toggleLoading.set({ show: false });
        // showToast.set({
        //   isError: true,
        //   message: "Session expired. Please login again.",
        // });
        store.dispatch(clearUser());
        history.push("/login");
      } else if (
        errorMsg.statusCode == 401 ||
        (errorMsg.status == 401 && errorMsg.error === "Unauthorized")
      ) {
        store.dispatch(clearUser());
        history.push("/login");
        // toggleLoading.set({ show: false });
        // showToast.set({
        //   isError: true,
        //   message: errorMsg.message || errorMsg.error || errorMsg,
        // });
      } else {
        // toggleLoading.set({ show: false });
        // showToast.set({
        //   isError: true,
        //   message: errorMsg.message || errorMsg.error || errorMsg,
        // });
      }
      console.log("errorMsg :>> ", err);
      return Promise.reject(errorMsg);
    }
  );
}
