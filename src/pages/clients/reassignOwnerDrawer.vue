<template>
  <el-drawer
    :title="$t('reassignOwner')"
    :visible.sync="showOutDrawer"
    :wrapperClosable="false"
    @close="close"
    @open="initData"
    :size="567">
    <div class="drawer-content">
      <div class="content">
        <div class="addHome-tip">
          <div class="icon-tip"></div>
          <div class="note-content">{{ $t("reassignOwnerNote") }}</div>
        </div>
        <div class="filter-group">
          <el-input
            v-model="filterParams"
            :placeholder="$t('name')"
            class="filter"
          >
            <div slot="prefix" class="icon-input-search"></div>
          </el-input>
          <div class="register-status-selector">
            <el-select
              v-model="role"
              :placeholder="$t('role')"
              :clearable="true"
              popper-class="mark-selector"
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item-list">
          <div v-for="user in filteredUserList"
               :key="user.id"
               @click="toggleSelectUser(user)"
               class="select-home-item"
               :class="{ 'item-selected': selectUser && selectUser.id === user.id}">
            <div class="home-info">
              <div class="home-icon"></div>
              <div class="home-info-content">
                <ps-tool-tip class="home-name" :content="user.name"></ps-tool-tip>
                <ps-tool-tip class="desc" :content="user.email"></ps-tool-tip>
                <div class="desc">{{ formatRole(user.userTypes) }}</div>
              </div>
            </div>
            <div class="right">
              <div class="switch">
                <div class="selected" v-if="selectUser && selectUser.id === user.id"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="btn-group">
          <CancelButton :text='$t("cancel")'
                        :width="120"
                        :height="40"
                        @click.native="close" />
          <ConfirmButton :text=' $t("save")'
                         :width="120"
                         :height="40"
                         :isDisabled="selectUser === null"
                         @click.native="showReassignOwnerConfirmDialog" />
        </div>
      </div>
    </div>
    <ReassignOwnerConfirm
      v-if="showReassignOwnerConfirm"
      @cancel="showReassignOwnerConfirm = false"
      @confirm="confirmReassignOwner" />
  </el-drawer>
</template>

<script>
import { UserType } from '@/utils/constant';
import ReassignOwnerConfirm from './reassignOwnerConfirm.vue';
export default {
  name: 'reassignOwnerDrawer',
  components: {
    ReassignOwnerConfirm
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    currentTenant: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      UserType,
      selectUser: null,
      allUserList: [],
      filterParams: '',
      role: '',
      roleList: [
        {
          label: this.$t('user'),
          value: UserType.endUser
        },
        {
          label: this.$t('admin'),
          value: UserType.subAdmin
        }
      ],
      showReassignOwnerConfirm: false
    };
  },
  computed: {
    filteredUserList() {
      let tempUserList = this.allUserList.filter(item => item.name.toLowerCase().includes(this.filterParams.trim().toLowerCase()));
      if (this.role !== '') {
        tempUserList = tempUserList.filter(item => {
          if (this.role === UserType.endUser) {
            return item.userTypes.length === 1 && item.userTypes[0] === UserType.endUser;
          }
          if (this.role === UserType.subAdmin) {
            return item.userTypes.length === 2 && item.userTypes.includes(UserType.subAdmin);
          }
        });
      }
      return tempUserList;
    },
    showOutDrawer: {
      get() {
        return this.showDrawer;
      },
      set(value) {
        this.$emit('update:showDrawer', value);
      }
    }
  },
  methods: {
    initData() {
      this.role = '';
      this.selectUser = null;
      this.filterParams = '';
      this.allUserList = [];
      this.$psPageLoading().show();
      this.$http.getMemberListByTenantId(this.currentTenant.id).then((res) => {
        this.allUserList = res.records || [];
        this.allUserList = this.allUserList.filter(item => item.state === 10 && this.isEmailUser(item.email) &&
          !(item.userTypes.length === 1 && item.userTypes[0] === this.UserType.developer));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    isEmailUser(email) {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(String(email).toLowerCase());
    },
    toggleSelectUser(user) {
      this.selectUser = user;
    },
    formatRole(userTypes) {
      if (userTypes && userTypes.length > 0) {
        if (userTypes.includes(this.UserType.tenantAdmin)) {
          return this.$t('superAdmin');
        }
        if (userTypes.length === 1 && userTypes[0] === this.UserType.endUser) {
          return this.$t('user');
        } else {
          return this.$t('admin');
        }
      } else {
        return '';
      }
    },
    showReassignOwnerConfirmDialog() {
      if (this.selectUser === null) {
        return;
      }
      this.showReassignOwnerConfirm = true;
    },
    confirmReassignOwner(isKeep) {
      this.$psPageLoading().show();
      const payload = {
        userId: this.selectUser.id,
        shouldKeepOriginalUser: isKeep
      };
      this.$http
        .reassignOwner(this.currentTenant.id, payload)
        .then(() => {
          this.showReassignOwnerConfirm = false;
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.$emit('refresh');
          this.showOutDrawer = false;
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    close() {
      this.showOutDrawer = false;
      this.allUserList = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .content {
    padding: 0 20px;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    .multiple-tip {
      margin: 16px 0;
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      background: #D4DEFF;
      border: 1px dashed #979797;
      color: #222E61;
      font-weight: 400;
      font-size: 15px;
    }
    .addHome-tip {
      display: flex;
      align-items: center;
      margin: 20px 0;
      width: 100%;
      padding: 8px;
      border-radius: 10px;
      background: #E6EBFF;
      color: #222E61;
      font-weight: 400;
      font-size: 14px;
      .icon-tip {
        width: 24px;
        height: 24px;
        background: url("@/assets/icons/error-warning-fill.svg") no-repeat center;
        background-size: contain;
      }
      .note-content {
        flex: 1;
        margin-left: 7px;
      }
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      .filter {
        flex: 1;
        ::v-deep .el-input__inner {
          height: 36px;
          border-radius: 20px;
          border: 1px solid transparent;
          background-color: #F7F7FA;
        }
        ::v-deep .el-input__inner:hover {
          border: 1px solid #325bf2;
        }
        ::v-deep .el-input__inner:focus {
          border: 2px solid #325bf2;
        }
        ::v-deep .el-input__prefix {
          display: flex;
          align-items: center;
          margin-left: 2px;
          .icon-input-search {
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_search.svg") no-repeat center;
            background-size: contain;
          }
        }
      }
      .register-status-selector {
        flex: 1;
        height: 36px;
        margin-left: 6px;

        ::v-deep .el-select {
          width: 100%;
          height: 100%;
          .el-input {
            height: 100%;

            .el-input__inner {
              height: 100%;
              background-color: #F7F7FA;
              border-radius: 20px;
              border: 1px solid transparent;
              font-weight: 500;
              font-size: 14px;
              color: #222e61;
              line-height: 16px;
            }
            .el-input__inner:hover {
              border: 2px solid #325bf2;
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
                }

                .el-select__caret.is-reverse {
                  transform: rotate(180deg);
                }

                .el-icon-circle-close {
                  display: block !important;
                  background: url("@/assets/icons/ic_clean.svg") no-repeat
                  center;
                }
                .el-icon-circle-close:before {
                  content: ""; /* 使用 Unicode 字符表示向下的实心三角箭头 */
                }
              }
            }
          }
        }
      }
    }
    .item-list {
      overflow-y: auto;
      flex: 1;
    }
    .item-selected {
      border: 1px solid #325BF2;
    }
    .select-home-item:hover {
      border: 1px solid #325BF2;
    }
    .select-home-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 74px;
      padding: 12px 16px;
      border-radius: 10px;
      background: #F8F8FC;
      margin-bottom: 7px;
      cursor: pointer;
      .home-info {
        display: flex;
        align-items: center;
        width: calc(100% - 60px);
        .home-icon {
          width: 42px;
          height: 42px;
          background: url("@/assets/icons/person.svg") no-repeat center;
          background-size: contain;
          margin-right: 6px;
        }
        .home-info-content {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-weight: normal;
          color: #7982A6;
          max-width: 360px;
          .home-name {
            font-size: 14px;
            font-weight: 600;
            color: #222E61;
          }
        }
      }
      .right {
        .selected {
          width: 24px;
          height: 24px;
          background: url("@/assets/icons/ic_mark.svg") no-repeat center;
          background-size: contain;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: 0;
    .btn-group {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid rgba(51, 73, 153, 0.2);
      gap: 10px;
      padding-right: 20px;
    }
  }
}
</style>
