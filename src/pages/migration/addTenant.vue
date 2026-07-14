<template>
  <div class="add-tenant__wrapper">
    <div class="popup">
      <div class="title">{{ $t('reseller0024') }}</div>
      <div class="form-item">
        <div class="label">
          <span>{{ $t('reseller0025') }}</span>
          <el-tooltip
            effect="light"
            :content="$t('tenantNameTip')"
            placement="right"
          >
            <div class="form-icon-help"></div>
          </el-tooltip>
        </div>
        <el-input
          v-model="name"
          @focus="handleNameFocus"
          @blur="handleNameBlur"
          :class="{ 'error-input': nameError }"
        >
        </el-input>
        <div class="error-text" v-if="nameError">{{ nameErrorText }}</div>
      </div>
      <div class="form-item">
        <div class="label">
          <div>{{ $t("loginEmail") }}</div>
          <el-tooltip
            effect="light"
            :content="$t('loginEmailTip')"
            placement="right"
          >
            <div class="form-icon-help"></div>
          </el-tooltip>
        </div>
        <el-input
          v-model="email"
          @focus="handleEmailFocus"
          @blur="handleEmailBlur"
          :class="{ 'error-input': emailError }"
        >
        </el-input>
        <div class="error-text" v-if="emailError">{{ emailErrorText }}</div>
      </div>

      <div class="form-item" style="flex-direction: row">
        <div class="label">{{ $t("password") }}</div>
        <div class="description">{{ $t("randomlyGenerated") }}</div>
      </div>
      <div class="btn-group">
        <CancelButton :width="175" :text="$t('cancel')"  @click.native="handleCancel" />
        <ConfirmButton :width="175"
                       :text="$t('add')"
                       :isDisabled="btnDisable"
                       @click.native="handleAdd" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTenant',
  props: {
    tenantId: [String, Number],
    type: [Number, String]
  },
  data() {
    return {
      name: '',
      nameFocus: false,
      nameError: false,
      email: '',
      emailError: false,
      emailErrorText: ''
    };
  },
  computed: {
    emailEmpty() {
      return this.email.length > 0;
    },
    // 邮箱长度校验
    emailLength() {
      return this.email.length <= 100;
    },
    // 邮箱格式校验
    emailFormat() {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(String(this.email).toLowerCase());
    },
    btnDisable() {
      return (
        this.nameError ||
        this.name === '' ||
        this.emailError ||
        this.email === ''
      );
    }
  },
  methods: {
    checkName() {
      if (this.name.length === 0) {
        this.nameErrorText = this.$t('nameNotEmpty');
        this.nameError = true;
        return;
      }
      if (this.name.length > 200) {
        this.nameErrorText = this.$t('lengthMax', { length: 200 });
        this.nameError = true;
        return;
      }
      this.nameErrorText = '';
      this.nameError = false;
    },
    checkEmail() {
      if (!this.emailEmpty) {
        this.emailErrorText = this.$t('emailNotEmpty');
        this.emailError = true;
        return;
      }
      if (!this.emailLength) {
        this.emailErrorText = this.$t('lengthMax', { length: 100 });
        this.emailError = true;
        return;
      }
      if (!this.emailFormat) {
        this.emailErrorText = this.$t('emailIllegal');
        this.emailError = true;
        return;
      }
      this.emailErrorText = '';
      this.emailError = false;
    },
    handleNameFocus() {
      this.nameError = false;
    },
    handleNameBlur() {
      this.name = this.name.trim();
      this.checkName();
    },
    handleEmailFocus() {
      this.emailError = false;
    },
    handleEmailBlur() {
      this.email = this.email.trim(); // 去除邮箱前后空格
      this.checkEmail();
    },
    handleCancel() {
      this.$emit('closeAddTenant');
    },
    handleAdd() {
      this.checkEmail();
      this.checkName();
      if (this.btnDisable) return;
      this.$psPageLoading().show();
      const params = {
        name: this.name,
        email: this.email,
        tenantId: this.tenantId,
        type: this.type
      };
      this.$http
        .addNewTenant(params)
        .then(() => {
          this.$emit('closeAddTenant', true);
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-tenant__wrapper {
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
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 20px;
    background: #f3f4f7;

    .title {
      font-weight: 600;
      font-size: 16px;
      color: #222e61;
      line-height: 19px;
    }

    .form-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      .label {
        font-weight: 500;
        font-size: 14px;
        color: #222e61;
        line-height: 16px;
        display: flex;
      }

      .description {
        font-size: 14px;
        color: #666f99;
        margin-left: 10px;
      }

      ::v-deep .el-input {
        height: 36px;
        margin-top: 6px;
        .el-input__inner {
          border: 1px solid transparent;
          height: 100%;
          padding: 0 15px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.7);
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
        .el-input__suffix {
          width: 18px;
          height: 18px;
          top: 50%;
          transform: translateY(-50%);
          right: 10px;
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
          border: 1px solid #ff2c50;
        }
      }

      ::v-deep .el-select {
        width: 100%;
        height: 40px;
        .el-input {
          height: 100%;

          .el-input__inner {
            height: 100%;
            border-radius: 20px;
            background-color: #fff;
            font-size: 14px;
            color: #222e61;
            line-height: 16px;
            border: 1px solid transparent;
          }
          .el-input__inner:hover {
            border: 1px solid #325bf2;
          }
          .el-input__prefix {
            left: 10px;
            .prefix-register-status {
              font-weight: 400;
              font-size: 11px;
              color: #7982a6;
              line-height: 12px;
              text-align: left;
            }
          }

          .el-input__inner::placeholder {
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            font-weight: 400;
            font-size: 14px;
            color: #7982a6;
            line-height: 16px;
            text-align: left;
          }
          .el-input__suffix {
            .el-input__suffix-inner {
              .el-icon-arrow-up::before {
                content: "";
              }
              .el-select__caret {
                background: url("@/assets/icons/ic_inputbox_dropdown.svg")
                  no-repeat center;
                background-size: 18px 18px;
                transform: rotate(0deg);
                right: 10px;
              }

              .el-select__caret.is-reverse {
                transform: rotate(180deg);
              }

              .el-icon-circle-close {
                display: block !important;
                background: url("@/assets/icons/ic_clean.svg") no-repeat center;
              }
              .el-icon-circle-close:before {
                content: ""; /* 使用 Unicode 字符表示向下的实心三角箭头 */
              }
            }
          }
        }
      }

      .select-home__wrapper {
        width: 100%;
        border-radius: 20px;
        background: #ffffff;
        padding: 10px;
        overflow: hidden;

        .no-select {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          .icon-add {
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_add_black.svg") no-repeat center;
            background-size: contain;
            margin-right: 8px;
          }

          span {
            font-size: 14px;
            color: #222e61;
          }
        }

        .select-home-list__container {
          width: 100%;
          max-height: 250px;

          .edit__container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 30px;
            border-radius: 24px;
            border: 1px solid rgba(51, 73, 153, 0.2);
            cursor: pointer;

            span {
              font-size: 14px;
              color: #222e61;
            }
          }

          .home-list__container {
            width: 100%;
            max-height: 210px;
            margin-top: 6px;
            overflow-y: auto;
            overflow-x: hidden;

            .home-list {
              width: 100%;
              display: grid;
              grid-template-columns: repeat(2, 160px);
              justify-content: space-between;
              gap: 6px;
              .home-item {
                width: 160px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 20px;
                background: rgba(184, 184, 224, 0.2);
                padding: 0 8px;
                .home-name {
                  width: 160px;
                  height: 30px;
                  line-height: 30px;
                  font-size: 14px;
                  color: #222e61;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }

              .home-item:hover {
                .home-name {
                  width: 130px;
                }

                .icon-del {
                  display: block;
                }
              }
            }
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
        height: 40px;
        cursor: pointer;
        border-radius: 24px;
      }

      .btn-cancel {
        font-weight: 400;
        font-size: 14px;
        color: #222e61;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24px;
        background: #edeef3;
        border: 1px solid rgba(51, 73, 153, 0.2);
      }

      .btn-cancel:hover {
        background: #f3f4f7;
      }

      .btn-cancel:active {
        background: #edeef3;
      }

      .btn-save {
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24px;
        background: #325bf2;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
      }

      .btn-save:hover {
        background: #5779f4;
      }

      .btn-save:active {
        background: #0f3ff0;
      }
    }
  }
}
</style>
