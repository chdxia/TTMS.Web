import { http } from "@/utils/http";
import { baseUrlApi, Result, ListResult, PageListResult } from "./utils";

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

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("User/Login"), { data });
};

// 根据id获取用户信息
export const getUserById = (userId: number) => {
  return http.request<Result>("get", baseUrlApi(`User/${userId}`));
};

// 获取用户列表
export const getUserList = (data?: object) => {
  return http.request<ListResult>("post", baseUrlApi("User/GetList"), {
    data
  });
};

// 分页获取用户列表
export const getUserPageList = (data?: object) => {
  return http.request<PageListResult>("post", baseUrlApi("User/GetPageList"), {
    data
  });
};

// 新增用户
export const createUser = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("User/CreateUser"), {
    data
  });
};

// 编辑用户
export const updateUser = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("User/UpdateUser"), {
    data
  });
};

// 批量删除用户
export const deleteUser = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi("User/DeleteUser"), {
    data
  });
};
