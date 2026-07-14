<template>
  <div class="login__wrapper">
    <div class="login_language">
      <div class="language-selector">
        <el-select
          v-model="currentLanguage"
          popper-class="language-selector-popper"
          @change="changeLanguage"
          style="width: 116px"
        >
          <el-option
            style="margin-right: 20px"
            v-for="language in LanguageList"
            :key="language.value"
            :label="language.label"
            :value="language.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form">
      <div class="logo-box"></div>
      <div class="name">{{ $t("pcOperationsBackend") }}</div>
      <div class="form-item">
        <div class="label">{{ $t("email") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="email"
          @focus="handleEmailFocus"
          @blur="handleEmailBlur"
          :class="{ 'error-input': emailError }"
        >
          <div slot="prefix" class="icon-input-email"></div>
        </el-input>

        <div class="error-text" v-if="emailError">{{ emailErrorText }}</div>
      </div>
      <div class="form-item">
        <div class="label">{{ $t("password") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="password"
          :type="showPwd ? 'text' : 'password'"
          @focus="handlePwdFocus"
          @blur="handlePwdBlur"
          :class="{ 'error-input': passwordError }"
        >
          <div slot="prefix" class="icon-input-pwd"></div>
          <div
            slot="suffix"
            :class="{ 'icon-input-hide': !showPwd, 'icon-input-show': showPwd }"
            @click="showPwd = !showPwd"
          ></div>
        </el-input>
        <div class="error-text" v-if="passwordError">
          {{ passwordErrorText }}
        </div>
      </div>
      <div class="remember-checkbox">
        <el-checkbox id="rememberMeCheckbox" v-model="isChecked">
          <i
            v-if="isChecked"
            class="iconfont ps-ico-checkmarks"
            style="font-size: 18px;color: #325bf2"
          ></i>
          <i
            v-else
            class="iconfont ps-Monitor-ico-uncheck"
            style="font-size: 18px"
          ></i>
          <span style="margin-left: 10px">{{ $t("rememberMe") }}</span>
        </el-checkbox>
      </div>
      <LoadingButton
        v-if="btnLoading"
        width="100%"
        height="36px"
        margin="40px 40px 0 40px"
      />

      <div
        v-if="!btnLoading"
        class="btn-login"
        :class="{ 'btn-disable': (!emailEmpty || !passwordEmpty) && !autoFill }"
        @click="checkLogin"
      >
        {{ $t("login") }}
      </div>
      <div class="forgot-password" @click="goForgotPassword">
        {{ $t("forgotPassword") }}?
      </div>
    </div>
    <div class="footer">
      <div class="location-box">
        <span>{{ $t("serverLocation") }}</span>
        <div class="server-list">
          <div class="server-icon"></div>
          <el-dropdown trigger="click" placement="top" @command="changeServer">
            <span class="el-dropdown-link">
              {{ currentServer.name }}
              <div class="icon-arrow-down"></div>
            </span>
            <el-dropdown-menu slot="dropdown" class="login-server-list">
              <el-dropdown-item
                v-for="(item, index) in serverList"
                :key="index"
                :class="{ active: item.endpoint === currentServer.endpoint }"
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
</template>

<script>
import md5 from 'js-md5';
import LoadingButton from '@/components/LoadingButton/index.vue';
import { mapMutations } from 'vuex';
import { LanguageList } from '@/utils/constant';
import { getCurrentLanguage } from '@/utils';

export default {
  components: {
    LoadingButton
  },
  data() {
    return {
      LanguageList,
      isChecked: false,
      email: '',
      emailFocus: false,
      emailError: false,
      emailErrorText: '',

      password: '',
      passwordFocus: false,
      passwordError: false,
      passwordErrorText: '',
      showPwd: false,
      btnLoading: false,
      autoFill: false,
      currentLanguage: getCurrentLanguage()
    };
  },
  watch: {
    // firefox浏览器自动填充
    email(val) {
      if (!val) {
        this.autoFill = false;
      }
    },
    password(val) {
      if (!val) {
        this.autoFill = false;
      }
    }
  },
  mounted() {
    this.checkToken();
    setTimeout(() => {
      const autoFill = document.querySelector(':-webkit-autofill');
      if (autoFill) {
        this.autoFill = true;
      }
    }, 500);
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
    siteKey() {
      return process.env.VUE_APP_SITEKEY;
    },
    secret() {
      return process.env.VUE_APP_SECRET;
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
    passwordEmpty() {
      return this.password.length > 0;
    },
    passwordLength() {
      return this.password.length >= 8;
    },
    passwordMaxLength() {
      return this.password !== '' && this.password.length <= 32;
    },
    btnEnable() {
      return !this.emailError && !this.passwordError;
    },
    serverList() {
      return this.$store.state.system.serverList;
    },
    currentServer() {
      return this.$store.getters['system/getCurrentServer'];
    }
  },
  methods: {
    checkToken() {
      if (
        localStorage.getItem('token') &&
        localStorage.getItem('userId') &&
        localStorage.getItem('source') === 'pcoa'
      ) {
        // 创建一个超时的Promise，在5秒后 reject
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject();
          }, 5000); // 5 秒超时
        });

        // 通过 Promise.race 来竞赛超时和请求
        Promise.race([
          this.$http.getUserInfo(localStorage.getItem('userId')),
          timeoutPromise
        ])
          .then(() => {
            this.$router.replace('/clients');
          })
          .catch(() => {
            // 请求失败或超时，移除 token 和用户信息
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('userId');
          });
      }
    },
    goForgotPassword() {
      this.$router.push('/forgotPassword');
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem('language', lang);
      window.location.reload();
    },
    handleEmailFocus() {
      this.emailFocus = true;
      this.emailError = false;
    },
    handleEmailBlur() {
      this.emailFocus = false;
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
    handlePwdFocus() {
      this.passwordFocus = true;
      this.passwordError = false;
    },
    handlePwdBlur() {
      this.passwordFocus = false;
      this.checkPwd();
    },
    checkPwd() {
      if (!this.passwordEmpty) {
        this.passwordErrorText = this.$t('passwordNotEmpty');
        this.passwordError = true;
        return;
      }
      if (!this.passwordLength) {
        this.passwordErrorText = this.$t('passwordLength8');
        this.passwordError = true;
        return;
      }
      if (!this.passwordMaxLength) {
        this.passwordErrorText = this.$t('passwordLength32');
        this.passwordError = true;
        return;
      }
      this.passwordError = false;
      this.passwordErrorText = '';
    },
    checkLogin() {
      this.checkEmail();
      this.checkPwd();
      if (!this.btnEnable || this.btnLoading) return;
      this.btnLoading = true;
      grecaptcha.ready(() => {
        grecaptcha
          .execute(this.siteKey, { action: 'submit' })
          .then((token) => {
            this.response = token;
            const params = {
              response: this.response,
              secret: this.secret
            };
            this.$http
              .checkMachine(params)
              .then(() => {
                this.login();
              })
              .catch(() => {
                this.btnLoading = false;
              });
          })
          .catch(() => {
            this.btnLoading = false;
          });
      });
    },
    login() {
      const params = {
        email: this.email,
        password: md5(this.password),
        isRememberMe: this.isChecked,
        isAgree: true
      };
      this.$http
        .login(params)
        .then((res) => {
          const { token } = res;
          const { name } = res.userInfo;
          const { id } = res.userInfo;
          this.SET_USERNAME(name);
          this.SET_USERID(id);
          localStorage.setItem('token', token); // 长久存储
          localStorage.setItem('username', name);
          localStorage.setItem('email', res.userInfo?.email);
          localStorage.setItem('userId', id);
          localStorage.setItem('source', 'pcoa');
          this.$router.push('/clients');
        })
        .catch((error) => {
          this.btnLoading = false;
          if (error.message === '100113') {
            this.emailErrorText = this.$t('loginlimit0001');
            this.emailError = true;
          }
        });
    },
    changeServer(command) {
      if (command.endpoint !== this.currentServer.endpoint) {
        const currentPath = window.location.pathname + window.location.hash;
        if (command.endpoint.endsWith('/')) {
          command.endpoint = command.endpoint.slice(0, -1);
        }
        window.location = command.endpoint + currentPath;
      }
    },
    ...mapMutations('user', {
      SET_USERNAME: 'SET_USERNAME',
      SET_USERID: 'SET_USERID'
    })
  }
};
</script>

<style lang="scss" scoped>
.login__wrapper {
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: url("@/assets/imgs/bg_login.png") no-repeat center;
  background-size: cover;
  .login_language {
    position: absolute;
    top: 18px;
    right: 26px;
  }
  .form {
    display: flex;
    flex-direction: column;
    width: 340px;
    background: #ffffff;
    box-shadow: 0px 10px 10px 0px rgba(85, 88, 181, 0.1);
    border-radius: 10px;
    padding: 50px 20px 40px 20px;
    align-items: center;

    .logo-box {
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
      margin-top: 20px;
      margin-bottom: 20px;
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

          .icon-input-hide {
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_hide.svg") no-repeat center;
            background-size: contain;
            cursor: pointer;
          }
          .icon-input-show {
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_unhide.svg") no-repeat center;
            background-size: contain;
            cursor: pointer;
          }
        }

        .el-input__prefix {
          left: 10px;
        }
        .el-input__suffix {
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
    }

    .remember-checkbox {
      display: flex;
      align-items: center;
      margin-top: 20px;
      align-self: flex-start;

      ::v-deep .el-checkbox {
        .el-checkbox__label {
          width: 200px;
          font-weight: 400;
          font-size: 13px;
          color: #7982a6;
          padding-left: 0;
          display: flex;
        }
        .el-checkbox__input {
          display: none;
        }
      }
      > span {
        font-weight: 400;
        font-size: 13px;
        color: #7982a6;
        line-height: 15px;
        margin-left: 10px;
        cursor: pointer;
      }
    }

    .btn-login {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 36px;
      background: #325bf2;
      box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
      border-radius: 20px;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
      line-height: 20px;
      margin-top: 40px;
      cursor: pointer;
    }
    .btn-login:hover {
      background: #5779f4;
      box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
    }
    .btn-login:active {
      background: #0f3ff0;
      box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
    }

    .forgot-password {
      font-weight: 500;
      font-size: 14px;
      color: #325bf2;
      line-height: 16px;
      margin-top: 30px;
      cursor: pointer;
    }
    .forgot-password:hover {
      color: #5779f4;
    }
  }
  .footer {
    position: absolute;
    bottom: 20px;
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
              background: url("@/assets/icons/ic_server_dropdown.svg") no-repeat
                center;
              background-size: contain;
            }
          }
        }
      }
    }

    .help {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>
