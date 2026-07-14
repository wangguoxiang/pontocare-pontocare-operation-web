<template>
  <div class="forgot_password__wrapper">
    <div class="logo-box">
      <div class="logo-icon"></div>
      <div class="name">{{ $t("pcOperationsBackend") }}</div>
    </div>
    <div class="right">
      <div class="form" v-if="!showSuccessPage">
        <div class="go-back" @click="$router.push('/login')">
          &lt; {{ $t("backLogin") }}
        </div>
        <div class="title">{{ $t("forgotPassword") }}?</div>
        <div class="text">{{ $t("verifyEmail") }}</div>
        <div class="form-item">
          <div class="label">{{ $t("emailAddress") }}</div>
          <div class="email">
            <el-input
              :placeholder="$t('pleaseEnter')"
              v-model="email"
              @focus="handleEmailFocus"
              @blur="handleEmailBlur"
              :class="{ 'error-input': emailError }"
            >
              <div slot="prefix" class="icon-input-email"></div>
            </el-input>
            <div
              class="btn-send"
              :class="{ 'btn-disable': timeLeft > 0 }"
              @click="sendEmail"
            >
              <span v-if="timeLeft > 0">{{ timeLeft }}s</span>
              <span v-else>{{ $t("send") }}</span>
            </div>
          </div>
          <div class="error-text" v-if="emailError">{{ emailErrorText }}</div>
        </div>

        <div class="form-item">
          <div class="label">{{ $t("verificationCode") }}</div>
          <div class="tips">{{ $t("checkSpamFolder") }}</div>
          <div class="code-box">
            <el-input
              v-for="(item, index) in codeLength"
              :key="index"
              maxlength="1"
              v-model="verificationCode[index]"
              @input="handleInput(index)"
              @paste.native="handlePaste"
              :ref="`code_${index}`"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="label">{{ $t("newPassword") }}</div>
          <el-input
            :placeholder="$t('pleaseEnter')"
            v-model="newPassword"
            @focus="handleNewPasswordFocus"
            @blur="checkNewPassword"
            :class="{ 'error-input': newPasswordError }"
          >
            <div slot="prefix" class="icon-input-pwd"></div>
          </el-input>
          <div
            class="error-text"
            v-if="newPasswordError && newPasswordErrorText"
          >
            {{ newPasswordErrorText }}
          </div>
        </div>

        <div class="pwd-check">
          <div class="label" style="margin-bottom: 8px">
            {{ $t("passwordRequirements") }}
          </div>
          <div class="pwd-role-list">
            <div class="role-item">
              <div :class="isPassLower ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t("requirements0") }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassUpper ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t("requirements1") }}</div>
            </div>
            <div class="role-item">
              <div :class="isPassDigit ? 'icon-success' : 'icon-failed'"></div>
              <div class="role">{{ $t("requirements2") }}</div>
            </div>
            <div class="role-item">
              <div
                :class="isPassSpecial ? 'icon-success' : 'icon-failed'"
              ></div>
              <div class="role">{{ $t("requirements3") }}</div>
            </div>
            <div class="role-item">
              <div
                :class="isPassLength8 ? 'icon-success' : 'icon-failed'"
              ></div>
              <div class="role">{{ $t("length8") }}</div>
            </div>
            <div class="role-item">
              <div
                :class="isPassLength32 ? 'icon-success' : 'icon-failed'"
              ></div>
              <div class="role">{{ $t("length32") }}</div>
            </div>
          </div>
        </div>
        <div
          class="btn-reset"
          @click="resetPassword"
          :class="{ 'btn-disable': btnDisable }"
        >
          {{ $t("resetPassword") }}
        </div>
        <div class="footer">
          <div class="location-box">
            <span>{{ $t("serverLocation") }}</span>
            <div class="server-list">
              <div class="server-icon"></div>
              <el-dropdown
                trigger="click"
                placement="top"
                @command="changeServer"
              >
                <span class="el-dropdown-link">
                  {{ currentServer.name }}
                  <div class="icon-arrow-down"></div>
                </span>
                <el-dropdown-menu slot="dropdown" class="login-server-list">
                  <el-dropdown-item
                    v-for="(item, index) in serverList"
                    :key="index"
                    :class="{
                      active: item.endpoint === currentServer.endpoint,
                    }"
                    :command="item"
                  >
                    <span>{{ item.name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="help">
            <el-tooltip
              effect="light"
              :content="$t('selectServerLocation')"
              placement="right-end"
            >
              <div class="form-icon-help"></div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div v-else style="display: flex; align-items: center">
        <PsResultContent
          :img="require('@/assets/imgs/img_firmware_success.svg')"
          :title="title"
          :description="description"
          confirmText="Login"
          @onConfirm="gotoLogin()"
        ></PsResultContent>
      </div>
    </div>
  </div>
</template>

<script>
import { CaptchaType } from '@/utils/constant';
import { getEmailSendLeftTime, updateEmailSendTime } from '@/utils/util';
import md5 from 'js-md5';
export default {
  data() {
    return {
      email: '',
      emailError: false,
      emailErrorText: '',
      timeLeft: 0,
      timer: null,
      codeLength: 6,
      verificationCode: new Array(this.codeLength).fill(''),
      newPassword: '',
      newPasswordError: false,
      newPasswordErrorText: '',
      showSuccessPage: false,
      title: '',
      description: ''
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    },
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
    serverList() {
      return this.$store.state.system.serverList;
    },
    currentServer() {
      return this.$store.getters['system/getCurrentServer'];
    },
    btnDisable() {
      return (
        !this.emailEmpty ||
        this.newPassword.length === 0 ||
        this.verificationCode.some((code) => code === '') ||
        this.verificationCode.length < 6
      );
    }
  },
  mounted() {
    this.initTimer();
  },
  methods: {
    handleEmailFocus() {
      this.emailError = false;
    },
    handleEmailBlur() {
      this.email = this.email.trim(); // 去除邮箱前后空格
      this.checkEmail();
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
    sendEmail() {
      this.checkEmail();
      if (this.emailError || this.timeLeft > 0) {
        return;
      }
      this.startSendEmail();
    },
    startSendEmail() {
      const payload = {
        email: this.email,
        sendType: CaptchaType.forget
      };
      this.$psPageLoading().show();
      this.$http
        .sendEmail(payload)
        .then(() => {
          updateEmailSendTime(this.userId);
          this.initTimer();
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    initTimer() {
      clearInterval(this.timer);
      this.timeLeft = getEmailSendLeftTime(this.userId);
      if (this.timeLeft > 0) {
        this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
    handleInput(index) {
      const value = this.verificationCode[index];
      // 删除时自动聚焦到上一个输入框
      if (value === '' && index > 0) {
        this.$refs[`code_${index - 1}`][0].focus();
      } else if (value && /\d/.test(value)) {
        const nextInput = index + 1;
        if (nextInput < this.codeLength) {
          this.$nextTick(() => {
            this.$refs[`code_${nextInput}`][0].focus();
          });
        }
      } else {
        this.verificationCode[index] = '';
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text').trim();
      if (!/^\d{6}$/.test(pasteData)) return;
      pasteData.split('').forEach((char, i) => {
        if (i < this.codeLength) {
          this.$set(this.verificationCode, i, char);
        }
      });
      this.$forceUpdate();
      // 自动聚焦到最后一个输入框
      this.$refs[`code_5`][0].focus();
    },
    handleNewPasswordFocus() {
      this.newPasswordError = false;
      this.newPasswordErrorText = '';
    },
    checkNewPassword() {
      if (this.newPassword.length === 0) {
        this.newPasswordErrorText = this.$t('newPasswordTip');
        this.newPasswordError = true;
      }
      if (
        this.isPassLower &&
        this.isPassUpper &&
        this.isPassDigit &&
        this.isPassSpecial &&
        this.isPassLength8 &&
        this.isPassLength32
      ) {
        this.newPasswordError = false;
      } else {
        this.newPasswordError = true;
      }
    },
    resetPassword() {
      this.checkEmail();
      this.checkNewPassword();
      if (
        this.emailError ||
        this.newPasswordError ||
        this.verificationCode.some((code) => code === '') ||
        this.verificationCode.length < 6
      ) {
        return;
      }
      this.$psPageLoading().show();
      this.$http
        .resetPassword({
          email: this.email,
          code: this.verificationCode.join(''),
          password: md5(this.newPassword)
        })
        .then(() => {
          this.showSuccessPage = true;
          this.title = this.$t('passwordBeenReset');
          this.description = this.$t('pleaseLog');
        }).catch((error) => {
          if (error.message === '100113') {
            this.$psNotifyMessage().fail(
              this.$t('failed'),
              this.$psTranslateErrorCode(this.$i18n.locale, error.message)
            );
          }
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    gotoLogin() {
      this.$router.push('/login');
    },
    changeServer(command) {
      if (command.endpoint !== this.currentServer.endpoint) {
        const currentPath = window.location.pathname + window.location.hash;
        if (command.endpoint.endsWith('/')) {
          command.endpoint = command.endpoint.slice(0, -1);
        }
        window.location = command.endpoint + currentPath;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.forgot_password__wrapper {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100vh;
  align-items: center;
  background: url("@/assets/imgs/bg_login.png") no-repeat center;
  background-size: cover;

  .logo-box {
    position: absolute;
    top: 30px;
    left: 40px;
    display: flex;
    flex-direction: column;

    .logo-icon {
      width: 200px;
      height: 46px;
      background: url("../../assets/imgs/logo_pontosense.png") no-repeat center;
      background-size: contain;
    }
    .name {
      font-weight: 500;
      font-size: 16px;
      color: #7982a6;
      line-height: 19px;
      margin-top: 10px;
    }
  }

  .right {
    display: flex;
    justify-content: center;
    width: 66%;
    height: 100%;
    background-color: #F3F4F7;
    position: relative;

    .form {
      display: flex;
      flex-direction: column;
      padding-top: 48px;
      width: 440px;

      .go-back {
        font-weight: 600;
        font-size: 16px;
        color: #325bf2;
        line-height: 19px;
        cursor: pointer;
      }
      .go-back:hover {
        color: #5779f4;
      }

      .title {
        font-weight: 800;
        font-size: 24px;
        color: #666f99;
        line-height: 29px;
        margin-top: 20px;
      }

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
        margin-top: 20px;
        .label {
          font-weight: 600;
          font-size: 14px;
          color: #333333;
          line-height: 16px;
        }
        .error-text {
          font-weight: 400;
          font-size: 12px;
          color: #ff2c50;
          line-height: 14px;
          margin-top: 4px;
        }
        .tips {
          font-weight: 400;
          font-size: 13px;
          color: #666f99;
          line-height: 15px;
          margin-top: 4px;
        }

        .email {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
          .btn-send:hover {
            background: rgba(50, 91, 242, 0.05);
          }
          .btn-send {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 36px;
            border-radius: 20px;
            border: 1px solid #325bf2;
            color: #325bf2;
            cursor: pointer;
          }
        }

        ::v-deep .el-input {
          width: 370px;
          height: 36px;
          .el-input__inner {
            width: 100%;
            height: 100%;
            border: 1px solid transparent;
            border-radius: 20px;
          }
          .el-input__inner:hover {
            border: 1px solid #325bf2;
          }
          .el-input__inner:focus {
            border: 2px solid #325bf2;
          }
          .el-input__prefix,
          .el-input__suffix {
            width: 18px;
            height: 18px;
            top: 50%;
            transform: translateY(-50%);
            .icon-input-email {
              width: 18px;
              height: 18px;
              background: url("@/assets/icons/ic_email.svg") no-repeat center;
              background-size: contain;
            }
            .icon-input-pwd {
              width: 18px;
              height: 18px;
              background: url("@/assets/icons/ic_password.svg") no-repeat center;
              background-size: contain;
            }
          }

          .el-input__prefix {
            left: 10px;
          }
          .el-input__suffix {
            right: 10px;
          }
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
              border: 1px solid #325bf2;
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
          font-weight: 600;
          font-size: 13px;
          color: #333333;
          line-height: 15px;
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
              background: url("@/assets/icons/ic_successfully.svg") no-repeat
                center;
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
      .btn-reset {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        background: #325bf2;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        border-radius: 20px;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        line-height: 16px;
        margin-top: 30px;
        cursor: pointer;
      }
      .btn-reset:hover {
        background: #5779f4;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
      }
      .btn-reset:active {
        background: #0f3ff0;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
      }
      .btn-reset-disable {
        opacity: 0.25;
        cursor: not-allowed;
      }
      .footer {
        position: absolute;
        bottom: 48px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;

        .location-box {
          display: flex;
          align-items: center;
          span {
            font-weight: 400;
            font-size: 13px;
            color: #7982a6;
            line-height: 18px;
          }

          .server-list {
            display: flex;
            align-items: center;
            margin-left: 20px;

            .server-icon {
              width: 24px;
              height: 24px;
              background: url("@/assets/icons/ic_region.svg") no-repeat center;
              background-size: contain;
            }

            .el-dropdown {
              .el-dropdown-link {
                display: flex;
                align-items: center;
                font-weight: 500;
                font-size: 14px;
                color: #222e61;
                line-height: 16px;
                cursor: pointer;
                .icon-arrow-down {
                  width: 18px;
                  height: 18px;
                  background: url("@/assets/icons/ic_server_dropdown.svg")
                    no-repeat center;
                  background-size: contain;
                }
              }
            }
          }
        }

        .help {
          margin-left: 25px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
