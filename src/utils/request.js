import axios from "axios";
import Vue from "vue";

let BASE_API = "";
if (process.env.NODE_ENV == "development") {
  BASE_API = process.env.VUE_APP_BASE_API;
} else {
  BASE_API =
    "http://" +
    document.getElementsByTagName("env")[0].getAttribute("sc-host") +
    ":4399";
}

// create an axios instance
const service = axios.create({
  // baseURL: BASE_API, // url = base url + request url
  baseURL: BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        // default:
        // error.message = `连接错误${error.response.status}`;
      }
    } else {
      error.message = "连接到服务器失败";
    }
    if (!error.response) Vue.$toast.error(error.message);
    Vue.$toast.error(error.response.data.message);
    return Promise.reject(error);
  }
);

export default service;
