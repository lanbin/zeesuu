/*
 * @Author: lanbin
 * @Date: 2020-08-25 14:31:34
 * @Last Modified by: lanbin
 * @Last Modified time: 2021-04-26 10:04:25
 *
 *
 * 将特定格式的API配置,转成能够直接使用的Service
 * 并挂载在 Vue.prototype.$service下
 */

const PACKNAME = '[@zeesuu/service]';
/**
 * 首字母大写
 */
function firstLetterUppercase(str) {
  return str.replace(/^\S/, (s) => s.toUpperCase());
}

const DomainReg = /^http(s?):\/\/.*?\//;
const ProtocalReg = /^http(s?)/;
const ParamReg = /\((.+?)\)/g;

export default {
  install(Vue, options) {
    const { $http, apis, appRoot = '', isMini = false } = options;
    const { version } = Vue;

    if (!$http) {
      return console.error(`${PACKNAME} 缺少$http字段配置, 请指定负责请求发送的对象, 如: axios.`);
    }

    const $service = {};
    const $url = {};

    if (version.match(/^3(.*)/)) {
      Vue.config.globalProperties.$http = Vue.config.globalProperties.$http || $http;
    } else {
      Vue.prototype.$http = Vue.prototype.$http || $http;
    }

    // 转成service
    if (apis) {
      apis.forEach((api) => {
        // split to method/url
        let [url, method = 'get', alias = ''] = api.split('|');

        // 判断url中 是否有参数
        const hasUrlParams = url.match(ParamReg);

        // 组成名字, 过滤掉参数
        let name = url
          .replace(DomainReg, '')
          .replace(ParamReg, '')
          .split('/')
          .reduce((prev, current) => {
            if (current.indexOf('-') > -1) {
              prev.concat(current.split('-').map((item) => firstLetterUppercase(item)));
            } else {
              prev.push(firstLetterUppercase(current));
            }
            return prev;
          }, [])
          .join('');

        // 如果直接是带域名的 就变成这样的
        if (url.match(ProtocalReg)) {
          name = firstLetterUppercase(url.match(ProtocalReg)[0]) + name;
        }

        // 设置最终的标识名字
        const keyName = alias || name;

        /**
         * 保存URL
         */
        if (!hasUrlParams) {
          $url[keyName] = url;
        }

        // 批量生成Service
        $service[keyName] = (data, option = {}) => {
          // 替换Url的参数
          if (hasUrlParams) {
            // 如果当前url标明了有参数,但是又没传一个,则报错
            if (!data) {
              return console.error(`${PACKNAME} URL: ${url} 需要填入参数`);
            }
            // 替换参数
            hasUrlParams.forEach((key) => {
              const dataKey = key.replace(/^\(|\)$/g, '');
              url = url.replace(key, data[dataKey] || '');
              delete data[dataKey];
            });
          }

          // 设置域名且不是http(s)开头
          if (appRoot && !url.match(DomainReg)) {
            url = `${appRoot}${url}`;
          }

          // 组装参数
          let param = {
            url,
            method,
            ...option,
          };

          let R = null;

          if (Vue.prototype && Vue.prototype.$http) {
            R = Vue.prototype.$http;
          } else {
            R = Vue.config.globalProperties.$http;
          }

          if (isMini) {
            return R({ data, ...param });
          } else {
            return R(method === 'get' ? { params: data, ...param } : { data, ...param });
          }
        };
      });
    }

    // 便于调试
    if (options.debug) {
      console.log($service);
    }

    if (version.match(/^3(.*)/)) {
      Vue.config.globalProperties.$service = {
        ...(Vue.config.globalProperties.$service || {}),
        ...$service,
      };
      Vue.config.globalProperties.$url = {
        ...(Vue.config.globalProperties.$url || {}),
        ...$url,
      };
    } else {
      Vue.prototype.$service = {
        ...(Vue.prototype.$service || {}),
        ...$service,
      };
      Vue.prototype.$url = {
        ...(Vue.prototype.$url || {}),
        ...$url,
      };
    }
  },
};
