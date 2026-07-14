<template>
  <div class="aside__wrapper">
    <div class="logo-box">
      <div class="logo"></div>
    </div>
    <div class="nav-list">
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'clients' }"
        @click="changeNav('/clients')"
      >
        <div class="icon icon-clients"></div>
        <div class="nav-text">{{ $t("clients") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'reseller' }"
        @click="changeNav('/reseller')"
      >
        <div class="icon icon-reseller"></div>
        <div class="nav-text">{{ $t("reseller0001") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'license' }"
        @click="changeNav('/license')"
      >
        <div class="icon icon-license"></div>
        <div class="nav-text">{{ $t("license0001") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'homes' }"
        @click="changeNav('/homes')"
      >
        <div class="icon icon-homes"></div>
        <div class="nav-text">{{ $t("homes") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'rooms' }"
        @click="changeNav('/rooms')"
      >
        <div class="icon icon-rooms"></div>
        <div class="nav-text">{{ $t("rooms") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'devices' }"
        @click="changeNav('/devices')"
      >
        <div class="icon icon-devices"></div>
        <div class="nav-text">{{ $t("devices") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'users' }"
        @click="changeNav('/users')"
      >
        <div class="icon icon-members"></div>
        <div class="nav-text">{{ $t("users") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'firmware' }"
        @click="changeNav('/firmware')"
      >
        <div class="icon icon-firmware"></div>
        <div class="nav-text">{{ $t("firmware") }}</div>
      </div>
      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'fallAlerts' }"
        @click="changeNav('/fallAlerts')"
      >
        <div class="icon icon-fallAlerts"></div>
        <div class="nav-text">{{ $t("fallAlerts") }}</div>
      </div>

      <div
        class="nav-item"
        :class="{ 'current-nav-item': currentNav === 'account' }"
        @click="changeNav('/account')"
      >
        <div class="icon icon-account"></div>
        <div class="nav-text">{{ $t("myAccount") }}</div>
      </div>
    </div>
    <div class="user-info">
      <div class="avater"></div>
      <div class="user-name">{{ username }}</div>
    </div>
    <div class="language-box">
      <div class="language-selector">
        <el-select
          v-model="currentLanguage"
          popper-class="language-selector-popper"
          @change="changeLanguage"
          style="width: 160px"
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
    <div class="footer">
    </div>
  </div>
</template>

<script>
import { LanguageList } from '@/utils/constant';
import { getCurrentLanguage } from '@/utils';
export default {
  data() {
    return {
      LanguageList,
      currentNav: '',
      currentLanguage: getCurrentLanguage()
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
    username() {
      return this.$store.state.user.username;
    },
    currentServer() {
      return this.$store.getters['system/getCurrentServer'];
    }
  },
  watch: {
    currentPath: {
      handler(newVal) {
        switch (newVal) {
          case '/clients':
            this.currentNav = 'clients';
            break;
          case '/reseller':
            this.currentNav = 'reseller';
            break;
          case '/license':
            this.currentNav = 'license';
            break;
          case '/firmware':
            this.currentNav = 'firmware';
            break;
          case '/homes':
            this.currentNav = 'homes';
            break;
          case '/rooms':
            this.currentNav = 'rooms';
            break;
          case '/devices':
            this.currentNav = 'devices';
            break;
          case '/users':
            this.currentNav = 'users';
            break;
          case '/fallAlerts':
            this.currentNav = 'fallAlerts';
            break;
          case '/migration':
            this.currentNav = 'migration';
            break;
          case '/account':
            this.currentNav = 'account';
            break;
        }
      },
      immediate: true
    }
  },
  methods: {
    changeNav(nav) {
      this.$router.push(nav);
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem('language', lang);
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.aside__wrapper {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  background: #ffffff;
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.06);
  border-radius: 0px 10px 10px 0px;
  overflow: hidden;

  .logo-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 76px;
    background: url("@/assets/imgs/img_logobg.png") no-repeat center;
    background-size: cover;
    .logo {
      width: 120px;
      height: 28px;
      background: url("@/assets/imgs/logo_pontosense_white.png") no-repeat
        center;
      background-size: contain;
    }
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    padding: 10px;
    background: #ffffff;

    .nav-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      background: #ffffff;
      border-radius: 6px;
      padding: 10px;
      margin-top: 2px;
      cursor: pointer;

      .icon {
        width: 18px;
        height: 18px;
      }

      .icon-clients {
        background: url("@/assets/icons/ic_clients.svg") no-repeat center;
        background-size: contain;
      }

      .icon-firmware {
        background: url("@/assets/icons/ic_firmware.svg") no-repeat center;
        background-size: contain;
      }
      .icon-fallAlerts {
        background: url("@/assets/icons/ic_fall_black.png") no-repeat center;
        background-size: contain;
      }
      .icon-members {
        background: url("@/assets/icons/ic_members.svg") no-repeat center;
        background-size: contain;
      }

      .icon-homes {
        background: url("@/assets/icons/ic_homes.svg") no-repeat center;
        background-size: contain;
      }

      .icon-rooms {
        background: url("@/assets/icons/ic_rooms.svg") no-repeat center;
        background-size: contain;
      }

      .icon-devices {
        background: url("@/assets/icons/ic_devices.svg") no-repeat center;
        background-size: contain;
      }

      .icon-dashboard {
        background: url("@/assets/icons/ic_dashboard.svg") no-repeat center;
        background-size: contain;
      }

      .icon-invoice {
        background: url("@/assets/icons/ic_invoice.svg") no-repeat center;
        background-size: contain;
      }

      .icon-price {
        background: url("@/assets/icons/ic_payment.svg") no-repeat center;
        background-size: contain;
      }

      .icon-account {
        background: url("@/assets/icons/ic_account.svg") no-repeat center;
        background-size: contain;
      }
      .icon-reseller{
        background: url("@/assets/icons/icon_reseller.svg") no-repeat center;
        background-size: contain;
      }
      .icon-license {
        background: url("@/assets/icons/icon_license.svg") no-repeat center;
        background-size: contain;
      }
      .icon-migration{
        background: url("@/assets/icons/icon_migration.svg") no-repeat center;
        background-size: contain;
      }

      .nav-text {
        font-weight: 500;
        font-size: 14px;
        color: #222e61;
        line-height: 16px;
        margin-left: 10px;
      }
    }
    .nav-item:first-child {
      margin-top: 0px;
    }

    .current-nav-item {
      background: #d6e7ff;

      .nav-text {
        font-weight: bold;
        font-size: 14px;
        color: #325bf2;
        line-height: 16px;
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 20px;

    .avater {
      width: 36px;
      height: 36px;
      background: url("@/assets/icons/ic_avater.svg") no-repeat center;
      background-size: contain;
    }

    .user-name {
      width: 100%;
      font-weight: 500;
      font-size: 14px;
      color: #222e61;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 20px 0 5px;
    }
  }

  .language-box {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    background: #f8f8fc;

  }
}
</style>
