<template>
  <div class="licenses__wrapper">
    <div class="search__container">
      <div class="left">
        <el-popover
          v-model="showFilterOrg"
          :visible-arrow="false"
          placement="bottom-start"
          popper-class="organization-select-popover"
          @show="openOrganizationList"
          trigger="click">
          <div class="select__wrapper">
            <div class="select-content">
              <el-input
                v-model="filterContent"
                :placeholder="$t('search')"
                class="filter-input"
              >
                <div slot="prefix" class="icon-input-search"></div>
              </el-input>
              <div class="select-item__container">
                <div
                  class="item-content"
                  v-for="(item, index) in showOrganizationList"
                  :key="index"
                  @click="changeFilter(item)"
                >
                  <div class="left">
                    <div
                      class="name"
                      :class="{ selected: item.id === organizationId }"
                    >
                      {{ item.name }}
                    </div>
                    <div class="id">{{$t('id')}}: {{ item.id }}</div>
                  </div>
                  <div
                    class="current"
                    v-if="item.id === organizationId"
                  ></div>
                </div>
                <div class="noResult" v-if="showOrganizationList.length ===0">
                  {{$t('noResults')}}
                </div>
              </div>
            </div>
          </div>
          <div slot="reference" class="filter-selector">
            <div class="filter-selector-content">
              <div class="select">
                <div class="select-span" v-if="organizationId !== ''">
                  <div class="prefix">{{$t('organization')}}</div>
                  <div class="name">{{organizationList.find(item => item.id === organizationId)?.name}}</div>
                </div>
                <div class="placeholder" v-if="organizationId === ''">{{$t('organization')}}</div>
                <div class="icon-calendar"></div>
              </div>
            </div>
          </div>
        </el-popover>
        <el-popover
          v-model="showFilterMonth"
          :visible-arrow="false"
          placement="bottom-start"
          popper-class="month-select-popover"
          trigger="click">
          <datepicker
            class="month-date-picker"
            v-model="month"
            :disabled-dates="disabledDates"
            maximum-view="month"
            minimum-view="month"
            @selected="selectMonth"
            :language="dateLanguage"
          >
          </datepicker>
          <div slot="reference" class="filter-selector">
            <div class="filter-selector-content">
              <div class="select">
                <div class="select-span" v-if="month !== ''">
                  <div class="prefix">{{$t('license0002')}}</div>
                  <div class="name">{{formatYMTime(month)}}</div>
                </div>
                <div class="placeholder" v-if="month === ''">{{$t('license0002')}}</div>
                <div class="icon-calendar"></div>
              </div>
            </div>
          </div>
        </el-popover>
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
      <div class="right">
        <div class="btn-normal" :class="{'btn-disable': exportBtnDisable}" @click="exportInvoice">{{ $t('license0011') }}</div>
      </div>
    </div>
    <div class="table__container">
      <el-table
        v-if="isSearchFlag"
        ref="table"
        :data="dataList"
        row-key="id"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column prop="tenantId" width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("tenantID") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tenantName" width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("organizationName") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.tenantName" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="distributorName" width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("distributor") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.distributorName?scope.row.distributorName:'-'" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="licenseId" width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("license0005") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sn" min-width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("serialNumber") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveTime" min-width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("effectiveDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.effectiveTime ? formatTableTime(scope.row.effectiveTime) : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="expirationTime" min-width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("expirationDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.expirationTime ? formatTableTime(scope.row.expirationTime) : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'status' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'status')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'status' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'status')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'status' }"
              >
                {{ $t("license0010") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{parseStatus(scope.row.status)}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-bottom" v-if="isSearchFlag">
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
      <div class="search-tip" v-else>
        <img src="@/assets/imgs/img_search-tip.png" alt="" style="height: 100px" />
        <div class="tip-content" style="margin-top: 20px">{{ $t("license0009") }}</div>
      </div>
    </div>
    <PsConfirm
      v-if="showConfirm"
      :confirmInfo="confirmInfo"
      @close="showConfirm = false"
      @confirm="confirmExport"
    />
  </div>
</template>

<script>
import {
  formatYMTime,
  formatTableTime,
  getCurrentLanguage
} from '@/utils';
import { blobUtil } from '@/utils/util';
import { ExportRecordsLimit } from '@/utils/constant';
import Datepicker from 'vuejs-datepicker';
import { zh, en, fi, ja } from 'vuejs-datepicker/dist/locale';
import moment from 'moment';
export default {
  components: {
    Datepicker
  },
  data() {
    return {
      lang: getCurrentLanguage(),
      zh,
      en,
      fi,
      ja,
      ExportRecordsLimit,
      organizationId: '',
      showFilterOrg: false,
      filterContent: '',
      organizationList: [],
      month: '',
      showFilterMonth: false,
      disabledDates: { from: moment().add(0, 'day').toDate() },
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      dataList: [],
      isSearchFlag: false,
      showConfirm: false,
      confirmInfo: {},
      lastFilterSnapshot: null
    };
  },
  computed: {
    showOrganizationList() {
      return this.organizationList.filter((item) => {
        return String(item.id).includes(this.filterContent.trim().toLowerCase()) ||
          item.name.toLowerCase().includes(this.filterContent.trim().toLowerCase());
      });
    },
    currentOrganization() {
      return this.organizationList.find(item => item.id === this.organizationId);
    },
    exportBtnDisable() {
      return !this.organizationId || !this.month || (this.currentOrganization && this.currentOrganization.distributorId && this.currentOrganization.distributorId !== this.currentOrganization.id);
    },
    dateLanguage() {
      if (this.lang === 'fi') {
        return this.fi;
      } else if (this.lang === 'ja') {
        return this.ja;
      } else if (this.lang === 'zh') {
        return this.zh;
      } else {
        return this.en;
      }
    }
  },
  mounted() {
    this.en._months = this.en._monthsAbbr; // 只显示月份的简写
    this.initData();
    this.loadParamsFromQuery();
    this.getTableList();
  },
  methods: {
    formatYMTime,
    formatTableTime,
    blobUtil,
    initData() {
      this.$psPageLoading().show();
      this.$http.getAllRegisteredClientList()
        .then((res) => {
          this.organizationList = res.records || [];
        }).finally(() => {
          this.$psPageLoading().hide();
        });
    },
    changeFilter(item) {
      this.showFilterOrg = false;
      this.organizationId = item.id;
    },
    selectMonth(date) {
      this.showFilterMonth = false;
      this.month = date;
    },
    changeSort(sort, name) {
      if (this.sort === name && this.order === sort) {
        this.order = '';
        this.sort = '';
      } else {
        this.sort = name;
        this.order = sort;
      }
      this.getTableList();
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.getTableList();
    },
    loadParamsFromQuery() {
      const query = this.$route.query || {};
      if (query.organizationId) {
        this.organizationId = Number(query.organizationId);
      }
      if (query.month && query.month !== '') {
        this.month = Number(query.month);
      }
    },
    updateQueryParams() {
      const query = {};
      if (this.organizationId) {
        query.organizationId = this.organizationId;
      }
      if (this.month) {
        query.month = moment(this.month).valueOf();
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    openOrganizationList() {
      this.$nextTick(() => {
        const targetElement = document.querySelector('.current');
        if (targetElement) {
          targetElement.scrollIntoView({
            top: 200,
            behavior: 'auto',
            block: 'center'
          });
        }
      });
    },
    parseStatus(status) {
      if (status === 1) {
        return this.$t('license0008');
      }
      if (status === 0) {
        return this.$t('license0007');
      }
    },
    searchList() {
      this.pageNo = 1;
      this.getTableList();
    },
    clearList() {
      this.organizationId = '';
      this.month = '';
      this.filterContent = '';
      this.pageNo = 1;
      this.isSearchFlag = false;
      this.dataList = [];
    },
    refreshList() {
      this.getTableList();
    },
    getTableList() {
      if (!this.organizationId || !this.month) return;
      this.dataList = [];
      this.$psPageLoading().show();
      this.isSearchFlag = true;
      // 更新 URL query 参数
      this.updateQueryParams();
      const filter = {
        tenantId: this.organizationId,
        targetMonth: moment(this.month).format('YYYY-MM')
      };
      const filterParams = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sort: this.sort,
        order: this.order,
        ...filter
      };
      this.lastFilterSnapshot = JSON.parse(JSON.stringify(filter));
      this.$http
        .getLicenseList(filterParams)
        .then((res) => {
          this.dataList = res.records || [];
          this.pageTotal = res.total;
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
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
      this.$http.exportLicenseList({
        ...(this.lastFilterSnapshot || {}),
        order: this.order,
        sort: this.sort
      }).then((res) => {
        this.blobUtil(res, `License-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    exportInvoice() {
      if (!this.organizationId || !this.month) return;
      this.$psPageLoading().show();
      const payload = {
        tenantId: this.organizationId,
        billingCycle: moment(this.month).format('YYYY-MM')
      };
      this.$http.exportInvoice(payload).then((res) => {
        const organizationName = this.organizationList.find(item => item.id === this.organizationId)?.name;
        this.blobUtil(res, `Invoice-${organizationName}-${moment(this.month).format('YYYY-MM')}.xlsx`);
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.licenses__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;
  .search__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 36px;

    .left {
      display: flex;
      gap: 6px;
      .filter-selector {
        width: 160px;
        height: 36px;
        .filter-selector-content {
          width: 160px;
          height: 36px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          margin: 0;
          cursor: pointer;
          .select:hover {
            border: 1px solid #325bf2;
          }
          .select {
            width: 100%;
            border: 1px solid transparent;
            border-radius: 20px;
            height: 100%;
            padding: 3px 0 0 10px;
            display: flex;
            align-items: center;
            font-size: 15px;
            color: #222e61;
            justify-content: space-between;
            .icon-calendar {
              width: 24px;
              height: 24px;
              background: url("@/assets/icons/ic_inputbox_dropdown.svg") no-repeat
              center;
              background-size: contain;
            }

            .select-span {
              display: flex;
              flex-direction: column;
              height: 100%;
              .prefix {
                font-size: 11px;
                font-weight: normal;
                line-height: 12px;
                color: #7982A6;
              }
              .name {
                width: 103px;
                overflow: hidden;
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .placeholder {
            font-size: 14px;
            font-weight: normal;
            color: #7982A6;
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
        min-width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
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
    .right {
      display: flex;
      margin-left: 6px;
      .btn-normal:hover {
        background: #EDEEF3;
      }
      .btn-normal {
        width: 150px;
        height: 36px;
        border-radius: 20px;
        font-weight: 500;
        font-size: 14px;
        color: #222E61;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
        background: #FFFFFF;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
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
      .el-table__fixed-right {
        z-index: 1;
        background-color: #FFFFFF;
        .el-table__fixed-header-wrapper {
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
              }
            }
          }
        }
        .el-table__fixed-body-wrapper {
          .el-table__body {
            tbody {
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

                    //action 下拉菜单
                    .el-dropdown {
                      .icon-action {
                        width: 24px;
                        height: 24px;
                        border-radius: 5px;
                        background: url("@/assets/icons/ic_action.svg")
                        no-repeat center;
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
    .search-tip {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .tip-content {
        margin-top: 20px;
        color: #838B93;
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
}
</style>
<style lang="scss">
.month-select-popover.el-popper {
  margin-top: 5px;
  border: unset;
  padding: 0;
  .month-date-picker {
    width: 315px;
    box-shadow: 0 6px 12px 0 rgba(46, 48, 107, 0.2);
    input {
      display: none;
    }

    .vdp-datepicker__calendar {
      position: relative;
      width: auto;
      background: #ffffff;
      padding: 14px 14px 0 14px;
      border: none;
      border-radius: 10px;
      display: grid !important;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      header {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        width: 100%;
        height: 22px;
        padding: 0 5px;
        .header__title {
          flex: 1;
          height: 100%;
          font-weight: 510;
          font-size: 17px;
          color: #000000;
          line-height: 22px;
        }

        .month__year_btn {
          flex: 1;
          order: 2;
          font-size: 17px;
          font-weight: 510;
        }
        .prev:hover {
          opacity: 0.7;
        }
        .prev {
          width: 30px;
          height: 30px;
          background: url("@/assets/icons/ic-arrow-down.png") no-repeat center;
          background-size: 50%;
          border-radius: 20px;
          background-color: rgba(0, 0, 0, 0.04);
          transform: rotate(90deg);
          order: 1;
        }

        .prev::after {
          display: none;
        }
        .next:hover {
          opacity: 0.7;
        }
        .next {
          width: 30px;
          height: 30px;
          background: url("@/assets/icons/ic-arrow-down.png") no-repeat center;
          background-size: 50%;
          border-radius: 20px;
          background-color: rgba(0, 0, 0, 0.04);
          transform: rotate(-90deg);
          order: 3;
          text-indent: unset !important;
          color: transparent;
        }

        .next::after {
          display: none;
        }
        .disabled {
          background: url("@/assets/icons/ic-arrow-down.png") no-repeat
          center;
          background-size: 50%;
        }
      }
      .cell {
        border-radius: 0;
        border: none !important;
      }

      .day-header {
        font-weight: 510;
        font-size: 13px;
        color: rgba(60, 60, 67, 0.3);
      }

      .month {
        width: 100%;
      }

      .selected {
        background: var(--theme_primaryColor, #017BFE);
        border-radius: 22px;
        font-weight: 400;
        color: #ffffff;
        border: none;
        outline: none;
      }

      .prev.disabled {
        background: url("@/assets/icons/ic-arrow-down.png") no-repeat
        center;
        background-size: 50%;
        transform: rotate(90deg);
      }
      .next.disabled {
        background: url("@/assets/icons/ic-arrow-down.png") no-repeat
        center;
        background-size: 50%;
        transform: rotate(-90deg);
      }

      .today {
        color: var(--theme_primaryColor, #017BFE);
        font-weight: 510;
      }

      .disabled {
        color: rgba(34, 46, 97, 0.3);
        cursor: not-allowed;
      }
    }
  }
}
.organization-select-popover.el-popper {
  margin-top: 5px;
  border: unset;
  padding: 0;
  .select__wrapper {
    width: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    z-index: 100;
    border-radius: 10px;
    box-shadow: 0 6px 12px 0 rgba(46, 48, 107, 0.2);
    background: #ffffff;
    .select-content {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .filter-input {
        margin-bottom: 6px;
        .el-input__inner {
          height: 36px;
          border-radius: 20px;
          border: 1px solid transparent;
          background-color: #F7F7FA;
        }
        .el-input__inner:hover {
          border: 1px solid #325bf2;
        }
        .el-input__inner:focus {
          border: 2px solid #325bf2;
        }
        .el-input__prefix {
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
      .select-item__container {
        width: 100%;
        height: 400px;
        overflow-y: auto;
        .noResult {
          text-align: center;
          padding-top: 60%;
          font-size: 14px;
          font-weight: normal;
          color: #222E61;
        }
        .item-content:hover {
          border-radius: 5px;
          background: #f4f6fa;
        }
        .item-content {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 12px 8px;
          cursor: pointer;
          .left {
            .selected {
              color: #325bf2 !important;
            }
            .name {
              font-size: 14px;
              font-weight: 600;
              color: #222e61;
              width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .id {
              font-size: 12px;
              color: #7982a6;
            }
          }

          .current {
            width: 16px;
            height: 16px;
            background: url("@/assets/icons/ic_mark.svg") no-repeat center;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>
