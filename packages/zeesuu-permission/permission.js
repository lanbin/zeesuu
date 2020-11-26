import store from '@/store';

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const permission = store.getters.$permission;

    if (!permission || permission.includes('admin')) {
      return;
    }

    if (value && value instanceof Array) {
      const permissionRoles = value.filter((v) => !!v);
      const hasPermission = permission.some((role) => {
        return permissionRoles.includes(role);
      });

      if (!hasPermission || permissionRoles.length === 0) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`使用方式： v-permission="['admin','editor']"`);
    }
  },
};
