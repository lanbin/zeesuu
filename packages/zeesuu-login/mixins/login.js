const PASSWORD_TYPE = 'password';

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },

      loginLoading: false,
      passwordType: PASSWORD_TYPE,
      redirect: '',
    };
  },
  watch: {
    /**
     * 获取redirect地址
     */
    $route: {
      handler() {
        if (this.$route) {
          const { redirect } = this.$route.query;
          this.redirect = redirect || '';
        }
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * 切换密码是否可看
     */
    showPassword() {
      this.passwordType = this.passwordType === PASSWORD_TYPE ? '' : PASSWORD_TYPE;
      this.$nextTick(() => {
        if (this.$refs.password) {
          this.$refs.password.focus();
        }
      });
    },
    loginSubmit() {},
  },
};
