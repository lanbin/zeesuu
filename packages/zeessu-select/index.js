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
        return (Array.isArray(selectData[name]) ? selectData[name] : []).find(
          (item) => item[key] == value,
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
            selectVal: '',
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
                this.loopData = res.map((result) => {
                  return {
                    label: result[data.label || 'label'],
                    value: result[data.value || 'value'],
                  };
                });
              });
            } else {
              this.loopData = data;
            }
            // TODO: 把结果还是赋值给他, 但是这里呢可能还是要提早准备一下
            selectData[name] = [...this.loopData];
            this.setDefaultValue();
          },
          setDefaultValue() {
            let value = '';

            switch (typeof this.value) {
              // 如果传进来的值是boolean, 转成字符串
              // 用于对照
              case 'undefined':
                value = '';
                break;
              default:
                value = this.value.toString();
            }
            this.selectVal = value;
          },
          selectHandler() {
            this.$emit(
              'input',
              // 如果是boolean的字符串,则返回boolean
              ['true', 'false'].indexOf(this.selectVal) > -1
                ? this.selectVal === 'true'
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
  },
};
