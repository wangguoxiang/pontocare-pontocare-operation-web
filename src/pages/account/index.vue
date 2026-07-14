<template>
  <div class="account__wrapper">
    <div class="content__container">
      <div class="card-header"></div>
      <div class="card-body">
        <div class="card-content">
          <div class="left">
            <div class="avatar"></div>
            <div class="line"></div>
          </div>
          <div class="right">
            <div class="name">{{ $t('name') }}</div>
            <div class="user-name">
              <ps-tool-tip :content="userInfo.name"></ps-tool-tip>
            </div>
            <div class="email">{{ $t('email') }}</div>
            <div class="email-name">
              <ps-tool-tip :content="userInfo.email"></ps-tool-tip>
            </div>
            <div class="btn-change-pwd" @click="showChangePassword = true">{{ $t('changePassword') }}</div>
          </div>
        </div>

        <div class="card-content">
          <div class="split-line"></div>
        </div>

        <div class="card-content">
          <div class="btn-logout" @click="logout()">{{ $t('logOut') }}</div>
        </div>
      </div>
    </div>
    <ChangePassword v-if="showChangePassword" @closePopup="closeChangePassword"> </ChangePassword>
    <PsHandleResult v-if="showHandleResult"
                    :title="handleResultTitle"
                    :description="handleResultDescription"
                    :img="require('@/assets/icons/ic_successfully_big.svg')"
                    @onConfirm="closeHandleResult" />
  </div>
</template>

<script>
import ChangePassword from './changePassword.vue';
export default {
  components: {
    ChangePassword
  },
  data() {
    return {
      userInfo: {},
      showChangePassword: false,
      showHandleResult: false,
      handleResultTitle: '',
      handleResultDescription: ''
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.userInfo.email = localStorage.getItem('email');
      this.userInfo.name = localStorage.getItem('username');
    },
    logout() {
      this.$http
        .logout()
        .then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          localStorage.removeItem('userId');
          localStorage.removeItem('source');
          this.$router.push('/login');
        });
    },
    closeChangePassword(isRefresh) {
      this.showChangePassword = false;
      if (isRefresh) {
        this.handleResultTitle = this.$t('passwordChangedSuccessfully');
        this.handleResultDescription = this.$t('passwordChangedSuccessfullyTip');
        this.showHandleResult = true;
      }
    },
    closeHandleResult() {
      this.showHandleResult = false;
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.account__wrapper {
  width: 100%;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  .content__container {
    display: flex;
    flex-direction: column;
    width: 430px;

    .card-header {
      width: 100%;
      height: 160px;
      background: url("@/assets/imgs/account_card_header.png") no-repeat center;
      background-size: contain;
    }
    .card-body {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 30px 30px 20px 30px;
      background: #ffffff;
      border-radius: 0px 0px 12px 12px;

      .card-content {
        display: flex;
        .left {
          display: flex;
          flex-direction: column;

          .avatar {
            width: 80px;
            height: 80px;
            background: url("@/assets/icons/ic_avater.svg") no-repeat center;
            background-size: contain;
          }

          .line {
            width: 40px;
            height: 155px;
            border-right: 1px dashed #666f99;
            margin-top: 17px;
          }
        }

        .right {
          display: flex;
          flex-direction: column;
          margin-left: 30px;
          width: 250px;
          .name {
            font-weight: 400;
            font-size: 14px;
            color: #666f99;
            line-height: 18px;
            margin-top: 13px;
          }

          .user-name {
            font-weight: bold;
            font-size: 30px;
            color: #333333;
            line-height: 36px;
          }

          .org {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            line-height: 18px;
            margin-top: 30px;
          }

          .org-name {
            font-weight: 400;
            font-size: 14px;
            color: #666f99;
            line-height: 18px;
            margin-top: 2px;
          }

          .email {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            line-height: 18px;
            margin-top: 60px;
          }

          .email-name {
            font-weight: 400;
            font-size: 14px;
            color: #666f99;
            line-height: 18px;
            margin-top: 2px;
          }
          .btn-change-pwd:hover {
            background: #EDEEF3;
          }
          .btn-change-pwd {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 175px;
            height: 40px;
            background: rgba(31, 50, 122, 0.06);
            border-radius: 20px;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            line-height: 16px;
            text-align: center;
            margin-top: 20px;
            cursor: pointer;
          }
        }

        .split-line {
          width: 100%;
          height: 1px;
          background: rgba(0, 0, 0, 0.06);
          margin-top: 30px;
        }

        .btn-logout {
          width: 100%;
          margin-top: 20px;
          text-align: center;
          font-weight: 400;
          font-size: 16px;
          color: #325bf2;
          line-height: 19px;
          cursor: pointer;
        }
        .btn-logout:hover{
          color: #5779F4;
        }
      }
    }
  }
}
</style>
