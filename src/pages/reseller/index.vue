<template>
  <div class="reseller__wrapper">
    <div class="search__container">
      <div class="right">
        <div class="btn-add-member" @click="showAddReseller = true">
          {{ $t('reseller0016') }}
        </div>
      </div>
    </div>
    <div class="table__container" v-if="!tableLoading">
      <el-table
        :data="resellerList"
        ref="table"
        row-key="id"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
        :row-style="{ height: '65px' }"
        @header-dragend="handleHeaderDragEnd"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column prop="name" min-width="120">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("reseller0001") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.name" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="email" min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("email") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.email?scope.row.email:"-" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("reseller0002") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.phone?scope.row.phone:"-" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="prices" min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("reseller0003") }}</div>
            </div>
          </template>
          <template slot-scope="scope">{{ getCurrency(scope.row.prices,20) }} {{ getPrice(scope.row.prices,20) }}</template>
        </el-table-column>
        <el-table-column prop="prices" min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("reseller0004") }}</div>
            </div>
          </template>
          <template slot-scope="scope">{{ getCurrency(scope.row.prices,10) }} {{ getPrice(scope.row.prices,10) }}</template>
        </el-table-column>
        <el-table-column prop="note"  min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("note") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.note?scope.row.note:'-'" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column  min-width="80">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("actions") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <div class="icon-action"></div>
              <el-dropdown-menu slot="dropdown" class="members-action-dropdown">
                <el-dropdown-item
                  @click.native="handleEditReseller(scope.row)"
                >{{ $t("reseller0005") }}</el-dropdown-item
                >
                <el-dropdown-item @click.native="showSensorList(scope.row)"
                >{{ $t('reseller0006') }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-bottom">
        <div class="table-bottom-left">
          <div class="export-btn" :class="{'text-btn-disable': resellerList.length === 0}" @click="exportCSV">
            <i class="export-ico iconfont ps-inbox-download"></i>
            <div class="export-text">{{ $t('export0001') }}</div>
          </div>
        </div>
        <div class="page__container">
        </div>
      </div>
    </div>
    <div class="table-loading" v-else>
      <div v-loading="true"></div>
    </div>
    <el-drawer
      :title="$t('devices')"
      :visible.sync="showSnList"
      :size="600"
      direction="rtl"
      @close="handleCloseSnList"
    >
      <div class="sensor-list__wrapper">
        <div class="search__container">
          <div class="left">
            <el-input v-model="searchSn" :placeholder="$t('serialNumber')"></el-input>
            <div class="btn-search" @click="searchSnList"></div>
            <div class="btn-clear" @click="clearSnList"></div>
          </div>
          <div class="right">
            <div class="btn-add" @click="showEditSn = true">{{ $t('reseller0007') }}</div>
          </div>
        </div>

        <div class="sensor__container">
          <div class="action" v-show="snList.length > 0 && !snLoading">
            <el-checkbox v-model="isCheckAll"
                         @change="handleCheckAllChange"
            ><span style="font-size: 14px; color: #222e61; font-weight: 500"
            >{{ $t('reseller0008') }}</span
            ></el-checkbox
            >
            <CancelButton
              :text="$t('delete')"
              :width="80"
              :height="30"
              @click.native="handleDelSn"
            />
          </div>
          <div class="sensor-list" v-if="snList.length > 0 && !snLoading">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                v-for="(item, index) in snList"
                :key="index"
                :label="item"
              ></el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="sensor-list" v-if="snList.length === 0 && !snLoading">
            <div class="empty">
              <div class="img-empty"></div>
              <div class="text-empty">{{ $t('noData') }}</div>
            </div>
          </div>

          <div class="sensor-loading" v-if="snLoading">
            <div v-loading="true"></div>
          </div>
        </div>

        <div class="page__container">
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
    </el-drawer>

    <HandleReseller
      v-if="showAddReseller || showEditReseller"
      :isEdit="showEditReseller"
      :currentReseller="currentReseller"
      @cancelAdd="cancelAdd"
    />
    <EditSn
      v-if="showEditSn"
      :currentReseller="currentReseller"
      @closeEdit="closeEdit"
      @addFaild="addFaild"
    />
    <AddFailed
      v-if="showAddInBatchesFaild"
      :fileName="fileName"
      @downloadFeedback="downloadFeedback"
      @ignoreFeedback="ignoreFeedback"
    />

    <PsConfirm
      v-if="showConfirm"
      :confirmInfo="confirmInfo"
      @close="showConfirm = false"
      @confirm="confirmOperation"
    />
  </div>
</template>

<script>
import HandleReseller from './editReseller.vue';
import EditSn from './editSn.vue';
import AddFailed from './addFailed.vue';
import { CurrencyList, ExportRecordsLimit } from '@/utils/constant';
import { blobUtil } from '@/utils/util';
import moment from 'moment';

export default {
  components: {
    HandleReseller,
    EditSn,
    AddFailed
  },
  data() {
    return {
      ExportRecordsLimit,
      CurrencyList,
      resellerList: [],

      showAddReseller: false,
      showEditReseller: false,
      showEditSn: false,
      currentReseller: null,

      // drawer
      showSnList: false,
      isCheckAll: false,
      searchSn: '',
      snList: [],
      checkList: [],
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      showConfirm: false,
      confirmInfo: {},
      currentConfirmAction: '',

      showAddInBatchesFaild: false,
      failedBlob: null,
      fileName: '',

      tableLoading: true,

      snLoading: false
    };
  },
  mounted() {
    this.getResellerList();
  },
  watch: {
    checkList(newVal) {
      const total = this.snList.length;
      const checked = newVal.length;
      this.isCheckAll = checked === total && total > 0;
    },
    snList() {
      this.syncCheckAllState();
    }
  },
  methods: {
    blobUtil,
    getPrice(prices, resourceId) {
      if (!prices) return '-';
      const tartgetPrice = prices.find(item => item.resourceId === resourceId);
      if (tartgetPrice) {
        return (tartgetPrice.amount / 100).toFixed(2);
      } else {
        return '-';
      }
    },
    getCurrency(prices, resourceId) {
      if (!prices) return '';
      const tartgetPrice = prices.find(item => item.resourceId === resourceId);
      if (tartgetPrice) {
        return this.CurrencyList.find(item => item.value === tartgetPrice.currency)?.label;
      } else {
        return '';
      }
    },
    handleHeaderDragEnd() {
      this.$refs.table.doLayout();
    },
    confirmOperation() {
      if (this.currentConfirmAction === 'delete') {
        this.confirmDelete();
      } else if (this.currentConfirmAction === 'export') {
        this.confirmExport();
      }
    },
    getResellerList() {
      this.tableLoading = true;
      this.$http
        .getResellerList()
        .then((res) => {
          this.resellerList = res;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    closeEdit(refresh) {
      if (refresh) {
        this.getSensorList();
      }
      this.showEditSn = false;
    },
    handleEditReseller(row) {
      this.currentReseller = row;
      this.showEditReseller = true;
    },
    cancelAdd(refresh) {
      if (refresh) {
        this.getResellerList();
      }
      this.showAddReseller = false;
      this.showEditReseller = false;
    },
    showSensorList(row) {
      this.currentReseller = row;
      this.getSensorList();
      this.showSnList = true;
    },
    // 获取指定reseller下的sn列表
    getSensorList() {
      this.snLoading = true;
      const filter = {
        sn: this.searchSn.trim()
      };
      const filterParams = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...filter
      };
      this.$http
        .getResellerSensorList(
          this.currentReseller.id,
          filterParams
        )
        .then((res) => {
          this.snList = res.records;
          this.pageTotal = res.total;
        })
        .finally(() => {
          this.snLoading = false;
        });
    },
    searchSnList() {
      this.pageNo = 1;
      this.getSensorList();
    },
    clearSnList() {
      this.pageNo = 1;
      this.searchSn = '';
      this.getSensorList();
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkList = this.snList.slice();
      } else {
        this.checkList = [];
      }
      this.syncCheckAllState();
    },
    syncCheckAllState() {
      const total = this.snList.length;
      const checked = this.checkList.length;
      this.isCheckAll = checked === total && total > 0;
      this.isIndeterminate = checked > 0 && checked < total;
    },
    handleDelSn() {
      if (this.checkList.length === 0) return;
      this.currentConfirmAction = 'delete';
      this.showConfirm = true;
      this.confirmInfo = {
        title: this.$t('delete'),
        description: this.$t('doContinue')
      };
    },
    confirmDelete() {
      if (this.checkList.length === 0) return;
      const params = {
        sensors: this.checkList
      };
      this.$http.delResellerSensor(this.currentReseller.id, params).then(() => {
        this.pageNo = 1;
        this.getSensorList();
        this.showConfirm = false;
        this.currentConfirmAction = '';
        this.checkList = [];
      });
    },
    exportCSV() {
      const total = this.resellerList.length;
      if (total === 0) return;
      if (total > this.ExportRecordsLimit) {
        this.currentConfirmAction = 'export';
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
      this.$http.exportResellerList().then((res) => {
        this.blobUtil(res, `Reseller-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.currentConfirmAction = '';
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    handlePageChange(page) {
      this.pageNo = page;
      this.checkList = [];
      this.isCheckAll = false;
      this.getSensorList();
    },
    addFaild(res, fileName) {
      this.showAddInBatchesFaild = true;
      this.showEditSn = false;
      this.failedBlob = res;

      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex === -1) {
        return { name: fileName, ext: '' }; // 没有扩展名
      }

      const name = fileName.slice(0, lastDotIndex);
      const ext = fileName.slice(lastDotIndex + 1).toLowerCase();

      const feedbackFileName = name + '_Feedback.' + ext;

      this.fileName = feedbackFileName;
      this.getSensorList();
    },
    downloadFeedback() {
      const blob = new Blob([this.failedBlob], {
        type: 'application/octet-stream'
      });

      // 2. 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      link.download = this.fileName;

      // 3. 触发下载
      document.body.appendChild(link);
      link.click();

      // 4. 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.showAddInBatchesFaild = false;
      this.fileName = '';
    },
    ignoreFeedback() {
      this.showAddInBatchesFaild = false;
      this.failedBlob = null;
      this.fileName = '';
    },
    handleCloseSnList() {
      this.checkList = [];
      this.searchSn = '';
      this.pageNo = 1;
      this.isCheckAll = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.reseller__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;

  .search__container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 36px;

    .right {
      display: flex;
      margin-left: 6px;
      .btn-add-member:hover {
        background: #5779f4;
      }
      .btn-add-member {
        width: 150px;
        height: 36px;
        background: #325bf2;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        border-radius: 20px;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
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
                        // background: rgba(102, 124, 204, 0.1);
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
                  min-height: 30px;
                  line-height: 30px;
                }
              }
              th.el-table__cell::after {
                content: "";
                border: 1px solid #f0f0f4;
                right: 2px;
                position: absolute;
                height: 15px;
                top: 50%;
                transform: translateY(-50%);
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
                  white-space: pre-wrap;
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
                  .evaluationStatus-selector {
                    height: 36px;
                    .high {
                      .el-input {
                        .el-input__inner {
                          color: #e81c1c !important;
                        }
                      }
                    }
                    .mid {
                      .el-input {
                        .el-input__inner {
                          color: #ee913c !important;
                        }
                      }
                    }
                    .el-select {
                      width: 100%;
                      height: 100%;
                      .el-input {
                        height: 100%;
                        .el-input__inner {
                          height: 100%;
                          background: #ffffff;
                          border-radius: 26px;
                          border: 1px solid #e2e3e9;
                          font-weight: 500;
                          font-size: 14px;
                          color: #7982a6;
                        }
                        .el-input__inner:hover {
                          border: 2px solid #325bf2;
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
                          }
                        }
                      }
                    }
                  }
                  .registered {
                    background: rgba(172, 255, 195, 0.5);
                    color: #009a07;
                  }

                  .invited {
                    background: rgba(153, 152, 152, 0.1);
                    color: #acb2c8;
                  }

                  //action 下拉菜单
                  .el-dropdown {
                    .icon-action {
                      width: 24px;
                      height: 24px;
                      // background: rgba(102, 124, 204, 0.1);
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
    .underline:hover {
      color: #325bf2;
    }
    .underline {
      text-decoration: underline;
      cursor: pointer;
    }
    .table-bottom {
      height: 48px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

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
      justify-content: flex-end;

      .page-total {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }
    }
  }
  .table-loading {
    width: 100%;
    flex: 1;
    margin-top: 10px;
    background: #ffffff;
    box-shadow: 0px 0px 5px 0px rgba(85, 88, 181, 0.1);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-drawer__wrapper {
    .sensor-list__wrapper {
      width: 100%;
      height: 100%;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;

      .search__container {
        width: 100%;
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        .left {
          display: flex;
          align-items: center;
          gap: 10px;
          ::v-deep .el-input {
            width: 260px;
            height: 36px;
            .el-input__inner {
              border-radius: 20px;
              height: 100%;
              padding: 0 15px;
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
            }
            .el-input__suffix {
              right: 10px;
            }
          }
          .btn-search {
            min-width: 36px;
            height: 36px;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            margin-left: 6px;
            background: url("@/assets/icons/ic_search.svg") no-repeat center;
            background-size: 17px 17px;
            background-color: #ffffff;
            cursor: pointer;
          }
          .btn-clear {
            min-width: 36px;
            height: 36px;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            margin-left: 6px;
            background: url("@/assets/icons/ic_clear.svg") no-repeat center;
            background-size: 17px 17px;
            background-color: #ffffff;
            cursor: pointer;
          }
        }

        .right {
          height: 100%;
          .btn-add {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 100%;
            background: #325bf2;
            box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
            border-radius: 20px;
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
          }
          .btn-add:hover {
            background: #5779f4;
          }
        }
      }

      .sensor__container {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-top: 16px;
        overflow: hidden;

        .action {
          width: 100%;
          height: 34px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          // justify-content: space-between;
          ::v-deep .el-checkbox {
            .el-checkbox__label {
              width: auto;
              margin-right: 16px;
            }
          }
        }

        .sensor-list {
          width: 100%;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background: #f3f4f7;
          border-radius: 20px;
          padding: 10px;

          ::v-deep .el-checkbox-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 16px;

            .el-checkbox {
              .el-checkbox__label {
                width: 240px;
                font-size: 14px;
                color: #222e61;
                font-weight: 400;
              }
            }
          }
          .empty {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 180px;
            .img-empty {
              width: 100px;
              height: 100px;
              background: url("@/assets/icons/img_empty.svg") no-repeat center;
              background-size: contain;
            }
            .text-empty {
              font-weight: 400;
              font-size: 14px;
              color: 222e61;
              margin-top: 16px;
            }
          }
        }
        .sensor-loading {
          width: 100%;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background: #f3f4f7;
          border-radius: 20px;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .page__container {
        display: flex;
        width: 100%;
        height: 48px;
        align-items: center;
        justify-content: flex-end;
        padding-right: 16px;

        .page-total {
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 20px;
        }

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
}
</style>
