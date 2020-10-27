# @zeesuu/service

将特定格式的 API 配置,转成能够直接使用的 Service.

并挂载在 Vue.prototype.\$service 下

请求对象挂在 Vue.prototype.\$http 下

## Usage

```javascript
// main.js
import ZeesusService from ' @zeesuu/service';

// 配置
Vue.use(ZeesusService, {
  $http: axios, //自己封装好的请求对象

  apis: [
    // 格式为: apiUrl | method | alias
    // apiUrl 为必填, method 不填时默认为get, alias 选填
    '/user/login|post|UserLoginFunction',

    // 默认get 方法
    '/user/info',

    // 这个例子只有apiUrl和alias,method部分默认为get,但是要给到两个竖线作为分隔
    '/user/list||AllUserList',

    // 这个例子适合RESTful的url设计
    '/video/upload/(id)/delete/(pid)|post',

    // 这个例子适合配置其他域名下的请求地址
    'http://www.xyz.com/aaa/bbb',
    'https://www.xyz.com/ccc/ddd',
  ],

  // optional setting, default as '' and the root of request will use $http's setting
  appRoot: 'http://www.xyz.com/',

  // optional setting, default as false, 看看是不是小程序
  isMini: true,

  // 打开调试,可以显示所有已经转换的service
  debug: true,
});
```

```javascript
// other.js or vue file

const options = {};

// 上面的配置会直接生成下列 service
// 无参数
this.$service.UserLoginFunction();
this.$service.UserInfo({}, options);

// 有参数直接传
this.$service.AllUserList({
  page: 0,
  size: 10,
});

// 由RESTful地址转变来的service如果不传参数会报错
this.$service.VideoUploadDelete(
  {
    id: 1,
    pid: 2000,
  },
  options,
);

// 完整的请求地址, 以协议开头,后面接实际路径,实际路径的解析同上
this.$service.HttpAaaBbb();
this.$service.HttpsCccDdd(); // HTTPS请求

// 独立使用请求对象
this.$http.get('url');
```
