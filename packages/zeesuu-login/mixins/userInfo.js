export default {
  computed: {
    $userInfo() {
      return this ? this.$store.getters.$userInfo : {};
    },
  },
  // 设置
  methods: {
    async $setUserInfo(payload) {
      await this.$store.dispatch('$setUserInfo', payload);
    },
    async $cleanUserInfo() {
      await this.$store.dispatch('$setUserInfo', {});
    },
    async $setToken(payload) {
      await this.$store.dispatch('$setToken', payload);
    },
  },
};
