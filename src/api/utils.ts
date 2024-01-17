export const baseUrlApi = (url: string) => `api/v1/${url}`;

export type Result = {
  IsSuccess: boolean;
  ErrorCode: number;
  Msg: string;
  Data: object;
};

export type ListResult = {
  IsSuccess: boolean;
  ErrorCode: number;
  Msg: string;
  Data: Array<any>;
};

export type PageListResult = {
  IsSuccess: boolean;
  ErrorCode: number;
  Msg: string;
  Data: {
    Items: Array<any>;
    PageIndex: number;
    PageSize: number;
    TotalPages: number;
    TotalCount: number;
  };
};
