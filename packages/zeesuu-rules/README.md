# @zeesuu/rules

```
$ npm i @zeessu/rules -S
```

```vue
<template>
  <el-form :rules="userLoginRules"></el-form>
</template>

<script>
  import { COMMON_RULES, LENGTH_RULE, PASSWORD_RULE, NUMBER_RULE } from '@zeesuu/rules';

  export default {
    data() {
      return {
        userLoginRules: {
          username: COMMON_RULES().concat(LENGTH_RULE(6, 18)),
          password: COMMON_RULES().concat(PASSWORD_RULE),
          age: COMMON_RULES().concat(NUMBER_RULE),
        },
      };
    },
  };
</script>
```
