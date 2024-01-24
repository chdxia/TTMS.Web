import { http } from "@/utils/http";
import { baseUrlApi, Result, ListResult, PageListResult } from "./utils";

// 获取缺陷列表
export const getDefectList = (data?: object) => {
  return http.request<ListResult>("post", baseUrlApi("Defect/GetList"), {
    data
  });
};

// 分页获取缺陷列表
export const getDefectPageList = (data?: object) => {
  return http.request<PageListResult>(
    "post",
    baseUrlApi("Defect/GetPageList"),
    {
      data
    }
  );
};

// 新增缺陷
export const createDefect = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Defect/CreateDefect"), {
    data
  });
};

// 编辑缺陷
export const updateDefect = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Defect/UpdateDefect"), {
    data
  });
};
