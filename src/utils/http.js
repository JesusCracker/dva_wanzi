import axios from 'axios'
import { Toast } from 'antd-mobile';

const showStatus = (status) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 402:
      message = '拒绝访问(402)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}，请检查网络或联系管理员！`
}

const http = axios.create({
  // 联调
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 60 * 60 * 1000,
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    if (config.method.toLowerCase() === "get") {
      config.params.t = +new Date().getTime();
    }
    //统一加header
    config.headers = {
      "Content-Type": "application/json",
    };

    return config
  },
  (err) => {
    err.message = '服务器异常，请联系管理员！'
    // 错误抛到业务代码
    return Promise.reject(err)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    const status = response.status
    let message = ''
    if (status < 200 || status >= 300 && status !== 401 && status !== 500) {
      // 处理http错误，抛到业务代码
      message = showStatus(status)
      Toast.show(message);
      if (typeof response.data === 'string') {
        response.data = { message }
      } else {
        response.data.message = message
      }
      return response
    } else if (status === 200) {
      return response.data
    } else if (status === 500) {
      message = showStatus(status)
      Toast.show(message);
      response.data = { message: message }
      // router.replace({ name: 'exception', query: { type: 500 } })
      return response;
    }

  },
  (err) => {
    err.message = '请求超时或服务器异常，请检查网络或联系管理员！'
    return Promise.reject(err)
  }
)

const proxy = config => {
  return http(config);
};


proxy.get = (path, data = {}, config = {}) => {
  if (!path) {
    console.error("path can not be empty");
    return Promise.reject("path can not be empty");
  }
  return http({
    url: path,
    method: "GET",
    params: data,
    ...config
  });
};

proxy.post = (path, data = {}, config = {}) => {
  if (!path) {
    console.error("path can not be empty");
    return Promise.reject("path can not be empty");
  }
  return http({
    url: path,
    method: "POST",
    data: data,
    ...config
  });
};

export default proxy

