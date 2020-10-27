// export mixins
export { default as LoginMixins } from './mixins/login';

import USERINFO_MIXINS from './mixins/userInfo';
import UserStore from './store/user';

export default {
  install(Vue, options) {
    if (options.store) {
      // 注册登录和用户信息相关的Store
      options.store.registerModule(
        'user',
        UserStore({
          token: options.token,
        }),
      );

      // 给所有组件都增加可以拿到用户信息的功能
      Vue.mixin(USERINFO_MIXINS);
    } else {
      console.error('[@zeesuu/login] needs a store instance');
    }
  },
};
