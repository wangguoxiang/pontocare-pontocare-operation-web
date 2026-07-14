<template>
  <div class="firmware__wrapper">
    <div class="tabs_container">
      <el-radio-group
        v-model="model"
        style="margin-right: 10px"
        @change="changeModelType"
      >
        <el-radio-button
          v-for="item in modelList"
          :key="item.key"
          :label="item.key"
        >
          {{ item.value }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="search__container">
      <div class="left">
        <el-input
          class="input-sn"
          :class="{'input-not-empty': version !== ''}"
          @focus="versionFocus = true"
          @blur="versionFocus = false"
          :placeholder="versionFocus ? '' : $t('version')"
          v-model="version"
        >
          <span
            v-if="versionFocus || version"
            slot="prefix"
            class="prefix-name"
          >{{ $t("version") }}</span
          >
          <span
            v-if="version"
            slot="suffix"
            class="icon-clean"
            @click="version = ''"
          ></span>
        </el-input>
        <el-input
          class="input-sn"
          :class="{'input-not-empty': changeLog !== ''}"
          @focus="changeLogFocus = true"
          @blur="changeLogFocus = false"
          :placeholder="changeLogFocus ? '' : $t('firmware0008')"
          v-model="changeLog"
        >
          <span
            v-if="changeLogFocus || changeLog"
            slot="prefix"
            class="prefix-name">
            {{ $t("firmware0008") }}</span>
          <span
            v-if="changeLog"
            slot="suffix"
            class="icon-clean"
            @click="changeLog = ''"
          ></span>
        </el-input>
        <div class="status-selector">
          <el-select
            v-model="status"
            :placeholder="$t('status')"
            :clearable="true"
            :class="{'input-not-empty': status !== ''}"
            popper-class="mark-selector"
          >
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
            <span
              slot="prefix"
              v-if="status !== ''"
              class="prefix-register-status"
            >{{ $t("status") }}</span
            >
          </el-select>
        </div>

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
        <div class="btn-deploy" @click="showUploadPopup = true">{{ $t("firmware0001") }}</div>
        <div class="btn-deploy" @click="deploy">{{ $t("deploy") }}</div>
      </div>
    </div>
    <div class="table__container">
      <el-table
        ref="table"
        :data="firmwareList"
        row-key="id"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column prop="version" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("version") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            {{ scope.row.version }}
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" min-width="163">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'uploadTime' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'uploadTime')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'uploadTime' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'uploadTime')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'uploadTime' }"
              >
                {{ $t("availableDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ formatTableTime(scope.row.uploadTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("status") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            {{
              statusList.find((item) => item.key === scope.row.status)?.value
            }}
          </template>
        </el-table-column>
        <el-table-column prop="changeLog" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("firmware0008") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="changelog">{{ scope.row.changeLog }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="deployTime" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("deployDate") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>
              {{
                scope.row.status === FirmwareDeployStatus.Unreleased
                  ? "-"
                  : formatTableTime(scope.row.deployTime)
              }}
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
    <UploadFirmware
      v-if="showUploadPopup"
      :model="model"
      @uploadSuccess="uploadSuccess"
      @uploadCancel="uploadCancel"
    />
    <PsHandleResult
      v-if="showHandleResult"
      :title="handleResultTitle"
      :description="handleResultDescription"
      :confirmText="$t('confirm')"
      :img="require('@/assets/icons/img_release.svg')"
      :isShowCancel="true"
      @onCancel="closeHandleResult"
      @onConfirm="confirmHandleResult"
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
import { ExportRecordsLimit, FirmwareDeployStatus } from '@/utils/constant';
import moment from 'moment';
import UploadFirmware from './UploadFirmware.vue';
export default {
  components: {
    UploadFirmware
  },
  data() {
    return {
      FirmwareDeployStatus,
      ExportRecordsLimit,
      model: 4,
      modelList: [
        { key: 4, value: this.$t('deviceModel4') },
        { key: 2, value: this.$t('deviceModel2') },
        { key: 5, value: 'ATR_GN_A1' }
      ],
      version: '',
      versionFocus: false,
      changeLog: '',
      changeLogFocus: false,
      status: '',
      statusList: [
        { key: 0, value: this.$t('unreleased') },
        { key: 2, value: this.$t('fullRelease') }
      ],
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      firmwareList: [],
      showHandleResult: false,
      handleResultTitle: '',
      handleResultDescription: '',
      showUploadPopup: false,
      showConfirm: false,
      confirmInfo: {},
      lastFilterSnapshot: null
    };
  },
  created() {
    this.loadParamsFromQuery();
    this.getFirmwareList();
  },
  methods: {
    formatTableTime,
    blobUtil,
    getFirmwareList() {
      this.$psPageLoading().show();
      this.updateQueryParams();
      const filter = {
        model: this.model,
        version: this.version.trim(),
        changeLog: this.changeLog.trim(),
        status: this.status
      };
      const filterParams = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        order: this.order,
        sort: this.sort,
        ...filter
      };
      this.lastFilterSnapshot = JSON.parse(JSON.stringify(filter));
      this.$http
        .getFirmwareList(filterParams)
        .then((res) => {
          this.firmwareList = res.records;
          this.pageTotal = res.total;
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    changeSort(sort, name) {
      if (this.sort === name && this.order === sort) {
        this.order = '';
        this.sort = '';
      } else {
        this.sort = name;
        this.order = sort;
      }
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getFirmwareList();
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getFirmwareList();
    },
    updateQueryParams() {
      const query = {};
      if (this.model) {
        query.model = this.model;
      }
      if (this.version && this.version.trim()) {
        query.version = this.version.trim();
      }
      if (this.changeLog && this.changeLog.trim()) {
        query.changeLog = this.changeLog.trim();
      }
      if (this.status !== '') {
        query.status = this.status;
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    loadParamsFromQuery() {
      const query = this.$route.query;
      if (query.model) {
        this.model = query.model;
      }
      if (query.version) {
        this.version = query.version;
      }
      if (query.changeLog) {
        this.changeLog = query.changeLog;
      }
      if (query.status) {
        this.status = +query.status;
      }
    },
    searchList() {
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getFirmwareList();
    },
    clearList() {
      this.version = '';
      this.changeLog = '';
      this.status = '';
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getFirmwareList();
    },
    refreshList() {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getFirmwareList();
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
      this.$http.exportFirmwareList({
        ...(this.lastFilterSnapshot || {}),
        order: this.order,
        sort: this.sort
      }).then((res) => {
        const modelText = this.modelList.find(item => item.key === this.model)?.value;
        this.blobUtil(res, `Firmware-${modelText}-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    uploadSuccess() {
      this.showUploadPopup = false;
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getFirmwareList();
    },
    uploadCancel() {
      this.showUploadPopup = false;
    },
    deploy() {
      this.showHandleResult = true;
      this.handleResultTitle = this.$t('deploy');
      this.handleResultDescription = this.$t('deployTip');
    },
    confirmDeploy() {
      this.$psPageLoading().show();
      this.$http
        .deployFirmware(this.model)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.getFirmwareList();
        })
        .finally(() => {
          this.showHandleResult = false;
          this.$psPageLoading().hide();
        });
    },
    closeHandleResult() {
      this.showHandleResult = false;
    },
    confirmHandleResult() {
      this.confirmDeploy();
    },
    changeModelType() {
      this.clearList();
    }
  }
};
</script>

<style lang="scss" scoped>
.firmware__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;
  .tabs_container {
    margin-bottom: 10px;
    ::v-deep .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 10px 0 0 10px;
    }
    ::v-deep .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 10px 10px 0;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border-color: #325bf2;
      background-color: #325bf2;
    }
    ::v-deep .el-radio-button__inner:hover {
      background: #eaeaf6;
      color: #222e61;
    }
    ::v-deep .el-radio-button__inner {
      height: 36px;
      display: flex;
      align-items: center;
    }
  }
  .search__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 36px;

    .left {
      display: flex;
      .input-sn {
        max-width: 180px;
        height: 36px;

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
          .prefix-name,
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

      .status-selector {
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
        min-width: 36px;
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

    .right {
      display: flex;
      gap: 10px;
      .btn-deploy:hover {
        background: #EDEEF3;
      }
      .btn-deploy {
        width: 80px;
        height: 36px;
        cursor: pointer;
        border-radius: 20px;
        color: #333333;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
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
                  .changelog {
                    white-space: pre-wrap;
                  }
                  .status {
                    width: 100%;
                    .status-online {
                      .normal-online {
                        display: flex;
                        align-items: center;
                        .icon-online {
                          width: 8px;
                          height: 8px;
                          background: #25c95b;
                          border-radius: 100%;
                          margin-right: 6px;
                        }
                      }
                    }

                    .status-offline {
                      font-weight: 400;
                      font-size: 14px;
                      color: #c2c6d6;
                      line-height: 16px;
                    }
                    .error-online {
                      display: flex;
                      align-items: center;
                      justify-content: space-around;
                      width: 84px;
                      padding: 3px 0;
                      background: #fae9e8;
                      border-radius: 6px;
                      margin-top: 4px;
                      cursor: pointer;
                      .icon-error {
                        width: 18px;
                        height: 18px;
                        background: url("@/assets/icons/ic_list_error.svg")
                          no-repeat center;
                        background-size: contain;
                      }
                      .error-online-text {
                        font-weight: 400;
                        font-size: 14px;
                        color: #f53d3d;
                        line-height: 16px;
                        text-align: left;
                        font-style: normal;
                        text-decoration-line: underline;
                      }
                    }
                  }

                  .firmware {
                    .current-version {
                      font-weight: 400;
                      font-size: 14px;
                      color: #666f99;
                      line-height: 16px;
                    }
                    .can-upgrade {
                      font-weight: 600;
                      font-size: 13px;
                      color: #325bf2;
                      line-height: 15px;
                      margin-top: 5px;
                    }

                    .is-upgrading {
                      font-weight: 600;
                      font-size: 13px;
                      color: #25c95b;
                      line-height: 17px;
                      margin-top: 5px;
                    }

                    .is-failed {
                      font-weight: 600;
                      font-size: 13px;
                      color: #ff9a18;
                      line-height: 15px;
                      margin-top: 5px;
                    }
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
        line-height: 16px;
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
