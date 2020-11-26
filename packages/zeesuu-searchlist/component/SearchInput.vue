<template>
  <div class="search-input search-item">
    <el-input
      :id="inputId"
      v-model="inputVal"
      size="mini"
      maxlength="100"
      clearable
      :placeholder="label"
      v-bind="$attrs"
      v-on="$listeners"
      @blur="$emit('blur')"
      @change="inputHanlder"
      @input.native="inputHanlder"
    ></el-input>
  </div>
</template>

<script>
  import SEARCH_COM_NAME from '../searchComName';
  export default {
    props: ['label', 'value', 'conf'],
    name: SEARCH_COM_NAME.SEARCH_INPUT,
    data() {
      return {
        inputVal: this.value ? this.value : '',
        inputId: `search-input-${Math.floor(Math.random() * 1e3)}`,
      };
    },
    watch: {
      value() {
        this.inputVal = this.value;
      },
    },
    methods: {
      inputHanlder() {
        this.$emit('input', this.inputVal);
      },
    },
  };
</script>
