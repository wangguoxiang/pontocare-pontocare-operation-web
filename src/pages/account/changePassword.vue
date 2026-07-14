<template>
  <div class="change-password__wrapper">
    <div class="popup">
      <div class="title">{{ $t('changePassword') }}</div>
      <div class="form">
        <div class="form-item">
          <div class="label">{{ $t('oldPassword') }}</div>
          <el-input
            :placeholder="$t('pleaseEnter')"
            v-model="oldPassword"
            @focus="handleOldPasswordFocus"
            @blur="handleOldPasswordBlur"
            :class="{ 'error-input': oldPasswordError }"
          >
            <div slot="prefix" class="icon-input-pwd"></div>
          </el-input>
          <div class="error-text" v-if="oldPasswordError">{{ oldPasswordErrorText }}</div>
        </div>
        <div class="form-item" style="margin-top: 20px">
          <div class="label">{{ $t('newPassword') }}</div>
          <el-input
            :placeholder="$t('pleaseEnter')"
            v-model="newPassword"
            @focus="handleNewPasswordFocus"
            @blur="handleNewPasswordBlur"
            :class="{ 'error-input': newPasswordError }"
          >
            <div slot="prefix" class="icon-input-pwd"></div>
          </el-input>
          <div class="error-text" v-if="newPasswordError && newPasswordErrorText">{{ newPasswordErrorText }}</div>
        </div>

        <div class="pwd-check">
          <div class="label" style="margin-bottom: 8px">{{ $t('passwordRequirements') }}</div>
          <div class="pwd-role-list">
            <div class="role-item">
              <div :class="isPassLower ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t('requirements0') }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassUpper ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t('requirements1') }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassDigit ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t('requirements2') }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassSpecial ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t('requirements3') }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassLength8 ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t('length8') }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassLength32 ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t('length32') }}</div>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <CancelButton :width='175'
                        :height="36"
                        :text="$t('cancel')"
                        @click.native="closePopup" />
          <ConfirmButton :width='175'
                         :height="36"
                         :text="$t('changePassword')"
                         :isDisabled="btnDisable"
                         @click.native="changePassword" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  data() {
    return {
      oldPassword: '',
      oldPasswordError: false,
      oldPasswordErrorText: '',

      newPassword: '',
      newPasswordError: false,
      newPasswordErrorText: ''
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    },
    isPassLower() {
      return /[a-z]/.test(this.newPassword);
    },
    isPassUpper() {
      return /[A-Z]/.test(this.newPassword);
    },
    isPassDigit() {
      return /\d/.test(this.newPassword);
    },
    isPassSpecial() {
      return /[^\w\s]/.test(this.newPassword);
    },
    isPassLength8() {
      return this.newPassword.length > 7;
    },
    isPassLength32() {
      return this.newPassword.length > 0 && this.newPassword.length < 33;
    },
    btnDisable() {
      return this.newPassword.length === 0 || this.oldPassword.length === 0;
    }
  },
  methods: {
    handleOldPasswordFocus() {
      this.oldPasswordError = false;
      this.oldPasswordErrorText = '';
    },
    handleOldPasswordBlur() {
      this.checkOldPassword();
    },
    checkOldPassword() {
      if (this.oldPassword.length === 0) {
        this.oldPasswordErrorText = this.$t('oldPasswordNotEmpty');
        this.oldPasswordError = true;
      }
    },
    handleNewPasswordFocus() {
      this.newPasswordError = false;
      this.newPasswordErrorText = '';
    },
    handleNewPasswordBlur() {
      this.checkNewPassword();
    },
    checkNewPassword() {
      if (this.newPassword.length === 0) {
        this.newPasswordErrorText = this.$t('newPasswordTip');
        this.newPasswordError = true;
      }
      if (this.isPassLower && this.isPassUpper && this.isPassDigit && this.isPassSpecial && this.isPassLength8 && this.isPassLength32) {
        this.newPasswordError = false;
      } else {
        this.newPasswordError = true;
      }
    },
    closePopup() {
      this.$emit('closePopup', false);
    },
    changePassword() {
      this.checkOldPassword();
      this.checkNewPassword();
      if (this.newPasswordError || this.oldPasswordError) {
        return;
      }
      const payload = {
        oldPassword: md5(this.oldPassword),
        newPassword: md5(this.newPassword)
      };
      this.$psPageLoading().show();
      this.$http
        .changePassword(this.userId, payload)
        .then(() => {
          this.$emit('closePopup', true);
        }).finally(() => {
          this.$psPageLoading().hide();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.change-password__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  .popup {
    width: 400px;
    background: #f3f4f7;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    .title {
      font-weight: 600;
      font-size: 16px;
      color: #222e61;
      line-height: 19px;
    }
    .form {
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .text {
        font-weight: 400;
        font-size: 14px;
        color: #666f99;
        line-height: 16px;
        margin-top: 4px;
      }

      .form-item {
        display: flex;
        flex-direction: column;
        .label {
          font-weight: 500;
          font-size: 14px;
          color: #222E61;
          line-height: 16px;
        }

        .tips {
          font-weight: 400;
          font-size: 13px;
          color: #666f99;
          line-height: 15px;
          margin-top: 4px;
        }

        ::v-deep .el-input {
          height: 36px;
          margin-top: 6px;
          .el-input__inner {
            border: 1px solid transparent;
            border-radius: 20px;
            height: 100%;
            padding-left: 34px;
          }
          .el-input__inner::placeholder {
            font-weight: 400;
            font-size: 14px;
            color: #7982a6;
            line-height: 16px;
          }
          .el-input__inner:hover {
            border: 1px solid #325bf2;
          }
          .el-input__inner:focus {
            border: 2px solid #325bf2;
          }
          .el-input__prefix {
            width: 18px;
            height: 18px;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            .icon-input-pwd {
              width: 18px;
              height: 18px;
              background: url("@/assets/icons/ic_password.svg") no-repeat center;
              background-size: contain;
            }
          }
        }
        .error-text {
          font-weight: 400;
          font-size: 12px;
          color: #ff2c50;
          line-height: 14px;
          margin-top: 4px;
        }
        .error-input {
          ::v-deep .el-input__inner {
            border: 2px solid #ff2c50;
          }
        }

        .is-invalid > ::v-deep .el-input__inner {
          border: 2px solid #f53d3d;
        }

        .code-box {
          display: flex;
          justify-content: space-between;
          height: 65px;
          margin-top: 8px;
          .el-input {
            width: 65px;
            height: 65px;
            ::v-deep .el-input__inner {
              width: 100%;
              height: 100%;
              background: #edeef3;
              border-radius: 6px;
              border: transparent;
              font-weight: normal;
              font-size: 40px;
              color: #333333;
              line-height: 48px;
              text-align: center;
            }

            ::v-deep .el-input__inner:hover {
              border: 2px solid #325bf2;
            }
            ::v-deep .el-input__inner:focus {
              border: 2px solid #325bf2;
            }
          }
        }
      }

      .pwd-check {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        .label {
          font-weight: 500;
          font-size: 14px;
          color: #222E61;
          line-height: 16px;
        }

        .pwd-role-list {
          display: flex;
          flex-direction: column;

          .role-item {
            display: flex;
            align-items: center;
            margin-bottom: 4px;

            .icon-failed {
              width: 14px;
              height: 14px;
              margin-right: 1px;
              background: url("@/assets/icons/ic_password_failed.svg") no-repeat
              center;
              background-size: contain;
            }
            .icon-success {
              width: 14px;
              height: 14px;
              margin-right: 1px;
              background: url("@/assets/icons/ic_successfully.svg")
              no-repeat center;
              background-size: contain;
            }
            .role {
              font-weight: 400;
              font-size: 14px;
              color: #666f99;
              line-height: 16px;
            }
          }
        }
      }
      .btn-group {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;

        .btn-cancel,
        .btn-save {
          width: 175px;
          height: 36px;
          cursor: pointer;
        }

        .btn-cancel {
          border-radius: 10px;
          border: 1px solid #b9bcca;
          font-weight: 400;
          font-size: 14px;
          color: #222e61;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-save {
          background: linear-gradient(90deg, #1c21e4 0%, #4895ff 100%);
          box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
