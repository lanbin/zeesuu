import SearchList from './component/SearchList';
import SearchComName from './searchComName';

export default {
  install(Vue, options) {
    Vue.component('SearchList', SearchList);

    Vue.prototype.SEARCH_COMP_ENUM = SearchComName;
  },
};
