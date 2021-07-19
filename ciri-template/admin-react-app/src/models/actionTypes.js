/**
 * state action ActionType全大写
 * 命名规则：{entity实体}_{action行为}_{effect作用}
 * entity: 实体，与model对应，反应在redux-store中
 * action: 实体进行的行为，动词副词
 * effect: 作用结果，副词形容词名词 非必填
 */

// 应用app相关action
export const APP_FECTH_PENDING = 'APP_FECTH_PENDING'; // 发起请求
export const APP_FETCH_SUCCESS = 'APP_FETCH_SUCCESS'; // 请求成功
export const APP_FETCH_FAILURE = 'APP_FETCH_FAILURE'; // 请求失败

export const APP_RESET_ERROR = 'APP_RESET_ERROR'; // 重置错误
export const APP_GET_CONFIG = 'APP_GET_CONFIG'; // 获取系统配置

// 使用者signer相关action
export const SIGNER_SIGN_IN = 'SIGNER_SIGN_IN'; // 访客登录
export const SINGER_SIGN_UP = 'SINGER_SIGN_UP'; // 访客注册
export const SIGNER_SIGN_OUT = 'SIGNER_SIGN_OUT'; // 访客登出
export const SIGNER_VERIFY = 'SIGNER_VERIFY'; // 访客验证 远程或本地
export const SIGNER_EDIT_PWD = 'SIGNER_RESET_PWD'; // 访客更改密码
export const SIGNER_GET_CAPTCHA = 'SIGNER_GET_CAPTCHA'; // 访客获取验证码

// 用户user相关action
export const USERS_GET_ALL = 'USERS_GET_ALL';
export const USER_ADD = 'USER_ADD';
export const USER_EDIT = 'USER_EDIT';
export const USER_DISABLE = 'USER_DISABLE';
export const USER_ENABLE = 'USER_ENABLE';