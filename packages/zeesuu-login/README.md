# @zeesuu/login

## 安装:

```
$ npm i @zeesuu/login -S
```

## 使用:

### 全局使用

在 _main.js_ 中

```javascript
import ZeesuuLogin from '@zeesuu/login';
import store from './store';

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

```vue
<template>
  <div>
    <!-- 加入LoginMixins后, 会在 data 中增加 LoginForm 对象 -->
    <el-form :model="loginForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="loginSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { LoginMixins } from '@zeesuu/login';

  export default {
    mixins: [LoginMixins],
    mounted() {
      // 登录页面地址可以增加 redirect 参数
      // http://www.abc.com/login?redirect=http://www.abc.com
      // 使用 **this.redirect** 在此时可以获得到参数
      console.log(this.redirect);
    },
    methods: {
      // 覆写当前方法
      loginSubmit() {},
    },
  };
</script>
```
