<template>
  <div id="app">
    <component v-bind:is="layout"></component>
    <PsHandleResult
      v-if="showSessionExpired"
      :title="expiredTitle"
      :description="expiredDescription"
      :img="require('@/assets/icons/ic_prohibit.svg')"
      @onConfirm="gotoLogin()"
    />
    <PsHandleResult
      v-if="showCaptchaVerifyFail"
      :description="captchaVerifyDescription"
      :img="require('@/assets/icons/ic_prohibit.svg')"
      @onConfirm="closeDialog()"
    />
    <MessageTip
      v-if="isUpdateVersion"
      :title="updateTitle"
      :description="updateDescription"
      :confirmText="confirmText"
      :img="require('@/assets/imgs/img_update.svg')"
      @onConfirm="updateVersion()"
    />
  </div>
</template>

<script>
import defaultLayout from '@/layout/default.vue';
import primaryLayout from '@/layout/primary.vue';
import MessageTip from '@/components/pontocarePopup/messageTip.vue';
export default {
  name: 'App',
  components: {
    default: defaultLayout,
    primary: primaryLayout,
    MessageTip
  },
  data() {
    return {
      updateTitle: this.$t('loginNewVersionAveTWeb'),
      updateDescription: this.$t('loginNewVersionAveWeb'),
      confirmText: this.$t('dashboardRefresh'),
      expiredTitle: this.$t('sessionExpired'),
      expiredDescription: this.$t('sessionExpiredTip'),
      captchaVerifyDescription: this.$t('captchaVerifyDescription')
    };
  },
  computed: {
    layout() {
      const { layout } = this.$route.meta;
      return layout;
    },
    showSessionExpired() {
      return this.$store.state.system.showSessionExpired;
    },
    showCaptchaVerifyFail() {
      return this.$store.state.system.showCaptchaVerifyFail;
    },
    isUpdateVersion() {
      return this.$store.state.system.isUpdateVersion;
    }
  },
  mounted() {
    this.$store.dispatch('system/getServerList');
    this.setFontFamily();
    this.$nextTick(() => {
      const grecaptcha = document.querySelector('.grecaptcha-badge');
      if (grecaptcha) {
        grecaptcha.style.display = 'none';
      }
    });
  },
  methods: {
    setFontFamily() {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if (isMac) {
        document.body.style.fontFamily = 'SFPro, sans-serif';
        document.documentElement.style.setProperty(
          'font-family',
          'SFPro, sans-serif'
        );
      } else {
        document.body.style.fontFamily = 'Roboto, sans-serif';
        document.documentElement.style.setProperty(
          'font-family',
          'Roboto, sans-serif'
        );
      }
    },
    gotoLogin() {
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      this.$store.commit('system/SET_SHOW_SESSION_EXPIRED', false);
      this.$router.push('/login');
    },
    closeDialog() {
      this.$store.commit('system/SET_SHOW_CAPTCHA_VERIFY_FAIL', false);
    },
    updateVersion() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "SFPro";
  src: url("@/assets/fonts/SF-Pro.ttf");
  font-display: swap;
}

@font-face {
  font-family: "Roboto";
  src: url("@/assets/fonts/Roboto-Regular.ttf");
  font-display: swap;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 1280px;
  overflow-x: auto;
}
body {
  line-height: unset;
}
.rc-anchor-content {
  display: none;
}
.grecaptcha-badge {
  display: none !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #222e61;
}
.el-checkbox {
  color: #222e61;
  align-items: center;
  display: inline-flex;
  margin-right: 10px;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #325bf2;
  border-color: #325bf2;
}
.el-radio.is-checked{
  .el-radio__inner{
    background-color: #325bf2;
    border-color: #325bf2;
  }
}
.el-drawer__header {
  position: relative;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #222e61;
  margin-bottom: 0px;
  box-shadow: 0px 1px 0px 0px rgba(194, 198, 214, 0.302);
  background: #ffffff;
}
.rtl {
  direction: ltr !important;
}
.el-card {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e3e9;
}
.el-card__body,
.el-main {
  padding: 10px;
}
.el-checkbox__label {
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-table__body tbody tr .el-table__cell {
  padding: 12px 16px;
  border-right: none !important;
}
.el-table__empty-text {
  line-height: 0;
}
.table-hover-bg {
  background-color: #f5f7fa !important;
}
.btn-disable {
  border: 1px solid #b2b2b2 !important;
  color: #b2b2b2 !important;
  opacity: 0.25 !important;
  cursor: not-allowed !important;
}
.text-btn-disable {
  cursor: not-allowed !important;
  opacity: 0.7 !important;
}
.server-icon {
  width: 18px;
  height: 18px;
  margin-right: 9px;
}
.login-server-list {
  width: 200px;
  padding: 5px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #eef0f6;
  margin-bottom: 0;

  .popper__arrow {
    display: none;
  }

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    margin-top: 3px;
    span {
      font-weight: 400;
      font-size: 14px;
      color: #222e61;
      line-height: 20px;
    }
  }
  .el-dropdown-menu__item:first-child {
    margin-top: 0;
  }
  .el-dropdown-menu__item:hover {
    background: #f4f6fa;
  }

  .el-dropdown-menu__item.active {
    position: relative;

    span {
      font-weight: 500;
      font-size: 14px;
      color: #325bf2;
      line-height: 20px;
    }
  }
  .active::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    background: url("@/assets/icons/ic_mark.svg") no-repeat center;
    background-size: contain;
  }
}

.members-action-dropdown.el-dropdown-menu.el-popper {
  margin-top: 0;
  min-width: 210px;
  padding: 5px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #eef0f6;

  .popper__arrow {
    display: none;
  }

  .el-dropdown-menu__item {
    width: 100%;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: 400;
    font-size: 14px;
    color: #222e61;
    line-height: 16px;
    display: flex;
    align-items: center;
    margin-top: 5px;
    cursor: pointer;
  }
  .el-dropdown-menu__item:first-child {
    margin-top: 0;
  }
  .el-dropdown-menu__item:hover {
    background: #f4f6fa;
  }

  .el-dropdown-menu__item.action-del {
    color: #e62243;
  }
}
.members-home-access-popover.el-popover.el-popper {
  margin-top: 0;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #eef0f6;
  display: flex;
  flex-direction: column;
  max-height: 450px;
  overflow-y: auto;
  .home-access-detail-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .label {
      width: 135px;
      font-weight: 600;
      font-size: 14px;
      color: #222e61;
      line-height: 16px;
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      width: 210px;
      font-weight: 400;
      font-size: 14px;
      color: #666f99;
      line-height: 16px;

      .home-access-list {
        margin-right: 3px;
      }
    }

    .action {
      display: flex;
      justify-content: center;
      width: 100%;
      .btn-review:hover {
        background: #EDEEF3;
      }
      .btn-review {
        display: flex;
        width: 154px;
        height: 36px;
        border-radius: 10px;
        border: 1px solid #b9bcca;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        font-size: 14px;
        color: #222e61;
        line-height: 16px;
        cursor: pointer;
        .btn-review-icon {
          width: 18px;
          height: 18px;
          background: url("@/assets/icons/ic_jump.svg") no-repeat center;
          background-size: contain;
          margin-right: 6px;
        }
      }
    }
  }

  .home-access-detail-item:first-child {
    margin-top: 0;
  }
}
.language-selector {
  height: 32px;
  .el-select {
    width: 100%;
    height: 100%;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
        background: #ffffff;
        border-radius: 26px;
        border: 1px solid #e2e3e9;
        font-weight: 500;
        font-size: 14px;
        color: #222e61;
      }
      .el-input__inner:hover {
        border: 1px solid #325bf2;
      }
      .el-input__suffix {
        .el-input__suffix-inner {
          .el-icon-arrow-up::before {
            content: "";
          }
          .el-select__caret {
            background: url("@/assets/icons/ic_inputbox_dropdown.svg") no-repeat
              center;
            background-size: 18px 18px;
            transform: rotate(0deg);
          }
          .el-select__caret.is-reverse {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
.language-selector-popper.el-select-dropdown.el-popper {
  margin-top: 2px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #eef0f6;
  .popper__arrow {
    display: none;
  }

  .el-select-dropdown__list {
    padding: 5px;

    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      height: 36px;
      width: 100%;
      margin-top: 5px;
      font-weight: 400;
      font-size: 14px;
      color: #222e61;
      line-height: 16px;
      text-align: left;
      padding-left: 15px;
      border-radius: 5px;
    }

    .el-select-dropdown__item:first-child {
      margin-top: 0;
    }

    .hover {
      background: #f4f6fa;
    }

    .selected {
      position: relative;
      font-weight: 600;
      font-size: 14px;
      color: #325bf2;
      line-height: 16px;
    }

    .selected::after {
      position: absolute;
      top: 50%;
      right: 9px;
      transform: translateY(-50%);
      content: "";
      width: 18px;
      height: 18px;
      background: url("@/assets/icons/ic_mark.svg") no-repeat center;
      background-size: contain;
    }
  }
}
.bar-chart-popper {
  background: #edff4e !important;
  color: #292d3d !important;
  font-size: 18px;
  font-weight: normal;
  .popper__arrow {
    border-top-color: #edff4e !important;
  }
  .popper__arrow:after {
    border-top-color: #edff4e !important;
  }
}
.mark-selector.el-select-dropdown.el-popper {
  margin-top: 2px;
  width: 180px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #eef0f6;

  .popper__arrow {
    display: none;
  }

  .el-select-dropdown__list {
    padding: 5px;
    .el-select-dropdown__item:hover {
      background: #f4f6fa;
    }
    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      height: 36px;
      width: 100%;
      margin-top: 5px;
      font-weight: 400;
      font-size: 14px;
      color: #222e61;
      line-height: 16px;
      text-align: left;
      padding-left: 5px;
      border-radius: 5px;
      span {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-select-dropdown__item:first-child {
      margin-top: 0;
    }

    .hover {
      background: unset;
    }

    .selected {
      position: relative;
      font-weight: 600;
      font-size: 14px;
      color: #325bf2;
      line-height: 16px;
    }

    .selected::after {
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      content: "";
      width: 18px;
      height: 18px;
      background: url("@/assets/icons/ic_mark.svg") no-repeat center;
      background-size: contain;
    }
  }
}

.el-input__inner {
  line-height: unset !important;
}
.input-not-empty {
  .el-input__inner {
    padding: 16px 25px 4px 10px;
  }
}
.el-tooltip__popper {
  white-space: pre-line;
}
.el-tooltip__popper {
  white-space: pre-line;
}
.el-tooltip__popper.is-light {
  font-size: 14px;
  color: #222e61;
  padding: 12px;
  border: unset !important;
  border-radius: 8px;
  box-shadow: 0 6px 12px 0 rgba(46, 48, 107, 0.2);
  max-width: 400px;
  .home-label-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .label-item {
      max-width: 230px;
      font-size: 13px;
      color: #7982a6;
      display: flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 20px;
      background: rgba(92, 118, 214, 0.15);
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.el-tooltip__popper.is-light {
  font-size: 14px;
  color: #222e61;
  padding: 12px;
  border: unset !important;
  border-radius: 8px;
  box-shadow: 0 6px 12px 0 rgba(46, 48, 107, 0.2);
  max-width: 400px;
}
.el-tooltip__popper.is-light.label-tool-tip{
  max-height: 300px;
  overflow-y: auto;
}
.form-icon-help:hover {
  background: url("@/assets/icons/ic_help_deep_grey.svg") no-repeat center;
  background-size: contain;
}
.form-icon-help {
  margin-left: 7px;
  width: 17px;
  height: 17px;
  background: url("@/assets/icons/ic_help_grey.svg") no-repeat center;
  background-size: contain;
  cursor: pointer;
}
.el-tooltip__popper.is-light[x-placement^="right"] .popper__arrow {
  border-right-color: #fff;
}
.el-tooltip__popper.is-light[x-placement^="top"] .popper__arrow {
  border-top-color: #fff;
}
.el-tooltip__popper.is-light[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #fff;
}
.el-tooltip__popper.is-light[x-placement^="left"] .popper__arrow {
  border-left-color: #fff;
}
button, input, textarea {
  font: inherit;
}

</style>
