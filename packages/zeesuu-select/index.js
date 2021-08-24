const SELECT_DATA = {
  yesNo: [
    // 这里必须将true/false改成string
    // 然后在提交的时候,再变成boolean
    {
      label: '否',
      value: 'false',
    },
    {
      label: '是',
      value: 'true',
    },
  ],
};

export default {
  install(Vue, option) {
    const { api, custom } = option;
    const selectData = {
      ...SELECT_DATA,
      ...custom,
      ...api,
    };
    const $selectFormat = {};

    Object.keys(selectData).forEach((name) => {
      /**
       * 关键字搜索
       */
      $selectFormat[name] = (value, key = 'value') => {
        return (
          (Array.isArray(selectData[name]) ? selectData[name] : []).find(
            (item) => item[key] == value,
          ) || {}
        );
      };

      Vue.component(name, {
        props: {
          label: {
            type: String,
          },
          value: {
            required: true,
          },
          conf: {
            type: Object,
            default: () => {},
          },
          valueJoiner: {
            type: String,
            default: ',',
          },
        },
        template: `
                <div class="${name}-select sc-select" >
                  <el-select style="width: 100%"
                            v-model="selectVal"
                            clearable
                            filterable
                            v-bind="$attrs"
                            :placeholder="label"
                            @change="selectHandler">
                    <el-option :value="opt.value.toString()"
                              :label="opt.label"
                              v-for="(opt, index) in loopData"
                              :key="index">
                    </el-option>
                  </el-select>
                </div>
          `,
        watch: {
          value() {
            this.setDefaultValue();
          },
        },
        created() {
          this.unWatch = this.$watch(name, () => {
            this.setData();
          });
        },
        data() {
          return {
            // 多选他是个数组
            selectVal: this.$attrs.multiple ? [] : '',
            loopData: [],
            unWatch: null,
          };
        },
        mounted() {
          this.setData();
        },
        methods: {
          async setData() {
            let data = selectData[name];
            if (!Array.isArray(data)) {
              await this.$http.get(data.url, this.conf ? this.conf.params : {}).then((res) => {
                this.loopData = (data.key ? res[data.key] : res).map((result) => {
                  return {
                    label: result[data.label || 'label'],
                    value: result[data.value || 'value'],
                    ...result,
                  };
                });
              });
            } else {
              this.loopData = data;
            }
            Vue.prototype.$selectData[name] = [...this.loopData];

            this.setDefaultValue();
          },
          setDefaultValue() {
            let value = '';

            // 默认走序号
            if (this.conf && typeof this.conf.setDefaultIndex !== 'undefined') {
              this.selectVal = this.loopData[this.conf.setDefaultIndex].value.toString();
              this.selectHandler();
              delete this.conf.setDefaultIndex;
              return;
            }

            switch (typeof this.value) {
              // 如果传进来的值是boolean, 转成字符串
              // 用于对照
              case 'undefined':
                value = '';
                break;
              default:
                value = this.value.toString();
            }
            // 如果 value长度为0进行split操作的话,会得到一个有一个空字符元素的数组
            this.selectVal =
              value.length > 0 && this.$attrs.multiple ? value.split(this.valueJoiner) : value;
          },
          selectHandler() {
            this.$emit(
              'input',
              // 如果是boolean的字符串,则返回boolean
              ['true', 'false'].indexOf(this.selectVal) > -1
                ? this.selectVal === 'true'
                : // 如果是数组则返回拼接字符串,不是则返回值本身
                Array.isArray(this.selectVal)
                ? this.selectVal.join(this.valueJoiner)
                : this.selectVal,
            );
          },
        },
        destoryed() {
          this.unWatch();
        },
      });
    });

    Vue.prototype.$selectFormat = $selectFormat;
    Vue.prototype.$selectData = selectData;
  },
};
