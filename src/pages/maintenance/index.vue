<template>
  <div style="width: 100%;display: flex;justify-content: center;margin-top: 15%;">
    <div class="maintenance-content">
      <div>
        <img src="@/assets/icons/img_upgrading.svg" alt="" style="width: 100px;height: 100px" />
      </div>
      <div class="title">{{ $t('maintenanceInProgress') }}</div>
      <div class="description">{{ $t('maintenanceTip') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'maintenance'
};
</script>

<style lang="scss" scoped>
.maintenance-content {
  width: 410px;
  display: flex;
  flex-direction: column;
  text-align: center;
  .title {
    font-weight: 600;
    font-size: 16px;
    color: #222e61;
    line-height: 19px;
    margin: 10px 0;
  }

  .description {
    font-weight: 400;
    font-size: 14px;
    color: #7982A6;
  }
}
</style>
