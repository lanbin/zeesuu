<template>
  <div class="search-datepicker search-item">
    <el-date-picker
      v-model="dateVal"
      size="mini"
      :range-separator="localConf.rangeSeparator"
      :type="localConf.type || 'date'"
      :placeholder="localConf.placeholder || '选择日期'"
      :editable="localConf.editable || true"
      :clearable="localConf.clearable || true"
      :start-placeholder="localConf['start-placeholder'] || '开始日期'"
      :end-placeholder="localConf['end-placeholder'] || '结束日期'"
      :value-format="localConf['value-format'] || 'yyyy-MM-dd'"
      :format="localConf.format || 'yyyy-MM-dd'"
      @change="datepickerHandler"
    ></el-date-picker>
  </div>
</template>

<script>
  import SEARCH_COM_NAME from '../searchComName';

  export default {
    props: ['label', 'value', 'conf'],
    name: SEARCH_COM_NAME.SEARCH_DATEPICKER,
    data() {
      return {
        dateVal: this.value || '',
        localConf: this.conf || {},
      };
    },
    watch: {
      value() {
        this.dateVal = this.value;
      },
    },
    methods: {
      datepickerHandler() {
        this.$emit('input', this.dateVal);
      },
    },
  };
</script>
