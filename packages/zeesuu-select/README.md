# @zeesuu/select

可以从远程接口直接获取数据的下拉框组件.

在入口文件中配置后, 页面中直接使用即可.

## 安装:

```
$ npm i @zeesuu/select -S
```

## 使用:

### 全局使用

在 _main.js_ 中

```javascript
import ZeesuuSelect from '@zeesuu/select';

Vue.use(ZeesuuSelect, {
  // 传入一组 API 配置
  api: {
    // 此处为配置和组件的名称, 使用camelCase命名, 在组件使用的时候将camelCase换成带dash的小写名称. 例: <role-list>
    roleList: {
      // select 对应的接口
      url: '/v1/sys/role/all_role_list',
      // 对应文字的接口返回数据字段
      label: 'name',
      // 对应值的接口返回数据字段
      value: 'id',
    },
    // 自定义数据集
    custom: {
      // 定义名称
      orderSl: [
        // 定义数据
        {
          label: '第一个',
          value: '0',
        },
        {
          label: '第二个',
          value: '1',
        },
      ],
    },
  },
});
```

页面中

1. 筛选项

```vue
<template>
  <div class="dashboard-container">
    <search-list :option="searchOpt" ...></search-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchOpt: [
          {
            // 此处type只要写上 在main中配置的API的key,即可直接使用select.
            // 组件会完成初始化,获取数据.
            type: 'roleList',
            name: 'role_id',
            label: '角色',
            conf: {
              // 如果当前roleList对应的接口需要传入参数, 请配置 conf.params
              params: {
                type: 1,
              },
            },
          },
          {
            type: 'orderSl',
            name: 'order',
            label: '顺序',
          },
        ],
      };
    },
  };
</script>
```

2. 直接使用

```vue
<template>
  <div>
    <!-- 配置对应的变量, 和参数 -->
    <role-list v-model="role_id" :conf="{ params: { type: 1 } }"></role-list>
    <order-sl v-model="order"></order-sl>
  </div>
</template>
```

## 内置数据

目前内置了 **'yesNo'** 下拉框

```vue
<template>
  <!-- 是:1 否:2 -->
  <yes-no v-model="enable"></yes-no>
</template>
```

## Dependencies

1. this.\$http

此组件依赖调用环境的 **this.\$http** 是用于发起请求的对象实例,比如 axios.

没有的话,则无法完成远程调用.

2. Element-ui

此组件依赖调用环境需要安装 **Element-ui**
