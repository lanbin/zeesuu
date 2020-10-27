<template>
  <div id="app">
    <header>
      <div class="user-name" v-if="$userInfo.username">
        Current Logined: {{ $userInfo.username }}
      </div>
    </header>
    <h1>@Zeesuu/service</h1>
    <button @click="getUserInfo">UserInfo Requst Example</button>

    <h1>@Zeesuu/login</h1>
    <p>{{ $userInfo }}</p>

    <button @click="$setUserInfo({ username: 'zeesuu' })">UserInfo Set Example(After Login)</button>
    <button @click="$cleanUserInfo()">UserInfo Clean Example(After Logout)</button>
  </div>
</template>

<script>
  export default {
    mounted() {},
    methods: {
      getUserInfo() {
        this.$service
          .UserInfo()
          .then()
          .catch((err) => {
            console.log(err);
          });
      },
    },
  };
</script>

<style scoped>
  #app {
    padding: 20px;
    box-sizing: border-box;
    max-width: 1200px;
    min-height: 100vh;
    margin: 0 auto;
    background: #eeeeee;
  }

  header {
    display: flex;
    padding: 20px;
  }

  .user-name {
    margin-left: auto;
  }

  button {
    padding: 10px;
    cursor: pointer;
  }

  button + button {
    margin-left: 20px;
  }
</style>
