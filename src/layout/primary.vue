<template>
  <div class="layout-primary">
    <Aside />
    <div class="layout-content">
      <router-view />
    </div>
  </div>
</template>
<script>
import Aside from '@/components/aside/index.vue';
export default {
  components: {
    Aside
  }
};
</script>
<style lang="scss" scoped>
.layout-primary{
  display: flex;
  width: 100%;
  height: 100%;

  .layout-content{
    height: 100%;
    width: calc(100% - 200px);
  }
}
</style>
