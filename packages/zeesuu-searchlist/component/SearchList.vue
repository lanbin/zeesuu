<template>
  <div class="search-list">
    <!-- 搜索表单部分 -->
    <div class="search-box">
      <!-- 配置的组件 -->
      <div class="search-input-box">
        <!-- 自动分行 -->
        <el-row :gutter="20">
          <el-col
            v-for="(opt, index) in s_localOption"
            :key="index"
            :span="24 / (opt.col || itemPerRow)"
          >
            <component
              :is="opt.type"
              :label="opt.label"
              :conf="opt.conf"
              @keyup.native.enter="s_fetchData"
              v-bind="opt.$attrs || {}"
              v-model="s_searchInfo[opt.name]"
            ></component>
          </el-col>
        </el-row>
      </div>

      <!-- 按钮布局 -->
      <div class="search-btn-box">
        <slot
          name="btn-before"
          class="btn-before"
          :selectedData="s_selectedData"
          :searchInfo="s_searchInfo"
        ></slot>
        <el-button
          type="primary"
          size="mini"
          @click="s_fetchData"
          v-if="s_localOption.length > 0"
          icon="el-icon-search"
        >
          查询
        </el-button>
        <el-button @click="s_resetSearchInfo" size="mini" v-if="s_localOption.length > 1">
          清空
        </el-button>
        <slot
          name="btn-after"
          class="btn-after"
          :selectedData="s_selectedData"
          :searchInfo="s_searchInfo"
        ></slot>
      </div>
    </div>
    <slot name="tab-before"></slot>

    <!-- 表格 -->
    <el-table
      :data="s_list"
      v-loading="s_pagination.loading"
      @selection-change="s_selectChange"
      @row-dblclick="s_rowDbclick"
      size="mini"
      ref="search-table"
      border
      :row-key="rowKey"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot :scope="s_list"></slot>
    </el-table>

    <!-- 翻页 总数不等于当前页面的数据长度 -->
    <el-pagination
      :layout="s_pagination.layout"
      @current-change="s_pageChange"
      @size-change="s_sizeChange"
      :page-sizes="[10, 50, 100]"
      :current-page="~~s_pagination.page + pageOffset"
      :page-size="s_pagination.size"
      :total="s_pagination.total"
    ></el-pagination>
  </div>
</template>

<script>
  import SearchDatePicker from '../component/SearchDatepicker';
  import SearchInput from '../component/SearchInput';

  export default {
    components: {
      SearchDatePicker,
      SearchInput,
    },
    props: {
      apiUrl: {
        type: String,
        default: '',
        required: true,
      },
      rowKey: {
        type: String,
        default: 'id',
      },
      fetchNow: {
        type: Boolean,
        default: true,
      },
      option: {
        type: Array,
        default: () => [],
      },
      pagination: {
        type: Object,
        default: () => {},
      },
      pageOffset: {
        type: Number,
        default: 0,
      },
      listName: {
        type: String,
        default: 'rows',
      },
      itemPerRow: {
        type: [Number, String],
        default: 4,
      },
      // functions
      beforeQuery: {
        type: Function,
        default: () => {},
      },
      querySuccess: {
        type: Function,
        default: (val) => val,
      },
    },
    data() {
      return {
        // 搜索字段
        s_list: [],
        s_searchOpt: [],
        s_searchInfo: {},
        s_tableLoading: false,
        s_initSearchInfo: {},
        s_selectedData: [],
        // option
        s_localOption: [],
        s_optioned: false,
        // pagination
        s_pagination: {
          // 当前页面
          page: 1 - this.pageOffset,
          // 每页数量
          size: 10,
          // 总页数
          total: 0,
          // 请求标志位
          loading: false,
          // 格式
          layout: 'total, sizes, prev, pager, next, jumper',
          ...this.pagination,
        },
      };
    },
    computed: {
      firstPage() {
        return 1 - this.pageOffset;
      },
    },
    watch: {
      option() {
        this.s_optioned = false;
        this.s_initSearch();
      },
      // 页码修改,自动触发获取新的页面
      's_pagination.page': function lilei() {
        this.getList();
      },
      // 改变了条数之后回到首页
      's_pagination.size': function hanmeimei() {
        if (this.s_pagination.page == this.firstPage) {
          this.getList();
        } else {
          this.$set(this.s_pagination, 'page', this.firstPage);
        }
      },
    },
    mounted() {
      this.s_initSearch();
      if (this.fetchNow && this.getList) {
        this.getList();
      }
    },
    methods: {
      getList() {
        // 如果beforeQuery返回true, 则断了请求
        if (
          this.beforeQuery({
            searchInfo: this.s_searchInfo,
          })
        ) {
          return;
        }

        if (!this.apiUrl) return;

        this.$set(this.s_pagination, 'loading', true);

        const { page, size } = this.s_pagination;
        const listQueryParams = {
          ...this.s_searchInfo,
          page,
          size,
        };

        this.$http
          .get(this.apiUrl, {
            params: listQueryParams,
          })
          .then((res) => {
            const { page, pageSize, total } = res;
            if (this.querySuccess) {
              this.s_list = this.querySuccess(res[this.listName]);
            } else {
              this.s_list = res[this.listName];
            }

            this.$set(this.s_pagination, 'total', total);
          })
          .catch(() => {})
          .finally(() => {
            // 取消loading
            this.$set(this.s_pagination, 'loading', false);
          });
      },
      /**
       * 初始化搜索组件, 所有的组件字段都是空值
       */
      s_initSearch() {
        // 防止多次初始化
        if (this.s_optioned) return;

        this.s_localOption = this.option
          .filter((opt) => opt.name)
          .map((opt) => {
            // 默认值
            this.$set(this.s_searchInfo, opt.name, '');
            return opt;
          });

        // 保存初始的状态
        this.s_initSearchInfo = { ...this.s_searchInfo };
        this.s_optioned = true;
      },
      /**
       * 重置搜索条件
       */
      s_resetSearchInfo() {
        this.s_searchInfo = { ...this.s_initSearchInfo };
      },
      /**
       * 搜索事件
       */
      s_fetchData() {
        this.$emit('search', this.s_searchInfo);
        this.s_searchHandler(this.s_searchInfo);
      },
      /**
       * 搜索
       */
      s_searchHandler(data) {
        // 回到第一页
        this.$set(this.s_pagination, 'page', this.firstPage);
        this.getList();
      },
      /**
       * 翻页调整
       */
      s_pageChange(val) {
        const targetPage = val - this.pageOffset;
        this.$emit('page-change', targetPage);
        this.$set(this.s_pagination, 'page', targetPage);
      },
      s_sizeChange(val) {
        this.$emit('size-change', val);
        this.$set(this.s_pagination, 'size', val);
      },
      /**
       * 选择数据的回调
       */
      s_selectChange(val) {
        this.$emit('selection-change', val);
        this.s_selectedData = [...val];
      },
      /**
       * 双击
       */
      s_rowDbclick(...arg) {
        this.$emit('table-row-dbclick', ...arg);
      },
      /**
       * 更新数据
       * public
       */
      updateSearchInfo(key, value) {
        // key-value覆盖
        if (typeof key === 'string') {
          this.$set(this.s_searchInfo, key, value);
        }
        // 传值覆盖
        if (typeof key === 'object') {
          this.s_searchInfo = {
            ...this.s_searchInfo,
            ...key,
          };
        }
      },
    },
  };
</script>

<style lang="less">
  .search-list {
    padding: 0 20px;

    .search-box {
      padding: 15px 0;

      .el-date-editor {
        width: 100%;
      }
    }

    .search-input-box {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: space-around;
      flex-flow: row wrap;
      .el-row {
        width: 100%;
      }
    }

    .btn-before {
      margin-right: 10px;
    }

    .tab-before {
      font-size: 12px;
      padding-bottom: 10px;
    }

    .el-button + .btn-after {
      margin-left: 10px;
    }

    .search-btn-box {
      margin: 10px 0;
      box-sizing: border-box;
      display: flex;
    }

    .el-pagination {
      padding: 2px 20px;
      margin-top: 10px;
      text-align: right;
    }

    .search-item {
      display: flex;
      align-items: center;

      .label-box {
        min-width: 70px;
        display: inline-block;
      }

      label {
        font-weight: normal;
      }
    }
  }
</style>
