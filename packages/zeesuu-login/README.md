# @zeesuu/login

## 安装:

```
$ npm i  @zeesuu/login -S
```

## 使用:

### 全局使用

在 _main.js_ 中

```javascript
import ZeesuuLogin from '@zeesuu/login';
import sotre from './store';

Vue.use(ZeesuuLogin, {
  store,
  // optional
  token: 'customeTokenName',
});
```

在其他页面

```javascript
  <template>
    <div class="container">
      {{ userInfo }}
    </div>
  </template>


  <script>
  export default {
    mounted() {
      // 所有组件都获得了用户信息修改和获取的能力, 注意前置$

      // 设置用户信息
      this.$setUserInfo({
        name: 'manyo'
      })

      // 打印用户信息
      console.log(this.$userInfo)

      // 清除保存的用户信息
      this.$cleanUseInfo()
    }
  }
  </script>
```

### 登录功能

在需要登录的页面,比如 _Login.vue_

```javascript
import { LoginMixins } from '  @zeesuu/login';

export default {
  mixins: [LoginMixins],
};
```
