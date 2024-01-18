import { http } from "@/utils/http";
import { baseUrlApi, Result, ListResult, PageListResult } from "./utils";

// 获取分组列表
export const getGroupList = (data?: object) => {
  return http.request<ListResult>("post", baseUrlApi("Group/GetList"), {
    data
  });
};

// 分页获取分组列表
export const getGroupPageList = (data?: object) => {
  return http.request<PageListResult>("post", baseUrlApi("Group/GetPageList"), {
    data
  });
};

// 新增分组
export const createGroup = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Group/CreateGroup"), {
    data
  });
};

// 编辑分组
export const updateGroup = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Group/UpdateGroup"), {
    data
  });
};

// 批量删除分组
export const deleteGroup = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi("Group/DeleteGroup"), {
    data
  });
};
