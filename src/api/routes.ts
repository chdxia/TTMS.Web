import { http } from "@/utils/http";
import { baseUrlApi, Result } from "./utils";

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlApi("/getAsyncRoutes"));
};
