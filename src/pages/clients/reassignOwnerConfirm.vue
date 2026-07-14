<template>
  <div class="reassign-owner-popup__wrapper" @click="handleClickOutside">
    <div class="del-popup">
      <div class="del-img"></div>
      <div class="title">{{ $t("keepAccount") }}</div>
      <div class="description">
        {{ $t("reassignOwnerTip") }}
      </div>
      <div class="description">
        {{ $t("reassignOwnerDesc") }}
      </div>
      <div class="description">
        <div class="radio-select">
          <div class="role-item" @click="keepType = 'downgrade'">
            <div :class="keepType === 'downgrade'?'select-icon':'no-select-icon'"></div>
            {{$t('downgradeToUser')}}
          </div>
          <div class="role-item" @click="keepType = 'delete'">
            <div :class="keepType === 'delete'?'select-icon':'no-select-icon'"></div>
            <span style="color: #E81C1C">{{$t('deleteAccount')}}</span>
          </div>
        </div>
      </div>
      <div class="description" v-if="keepType !== ''">
        <el-input
          v-model="password"
          autocomplete="new-password"
          :type="(showPwd || isInit) ? 'text' : 'password'"
          @focus="handlePwdFocus"
          @blur="handlePwdBlur"
          @input="debouncedCheckPwd"
          :class="{ 'input-error': passwordError }"
          :placeholder="$t('pleasePassword')"
        >
          <template #suffix>
            <div
              v-if="passwordFocus"
              :class="{'icon-eyes':!showPwd,'icon-show':showPwd}"
              @mousedown.prevent="showPwd = !showPwd"
            ></div>
          </template>
        </el-input>
        <div class="error-text" v-if="passwordError">{{ passwordErrorText }}</div>
      </div>
      <div class="btn-group">
        <CancelButton
          :text="$t('cancel')"
          :height="36"
          @click.native="$emit('cancel')"
        >
        </CancelButton>
        <ConfirmButton
          :text="$t('confirm')"
          :height="36"
          :isDisabled="btnDisable"
          @click.native="confirm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils';
import md5 from 'js-md5';
export default {
  name: 'ReassignOwner',
  props: {
    closeOnClickModal: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      keepType: '',
      isInit: true,
      password: '',
      passwordFocus: false,
      passwordError: false,
      passwordErrorText: '',
      showPwd: false,
      debouncedCheckPwd: null,
      isChecking: true
    };
  },
  computed: {
    btnDisable() {
      return this.keepType === '' || this.password === '' || this.isChecking || this.passwordError;
    }
  },
  mounted() {
    this.debouncedCheckPwd = this.debounce(this.checkPwd, 500);
  },
  methods: {
    debounce,
    handleClickOutside(event) {
      const popup = this.$el.querySelector('.del-popup');
      if (this.closeOnClickModal && popup && !popup.contains(event.target)) {
        this.$emit('cancel');
      }
    },
    handlePwdFocus() {
      // 使用type=password时，浏览器会自动填充密码，先默认为text，focus后再设置成password
      setTimeout(() => {
        this.isInit = false;
      }, 100);
      this.passwordFocus = true;
    },
    handlePwdBlur() {
      this.passwordFocus = false;
    },
    checkPwd() {
      this.isChecking = true;
      const payload = {
        password: md5(this.password)
      };
      this.$http.checkPassword(payload).then((res) => {
        this.passwordError = false;
      }).catch((err) => {
        this.passwordError = true;
        this.passwordErrorText = this.$t('passwordError');
      }).finally(() => {
        this.isChecking = false;
      });
    },

    confirm() {
      if (this.btnDisable) {
        return;
      }
      this.$emit('confirm', this.keepType === 'downgrade');
    }
  }
};
</script>

<style lang="scss" scoped>
.reassign-owner-popup__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 990;

  .del-popup {
    width: 360px;
    padding: 20px;
    border-radius: 20px;
    background: #f3f4f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9;

    .del-img {
      width: 100px;
      height: 100px;
      background: url("@/assets/imgs/img_warning.svg") no-repeat center;
      background-size: contain;
    }

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #222e61;
      margin-top: 20px;
      text-align: center;
    }

    .description {
      font-size: 14px;
      text-align: center;
      color: #222e61;
      margin-top: 10px;
      width: 100%;
      .radio-select {
        display: flex;
        flex-direction: column;
        gap: 12px;
        .role-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: normal;
          color: #222E61;
          cursor: pointer;
          .select-icon {
            margin-right: 7px;
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_radio_selected.svg") no-repeat center;
          }
          .no-select-icon {
            margin-right: 7px;
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_radio_not_selected.svg") no-repeat center;
          }
        }
      }
      ::v-deep .el-input {
        height: 36px;
        width: 100%;

        .el-input__inner {
          width: 100%;
          height: 100%;
          border: 1px solid transparent;
          border-radius: 20px;
          background: #ffffff;
          padding-right: 40px;
        }

        .el-input__inner::placeholder {
          font-size: 13px;
          color: #7982a6;
        }

        .el-input__inner:hover {
          border: 1px solid #325bf2;
        }

        .el-input__inner:focus {
          border: 2px solid #325bf2;
        }

        .el-input__suffix {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          cursor: pointer;

          .icon-eyes {
            width: 100%;
            height: 100%;
            background: url("@/assets/icons/ic_hide.svg") no-repeat center;
            background-size: contain;
          }

          .icon-show{
            width: 100%;
            height: 100%;
            background: url('@/assets/icons/ic_unhide.svg') no-repeat center;
            background-size: contain;
          }
        }
      }

      ::v-deep .el-input.input-error {
        .el-input__inner {
          border: 1px solid red;
        }
      }

      .error-text {
        width: 400px;
        font-size: 12px;
        color: #ff2c50;
        text-align: left;
        margin-top: 5px;
      }
    }

    .btn-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      gap: 16px;
      > div {
        flex: 1;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 24px;
      }
      .btn-cancel {
        border: 1px solid rgba(51, 73, 153, 0.2);
        color: #222e61;
        background: #fff;
      }

      .btn-cancel:hover{
        background: #F3F4F7;
      }
      .btn-cancel:active{
        background: #edeef3;
      }
      .btn-confirm {
        background: #325bf2;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        color: #fff;
      }

      .btn-confirm:hover{
        background: #5779F4;
      }
      .btn-confirm:active{
        background: #0F3FF0;
      }
    }
  }
}
</style>
