import { http } from "@/utils/http";
import { baseUrlApi, Result, PageListResult } from "./utils";

// 分页获取版本列表
export const getVersionInfoPageList = (data?: object) => {
  return http.request<PageListResult>(
    "post",
    baseUrlApi("VersionInfo/GetPageList"),
    {
      data
    }
  );
};

// 新增版本
export const createVersionInfo = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi("VersionInfo/CreateVersionInfo"),
    {
      data
    }
  );
};

// 编辑版本
export const updateVersionInfo = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi("VersionInfo/UpdateVersionInfo"),
    {
      data
    }
  );
};

// 批量删除版本
export const deleteVersionInfo = (data?: object) => {
  return http.request<Result>(
    "delete",
    baseUrlApi("VersionInfo/DeleteVersionInfo"),
    {
      data
    }
  );
};
