# @zeesuu/searchlist

页面级别的列表组件,包含基本的数据渲染,事件响应等.

## 安装:

```
$ npm i  @zeesuu/searchlist@latest -S
```

## 使用:

### 全局使用

在 _main.js_ 中

```javascript
import ZeesuuSearchList from ' @zeesuu/searchlist';

Vue.use(ZeesuuSearchList);
```

页面中

```javascript
<template>
  <div class="dashboard-container">
    <search-list
      <!-- 列表请求地址(必选) -->
      :api-url="API.SUB_PLATFORM.LIST"
      <!-- 是否展示清空按钮(可选), 如果为true,当option长度为0时也不会展示 -->
      :show-reset-btn="true"
      <!-- 是否在reset后立马重新搜索(可选) -->
      :fetch-after-reset="false"
      <!-- 按钮文本(可选) -->
      :reset-btn-text="清空"
      :query-btn-text="清空"
      <!-- 搜索框配置(可选) -->
      :option="searchOpt"
      <!-- 搜索框每行控件数目(可选) -->
      :item-per-row="8"
      <!-- 设置table的rowkey(可选) -->
      :row-key="id"
      <!-- 设置table的页面偏移(可选),默认:0,用于起始页是0或者其他的情况 -->
      :page-offset="0"
      <!-- 设置table的数据字段名称(可选),默认: rows -->
      list-name="list"
      <!-- 设置默认翻页参数(可选) -->
      :pagination="pagination"
      <!-- 请求成功后回调(可选), 参数为返回的列表数据 -->
      :query-success="querySuccess"
      <!-- 请求之前处理函数(可选), 参数为 { searchInfo: {}}, 可以设置默认搜索参数 -->
      :before-query="beforeQuery"
      <!-- 多选数据响应(可选) -->
      @selection-change="selectionChange"
      <!-- 双击一行数据响应(可选) -->
      @table-row-dbclick="dbClicked"
      <!-- 是否立即请求数据(可选) -->
      :fetch-now="false"
    >
      <!-- 如果要多选,可以第一个列表现增加单选框(可选) -->
      <el-table-column type="selection"></el-table-column>

      <!-- 列表项 -->
      <el-table-column prop="title" width="400" label="公司名称"></el-table-column>
      <el-table-column prop="status" label="公司名称"></el-table-column>
      <el-table-column prop="author" label="作者名称"></el-table-column>
      <el-table-column prop="display_time" label="作者名称"></el-table-column>
      <el-table-column prop="pageviews" label="作者名称"></el-table-column>
      <el-table-column label="操作">
        <!-- 获取每行数据 -->
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{ scope.row.id }}</el-button>
        </template>
      </el-table-column>

      <!-- 查询按钮前的位置插槽 -->
      <div slot="btn-before" class="btn-before">
        <el-button type="success" size="mini">before</el-button>
      </div>

      <!-- 重置按钮后的位置插槽 -->
      <div slot="btn-after" class="btn-after">
        <el-button type="info" size="mini">after</el-button>
      </div>

      <!-- 按钮和表格之间的位置插槽 -->
      <div slot="tab-before" class="tab-before">
        说明文字说明文字说明文字说明文字说明文字
      </div>
    </search-list>
  </div>
</template>

<script>
  import { API } from '@/config';

  export default {
    name: 'SubManage',
    data() {
      return {
        searchOpt: [
          {
            // 控件类型字符串, 控件需要被注册
            type: this.SEARCH_COMP_ENUM.SEARCH_INPUT,
            // 搜索表单字段名
            name: 'id',
            // placeholder
            label: '平台ID',
          },
          {
            type: this.SEARCH_COMP_ENUM.SEARCH_DATEPICKER,
            name: 'time',
            label: '平台ID',
            conf: {
              type: 'daterange',
            },
          },
        ],
        pagination: {
          // 当前页面
          page: 1,
          // 每页数量
          size: 10,
          // 总页数
          total: 0,
          // 请求标志位
          loading: false,
        },
        API,
      };
    },
    methods: {
      querySuccess(list) {
        return list;
      },
      beforeQuery(val) {
        const { searchInfo } = val;
        searchInfo.id = '123';
      },
      selectionChange(selectedList) {
        console.log(selectedList);
      },
      dbClicked(dbRow) {
        console.log(dbRow);
      },
    },
  };
</script>
```

## Dependencies

1. this.\$http

此组件依赖调用环境的 **this.\$http** 是用于发起请求的对象实例,比如 axios.

没有的话,则无法完成远程调用.

2. Element-ui

此组件依赖调用环境需要安装 **Element-ui**
