import { http } from "@/utils/http";
import { baseUrlApi, Result, PageListResult } from "./utils";

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

// 新增版本
export const createDefect = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Defect/CreateDefect"), {
    data
  });
};

// 编辑版本
export const updateDefect = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Defect/UpdateDefect"), {
    data
  });
};

// 批量删除版本
export const deleteDefect = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi("Defect/DeleteDefect"), {
    data
  });
};
