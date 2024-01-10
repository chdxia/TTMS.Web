import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "@/api/user";
import { UserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, userInfo } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 账户
    Account: storageSession().getItem<DataInfo>(userInfo)?.Account ?? "",
    // 用户名
    UserName: storageSession().getItem<DataInfo>(userInfo)?.UserName ?? "",
    // 页面级别权限
    RoleId: storageSession().getItem<DataInfo>(userInfo)?.RoleId ?? null
  }),
  actions: {
    // 存储账户
    SET_ACCOUNT(Account: string) {
      this.Account = Account;
    },
    /** 存储用户名 */
    SET_USERNAME(UserName: string) {
      this.UserName = UserName;
    },
    /** 存储角色 */
    SET_ROLEID(RoleId: number) {
      this.RoleId = RoleId;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data.Body);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.Account = "";
      this.UserName = "";
      this.RoleId = null;
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              // setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
