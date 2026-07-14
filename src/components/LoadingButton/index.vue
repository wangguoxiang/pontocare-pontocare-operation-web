<template>
  <div class="btn-loading" :class="{'clean':btnType==='clean'}" :style="`width:${width};height:${height};margin:${margin}`">
    <span v-loading="true"></span>
  </div>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    btnType: {
      type: String,
      default: 'search'
    },
    width: {
      type: String,
      dafault: '40px'
    },
    height: {
      type: String,
      dafault: '40px'
    },
    margin: {
      type: String,
      dafault: '0'
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #325bf2;
  opacity: 0.25;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  margin-left: 5px;
  cursor: not-allowed;

  ::v-deep .el-loading-parent--relative {
    width: 100%;
    height: 100%;

    .el-loading-mask {
      width: 100%;
      height: 100%;
      background-color: rgba(121, 130, 166, 0.25);

      .el-loading-spinner {
        top: 0;
        margin-top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        .circular {
          width: 20px;
          height: 20px;

          .path {
            stroke-width: 6;
            stroke: #fff;
          }
        }
      }
    }
  }
}

.clean {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
</style>
