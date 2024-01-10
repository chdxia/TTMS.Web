import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo {
  /** token */
  AccessToken: string;
  // 账户
  Account?: string;
  /** 用户名 */
  UserName?: string;
  /** 当前登陆用户的角色 */
  RoleId?: number;
}

export const userInfo = "user-info";
export const authorizedToken = "authorized-token";

/** 获取`token` */
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(authorizedToken)
    ? JSON.parse(Cookies.get(authorizedToken))
    : storageSession().getItem(userInfo);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo) {
  const { AccessToken } = data;
  const Expires = Date.now() + 6 * 24 * 60 * 60 * 1000; // 过期时间;6天过期
  const cookieString = JSON.stringify({ AccessToken, Expires });

  Cookies.set(authorizedToken, cookieString, { expires: 6 });

  function setSessionKey(Account: string, UserName: string, RoleId: number) {
    useUserStoreHook().SET_ACCOUNT(Account);
    useUserStoreHook().SET_USERNAME(UserName);
    useUserStoreHook().SET_ROLEID(RoleId);
    storageSession().setItem(userInfo, {
      Expires,
      Account,
      UserName,
      RoleId
    });
  }

  if (data.Account && data.RoleId) {
    const { Account, UserName, RoleId } = data;
    setSessionKey(Account, UserName, RoleId);
  } else {
    const Account = storageSession().getItem<DataInfo>(userInfo)?.Account ?? "";
    const UserName =
      storageSession().getItem<DataInfo>(userInfo)?.UserName ?? "";
    const RoleId = storageSession().getItem<DataInfo>(userInfo)?.RoleId ?? null;
    setSessionKey(Account, UserName, RoleId);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(authorizedToken);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
