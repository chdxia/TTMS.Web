import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type UserResult = {
  IsSuccess: boolean;
  ErrorCode: number;
  Msg: string;
  Data: {
    /** 账号 */
    Account: string;
    // 用户名
    UserName: string;
    /** 当前登陆用户的角色 */
    RoleId: number;
    /** `token` */
    AccessToken: string;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("User/Login"), { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};
