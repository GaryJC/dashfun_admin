import axios from "axios";

const serverUrl = "https://tma-server-test.dashfun.games";

export const getImageUrl = (id, url) =>
  `https://res.dashfun.games/images/${id}/${url}`;

export const requestWithAuthHeader = axios.create();
// requestWithAuthHeader.defaults.headers.common["Authorization"] =
//   DataCenter.authHeaderValue;

const API = {
  userLogin: serverUrl + "/api/v1/admin/login",
  loginCheck: serverUrl + "/api/v1/admin/login_check",
  userCreate: serverUrl + "/api/v1/admin/user/create",

  gameCreate: serverUrl + "/api/v1/admin/game/create",
  gameSearch: serverUrl + "/api/v1/admin/game/search",
  gameUpdate: serverUrl + "/api/v1/admin/game/update",

  getGameInfo: (gameID) => serverUrl + `/api/v1/admin/game/${gameID}`,

  updateImage: serverUrl + "/api/v1/admin/game/upload_image",

  userSearch: serverUrl + "/api/v1/admin/user/search",

  resetPassword: serverUrl + "/api/v1/admin/user/reset_password",
  updateUserInfo: serverUrl + "/api/v1/admin/user/update_base_info",
  updateUserStatus: serverUrl + "/api/v1/admin/user/update_status",

  activateUser: serverUrl + "/api/v1/admin/user/active",

  taskCreate: serverUrl + "/api/v1/admin/task/create",
  taskUpdate: serverUrl + "/api/v1/admin/task/update",
  taskSearch: serverUrl + "/api/v1/admin/task/search",

  getTaskInfo: (gameID) =>
    serverUrl + `/api/v1/admin/task/get_by_game/${gameID}`,
};

export default API;
