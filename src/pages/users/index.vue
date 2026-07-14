<template>
  <div class="members__wrapper">
    <div class="tab__container">
      <div class="tab">
        <div
          class="tab-item"
          :class="{ 'current-item': currentTab === 'users' }"
          @click="handleTabChange('users')"
        >
          {{ $t('users') }}
        </div>
        <div
          class="tab-item"
          :class="{ 'current-item': currentTab === 'customer' }"
          @click="handleTabChange('customer')"
        >
          {{ $t('customer') }}
        </div>
      </div>
    </div>
    <div class="search__container">
      <div class="left">
        <el-input
          class="input-organization"
          :class="{'input-not-empty': organization !== ''}"
          @focus="organizationFocus = true"
          @blur="organizationFocus = false"
          :placeholder="organizationFocus ? '' : $t('organization')"
          v-model="organization"
        >
          <span
            v-if="organizationFocus || organization"
            slot="prefix"
            class="prefix-organization"
          >{{ $t("organization") }}</span
          >
          <span
            v-if="organization"
            slot="suffix"
            class="icon-clean"
            @click="organization = ''"
          ></span>
        </el-input>
        <el-input
          class="input-name"
          :class="{'input-not-empty': userName !== ''}"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          :placeholder="nameFocus ? '' : $t('user')"
          v-model="userName"
        >
          <span
            v-if="nameFocus || userName"
            slot="prefix"
            class="prefix-name"
          >{{ $t("user") }}</span
          >
          <span
            v-if="userName"
            slot="suffix"
            class="icon-clean"
            @click="userName = ''"
          ></span>
        </el-input>

        <el-input
          class="input-email"
          :class="{'input-not-empty': email !== ''}"
          @focus="emailFocus = true"
          @blur="emailFocus = false"
          :placeholder="emailFocus ? '' : $t('userEmail')"
          v-model="email"
        >
          <span v-if="emailFocus || email" slot="prefix" class="prefix-email">{{
            $t("userEmail")
          }}</span>
          <span
            v-if="email"
            slot="suffix"
            class="icon-clean"
            @click="email = ''"
          ></span>
        </el-input>

        <div class="register-status-selector" v-if="currentTab === 'users'">
          <el-select
            v-model="activeStatus"
            :placeholder="$t('registrationStatus')"
            :clearable="true"
            :class="{'input-not-empty': activeStatus !== ''}"
            popper-class="mark-selector"
          >
            <el-option
              v-for="item in registerStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
            <span
              slot="prefix"
              v-if="activeStatus !== ''"
              class="prefix-register-status"
            >{{ $t("registrationStatus") }}</span
            >
          </el-select>
        </div>
        <el-input
          class="input-id"
          :class="{'input-not-empty': userId !== ''}"
          @focus="idFocus = true"
          @blur="idFocus = false"
          :placeholder="idFocus ? '' : $t('userID')"
          v-model="userId"
        >
          <span v-if="idFocus || userId" slot="prefix" class="prefix-id">{{
            $t("userID")
          }}</span>
          <span
            v-if="userId"
            slot="suffix"
            class="icon-clean"
            @click="userId = ''"
          ></span>
        </el-input>
        <el-tooltip
          effect="light"
          :visible-arrow="false"
          :content="$t('search')"
          placement="bottom-end"
        >
          <div class="btn-search" @click="searchList"></div>
        </el-tooltip>
        <el-tooltip
          effect="light"
          :visible-arrow="false"
          :content="$t('clear')"
          placement="bottom-end"
        >
          <div class="btn-clear" @click="clearList"></div>
        </el-tooltip>
        <el-tooltip
          effect="light"
          :visible-arrow="false"
          :content="$t('refresh')"
          placement="bottom-end"
        >
          <div class="btn-refresh" @click="refreshList"></div>
        </el-tooltip>
      </div>
    </div>
    <div class="table__container">
      <el-table
        ref="table"
        :data="memberList"
        row-key="id"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column prop="tenantName" width="260">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'tenantName' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'tenantName')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'tenantName' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'tenantName')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'tenantName' }"
              >
                {{ $t("organization") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.tenantName" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="name" min-width="260">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'name' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'name')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'name' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'name')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'name' }"
              >
                {{ $t("user") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="user-content">
              <ps-tool-tip :content="scope.row.name"></ps-tool-tip>
              <div v-if="scope.row.readonly"
                   class="role-label">
                {{ $t("viewOnlyLabel") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" width="280">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("userEmail") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.email" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="status" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("registrationStatus") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div
              class="registration-status"
              :class="{
                registered: scope.row.state === 10,
                invited: scope.row.state === 0,
              }"
            >
              {{
                scope.row.state === 0
                  ? $t("invited")
                  : scope.row.state === 10
                    ? $t("registered")
                    : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="groups" min-width="150">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("associatedHomes") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div
              class="amountNumber"
              @click="openHomeList(scope.row.groups)"
              v-if="scope.row.groups && scope.row.groups.length > 0"
            >
              {{ scope.row.groups.length }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" min-width="133">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort == 'createTime' && order == 'asc',
                  }"
                  @click="changeSort('asc', 'createTime')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'createTime' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'createTime')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'createTime' }"
              >
                {{ $t("addedDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ formatTableTime(scope.row.createTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="id" min-width="123">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("userID") }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-bottom">
        <div class="table-bottom-left">
          <div class="export-btn" :class="{'text-btn-disable': pageTotal === 0}" @click="exportCSV">
            <i class="export-ico iconfont ps-inbox-download"></i>
            <div class="export-text">{{ $t('export0001') }}</div>
          </div>
        </div>
        <div class="page__container" v-if="pageTotal > 0">
          <div class="page-total">{{ pageTotal }} {{ $t("inTotal") }}</div>
          <el-pagination
            layout="prev, pager, next"
            :total="pageTotal"
            :current-page="pageNo"
            :page-size="pageSize"
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <NameListDialog
      v-if="showNameListDialog"
      :data="currentHomeList"
      :title="$t('associatedHomes') + ' (' + currentHomeList.length + ')'"
      type="home"
      @closePopup="showNameListDialog = false"
    />
    <PsConfirm
      v-if="showConfirm"
      :confirmInfo="confirmInfo"
      @close="showConfirm = false"
      @confirm="confirmExport"
    />
  </div>
</template>

<script>
import { formatTableTime } from '@/utils';
import { blobUtil } from '@/utils/util';
import { ExportRecordsLimit } from '@/utils/constant';
import NameListDialog from '@/components/NameListDialog';
import moment from 'moment';
export default {
  components: {
    NameListDialog
  },
  data() {
    return {
      currentTab: 'users',
      ExportRecordsLimit,
      organization: '',
      organizationFocus: false,
      userName: '',
      nameFocus: false,
      email: '',
      emailFocus: false,
      activeStatus: '',
      registerStateList: [
        {
          label: this.$t('registered'),
          value: 10
        },
        {
          label: this.$t('invited'),
          value: 0
        }
      ],
      userId: '',
      idFocus: false,
      memberList: [],
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,

      currentHomeList: [],
      showNameListDialog: false,
      showConfirm: false,
      confirmInfo: {},
      lastFilterSnapshot: null
    };
  },
  created() {
    if (this.$route.params.id) {
      this.userId = String(this.$route.params.id);
    }
    this.loadParamsFromQuery();
    this.getMemberList();
  },
  methods: {
    formatTableTime,
    blobUtil,
    changeSort(sort, name) {
      if (this.sort === name && this.order === sort) {
        this.order = '';
        this.sort = '';
      } else {
        this.sort = name;
        this.order = sort;
      }
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getMemberList();
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getMemberList();
    },
    updateQueryParams() {
      const query = {};
      if (this.currentTab !== 'users') {
        query.tab = this.currentTab;
      }
      if (this.organization && this.organization.trim()) {
        query.organization = this.organization.trim();
      }
      if (this.userName && this.userName.trim()) {
        query.userName = this.userName.trim();
      }
      if (this.email && this.email.trim()) {
        query.email = this.email.trim();
      }
      if (this.activeStatus !== '') {
        query.activeStatus = this.activeStatus;
      }
      if (this.userId && this.userId.trim()) {
        query.userId = this.userId.trim();
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    handleTabChange(tab) {
      this.currentTab = tab;
      this.clearList();
    },
    loadParamsFromQuery() {
      const query = this.$route.query;
      if (query.tab && query.tab !== '') {
        this.currentTab = query.tab || 'users';
      }
      if (query.organization) {
        this.organization = query.organization;
      }
      if (query.userName) {
        this.userName = query.userName;
      }
      if (query.email) {
        this.email = query.email;
      }
      if (query.activeStatus) {
        this.activeStatus = +query.activeStatus;
      }
      if (query.userId) {
        this.userId = query.userId;
      }
    },
    getMemberList() {
      this.$psPageLoading().show();
      this.updateQueryParams();
      const filter = {
        email: this.email.trim(),
        userId: this.userId.trim(),
        userName: this.userName.trim(),
        activeStatus: this.currentTab === 'users' ? this.activeStatus : '',
        tenantName: this.organization.trim()
      };
      const filterParams = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        order: this.order,
        sort: this.sort,
        ...filter
      };
      this.lastFilterSnapshot = JSON.parse(JSON.stringify(filter));
      if (this.currentTab === 'users') {
        this.$http
          .getMemberList(filterParams)
          .then((res) => {
            this.memberList = res.records;
            this.pageTotal = res.total;
          })
          .finally(() => {
            this.$psPageLoading().hide();
          });
      } else {
        this.$http
          .getCustomerList(filterParams)
          .then((res) => {
            this.memberList = res.records;
            this.pageTotal = res.total;
          })
          .finally(() => {
            this.$psPageLoading().hide();
          });
      }
    },
    searchList() {
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getMemberList();
    },
    clearList() {
      this.organization = '';
      this.userName = '';
      this.email = '';
      this.activeStatus = '';
      this.userId = '';
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getMemberList();
    },
    refreshList() {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getMemberList();
    },
    exportCSV() {
      if (this.pageTotal === 0) {
        return;
      }
      if (this.pageTotal > this.ExportRecordsLimit) {
        this.showConfirm = true;
        this.confirmInfo = {
          title: this.$t('export0002'),
          content: this.$t('export0003')
        };
        return;
      }
      this.confirmExport();
    },
    confirmExport() {
      this.$psPageLoading().show();
      const request = this.currentTab === 'users' ? this.$http.exportMemberList : this.$http.exportCustomerList;
      request({
        ...(this.lastFilterSnapshot || {}),
        order: this.order,
        sort: this.sort
      }).then((res) => {
        const tableName = this.currentTab === 'users' ? 'Users' : 'Customer';
        this.blobUtil(res, `${tableName}-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    openHomeList(homeList) {
      this.showNameListDialog = true;
      this.currentHomeList = homeList;
    }
  }
};
</script>

<style lang="scss" scoped>
.members__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;
  .tab__container{
    display: flex;
    align-items: center;
    height: 36px;
    .tab {
      display: inline-flex;
      align-items: center;
      border-radius: 15px;
      gap: 5px;
      height: 100%;

      .tab-item {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 14px;
        font-weight: 500;
        color: #222e61;
        border-radius: 15px;
        padding: 0 20px;
        cursor: pointer;
        background: #fff;
      }
      .tab-item:hover{
        background: rgba(187, 197, 232, 0.5);
      }
      .current-item {
        background: #325bf2;
        color: #fff;
      }
      .current-item:hover{
        background: #5779F4;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
      }
    }
  }
  .search__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 36px;
    margin-top: 10px;

    .left {
      display: flex;
      .input-organization {
        margin-left: 0 !important;
      }
      .input-organization,
      .input-name,
      .input-email,
      .input-id {
        max-width: 180px;
        height: 36px;
        margin-left: 6px;

        ::v-deep .el-input__inner {
          height: 36px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid transparent;
          font-weight: 500;
          font-size: 14px;
          color: #222e61;
          line-height: 16px;
        }
        ::v-deep .el-input__inner:hover {
          border: 1px solid #325bf2;
        }
        ::v-deep .el-input__inner:focus {
          border: 2px solid #325bf2;
          padding: 16px 25px 4px 10px;
        }
        ::v-deep .el-input__inner::placeholder {
          height: 100%;
          font-weight: 400;
          font-size: 14px;
          color: #7982a6;
          line-height: 16px;
          text-align: left;
        }

        ::v-deep .el-input__prefix {
          left: 10px;
          height: 50%;
          .prefix-organization,
          .prefix-name,
          .prefix-email,
          .prefix-id {
            font-weight: 400;
            font-size: 11px;
            color: #7982a6;
            line-height: 12px;
            text-align: left;
          }
        }

        ::v-deep .el-input__suffix {
          width: 18px;
          right: 7px;

          .el-input__suffix-inner {
            display: flex;
            align-items: flex-end;
            width: 100%;
            height: 100%;
            padding-bottom: 4px;

            .icon-clean {
              width: 16px;
              height: 16px;
              background: url("@/assets/icons/ic_clean.svg") no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
          }
        }
      }

      .register-status-selector {
        max-width: 180px;
        min-width: 100px;
        height: 36px;
        margin-left: 6px;

        ::v-deep .el-select {
          width: 100%;
          height: 100%;
          .el-input {
            height: 100%;

            .el-input__inner {
              height: 100%;
              background: #ffffff;
              border-radius: 20px;
              border: 1px solid transparent;
              font-weight: 500;
              font-size: 14px;
              color: #222e61;
              line-height: 16px;
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
              height: 100%;
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
      .btn-search:hover,
      .btn-refresh:hover,
      .btn-clear:hover {
        background-color: rgba(187, 197, 232, 0.6);
      }
      .btn-search,
      .btn-refresh,
      .btn-clear {
        width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        margin-left: 6px;
        cursor: pointer;
      }

      .btn-search {
        background: url("@/assets/icons/ic_search.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }

      .btn-clear {
        background: url("@/assets/icons/ic_clear.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
      .btn-refresh {
        background: url("@/assets/icons/ic_refresh.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
    }
  }

  .table__container {
    width: 100%;
    flex: 1;
    margin-top: 10px;
    background: #ffffff;
    box-shadow: 0px 0px 5px 0px rgba(85, 88, 181, 0.1);
    border-radius: 10px;
    overflow: hidden;

    ::v-deep .el-table {
      width: 100%;
      height: calc(100% - 48px);
      // 表头
      .el-table__header-wrapper {
        .el-table__header {
          thead {
            tr {
              height: 100%;

              th.el-table__cell {
                height: 100%;
                padding: 0;
                .cell {
                  height: 100%;
                  padding: 0;
                }
              }
              th.el-table__cell::after {
                content: "";
                border: 1px solid #f0f0f4;
                right: 2px;
                position: absolute;
                height: 15px;
                top: 7px;
              }
              th.gutter::after {
                border: 0 !important;
              }
            }
          }
        }
      }
      // 表体
      .el-table__body-wrapper {
        width: 100%;
        .el-table__body {
          width: 100%;
          tbody {
            width: 100%;
            tr {
              .el-table__cell {
                padding: 12px 16px;
                .cell {
                  padding: 0;
                  font-weight: 400;
                  font-size: 14px;
                  color: #666f99;
                  line-height: 20px;
                  div {
                    word-wrap: break-word;
                    word-break: normal;
                  }

                  .registration-status {
                    width: 100%;
                    height: 23px;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 13px;
                    line-height: 23px;
                    text-align: center;
                  }
                  .registered {
                    background: rgba(172, 255, 195, 0.5);
                    color: #009a07;
                  }
                  .user-content {
                    display: flex;
                    align-items: center;
                    .role-label {
                      border: 1px solid rgba(0, 0, 0, 0.1);
                      margin-left: 7px;
                      border-radius: 7px;
                      padding: 2px;
                    }
                  }

                  .invited {
                    background: rgba(153, 152, 152, 0.1);
                    color: #acb2c8;
                  }

                  .home-access-list {
                    display: flex;
                    flex-direction: column;
                    text-decoration: underline;

                    .home-access-item {
                      margin-top: 5px;
                      cursor: pointer;
                    }
                    .home-access-item:first-child {
                      margin-top: 0px;
                    }
                    .home-access-item:hover {
                      color: #325bf2;
                    }
                  }

                  //action 下拉菜单
                  .el-dropdown {
                    .icon-action {
                      width: 24px;
                      height: 24px;
                      border-radius: 5px;
                      background: url("@/assets/icons/ic_action.svg") no-repeat
                        center;
                      background-size: 18px 18px;
                      cursor: pointer;
                    }

                    .icon-action:hover {
                      background-color: rgba(102, 124, 204, 0.1);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .amountNumber:hover {
      color: #325BF2;
    }
    .amountNumber {
      text-decoration: underline;
      cursor: pointer;
    }
    .table-header-sort {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 16px;
      padding-right: 3px;
      .icon-sort {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 10px;
        height: 30px;
        margin-right: 10px;
        cursor: pointer;
      }
      .sort-des {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_normal_down.svg") no-repeat top;
        background-size: contain;
      }
      .sort-des-selected {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_selected_down.svg") no-repeat
          top;
        background-size: contain;
      }

      .sort-asc {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_normal_up.svg") no-repeat bottom;
        background-size: contain;
      }
      .sort-asc-selected {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_selected_up.svg") no-repeat
          bottom;
        background-size: contain;
      }

      .table-header-text {
        font-weight: 500;
        font-size: 13px;
        color: #222e61;
        text-align: left;
      }

      .current-sort-header {
        font-weight: 500;
        font-size: 13px;
        color: #325bf2;
      }
    }
    .table-bottom {
      height: 48px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      .table-bottom-left {
        display: flex;
        align-items: center;
        gap: 10px;

        .page-total {
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 20px;
        }
        .export-btn:hover {
          .export-ico {
            color: #0162CB;
          }
        }
        .export-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;

          .export-ico {
            font-size: 20px;
            color: #017BFE;
          }

          .export-text {
            color: #000;
            font-size: 12px;
            font-weight: 400;
          }
        }
      }
    }
    .page__container {
      display: flex;
      align-items: center;

      ::v-deep .el-pagination {
        display: flex;
        align-items: center;
        .el-pager {
          display: flex;
          align-items: center;
          .number {
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            padding: 3px;
            border-radius: 100%;
            margin-left: 5px;
          }

          .number.active {
            background: #325bf2;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
