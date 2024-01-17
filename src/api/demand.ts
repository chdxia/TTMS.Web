import { http } from "@/utils/http";
import { baseUrlApi, Result, ListResult, PageListResult } from "./utils";

// 根据id获取需求信息
export const getDemandById = (demandId: number) => {
  return http.request<Result>(
    "get",
    baseUrlApi(`Demand/GetPageList/${demandId}`)
  );
};

// 分页获取需求池列表
export const getDemandPageList = (data?: object) => {
  return http.request<PageListResult>(
    "post",
    baseUrlApi("Demand/GetPageList"),
    {
      data
    }
  );
};

// 新增需求
export const createDemand = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Demand/CreateDemand"), {
    data
  });
};

// 编辑需求
export const updateDemand = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("Demand/UpdateDemand"), {
    data
  });
};

// 批量关联版本
export const updateDemandVersionInfo = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi("Demand/UpdateDemandVersionInfo"),
    {
      data
    }
  );
};

// 批量删除需求
export const deleteDemand = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi("Demand/DeleteDemand"), {
    data
  });
};

// 根据需求id获取需求文件列表
export const GetFileList = (demandId: number) => {
  return http.request<ListResult>(
    "get",
    baseUrlApi(`Demand/${demandId}/GetFileList`)
  );
};

// 批量上传需求文件
export const uploadFile = (demandId: number, data: FormData) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`Demand/${demandId}/UploadFile`),
    {
      data
    }
  );
};

// 删除需求文件
export const deleteFile = (fileId: number) => {
  return http.request<Result>(
    "delete",
    baseUrlApi(`Demand/DeleteFile/${fileId}`)
  );
};
