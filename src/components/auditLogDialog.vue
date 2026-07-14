<template>
  <div class="audit-log-list-dialog__wrapper">
    <div class="popup">
      <div class="title">
        {{ title }}
        <i
          class="el-icon-close"
          style="float: right; cursor: pointer; font-size: 22px"
          @click="closePopup"
        ></i>
      </div>
      <div class="tool">
        <el-input
          class="input-name"
          :class="{'input-not-empty': name !== ''}"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          :placeholder="nameFocus ? '' : $t('operator')"
          v-model="name"
        >
          <span v-if="nameFocus || name" slot="prefix" class="prefix-name">{{
            $t("operator")
          }}</span>
          <span
            v-if="name"
            slot="suffix"
            class="icon-clean"
            @click="name = ''"
          ></span>
        </el-input>
        <el-input
          style="margin-left: 5px"
          class="input-name"
          :class="{'input-not-empty': organization !== ''}"
          @focus="organizationFocus = true"
          @blur="organizationFocus = false"
          :placeholder="organizationFocus ? '' : $t('organization')"
          v-model="organization"
        >
          <span
            v-if="organizationFocus || organization"
            slot="prefix"
            class="prefix-name"
          >{{ $t("organization") }}</span
          >
          <span
            v-if="organization"
            slot="suffix"
            class="icon-clean"
            @click="organization = ''"
          ></span>
        </el-input>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('search')"
          placement="bottom-end"
        >
          <div class="btn-search" @click="searchList"></div>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('clear')"
          placement="bottom-end"
        >
          <div class="btn-clear" @click="clearList"></div>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('refresh')"
          placement="bottom-end"
        >
          <div class="btn-refresh" @click="getAuditLog()"></div>
        </el-tooltip>
      </div>
      <div class="list">
        <el-table
          :data="logList"
          row-key="id"
          border
          style="width: 100%; overflow: auto; height: 490px"
        >
          <template slot="empty">
            <img src="@/assets/icons/ic_empty.svg" alt="" />
            <div style="margin-top: 20px">{{ $t("noData") }}</div>
          </template>
          <el-table-column
            prop="operator"
            min-width="200"
          >
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("operator") }}</div>
              </div>
            </template>
            <template slot-scope="scope">
              <ps-tool-tip :content="scope.row.operator" :lines="5"></ps-tool-tip>
            </template>
          </el-table-column>
          <el-table-column prop="tenantName" min-width="130">
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("organization") }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operationDate" min-width="173">
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("operationDate") }}</div>
              </div>
            </template>
            <template slot-scope="scope">
              <div>{{ formatTableTime(scope.row.operationDate) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="modification"
            min-width="120"
            v-if="type === AuditLogType.InvoiceStatus"
          >
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("action") }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="resourceDesc"
            min-width="130"
            v-if="type === AuditLogType.Price"
          >
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("package") }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="effectiveType"
            min-width="160"
            v-if="type === AuditLogType.Price"
          >
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("effectiveType") }}</div>
              </div>
            </template>
            <template slot-scope="scope">
              <div>
                {{
                  effectTimeList.find(
                    (item) => item.key === scope.row.effectiveType
                  )?.value
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="before" min-width="100">
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("before") }}</div>
              </div>
            </template>
            <template slot-scope="scope">
              <div>{{ parseHandle(scope.row.before) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="after" min-width="100">
            <template slot="header">
              <div class="table-header-sort">
                <div class="table-header-text">{{ $t("after") }}</div>
              </div>
            </template>
            <template slot-scope="scope">
              <div>{{ parseHandle(scope.row.after) }}</div>
            </template>
          </el-table-column>
        </el-table>
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
    </div>
  </div>
</template>

<script>
import { formatTableTime } from '@/utils';
import { AuditLogType, InvoiceStatusMap } from '@/utils/constant';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      AuditLogType,
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      name: '',
      nameFocus: false,
      organization: '',
      organizationFocus: false,
      effectTimeList: [
        { key: 1, value: this.$t('applyForNextMonth') },
        { key: 0, value: this.$t('applyImmediately') }
      ],
      logList: []
    };
  },
  mounted() {
    this.getAuditLog();
  },
  methods: {
    formatTableTime,
    getAuditLog() {
      this.$psPageLoading().show();
      this.$http
        .getAuditLogList(
          this.pageNo,
          this.pageSize,
          this.order,
          this.sort,
          this.type,
          '',
          this.organization,
          this.name
        )
        .then((res) => {
          this.logList = this.parseRecords(res.records);
          this.pageTotal = res.total;
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.getAuditLog();
    },
    searchList() {
      this.pageNo = 1;
      this.getAuditLog();
    },
    clearList() {
      this.organization = '';
      this.name = '';
      this.pageNo = 1;
      this.getAuditLog();
    },
    parseRecords(records) {
      if (records && records.length > 0) {
        return records.map((item) => {
          const dataObject = JSON.parse(item.data);
          return {
            ...item,
            ...dataObject
          };
        });
      }
    },
    parseHandle(content) {
      if (!content) {
        return '';
      }
      console.log(content, this.type);

      if (this.type === AuditLogType.InvoiceStatus) {
        return InvoiceStatusMap[content.status];
      }
      if (this.type === AuditLogType.Price) {
        return content.price.toFixed(2);
      }
    },
    closePopup() {
      this.$emit('closePopup');
    }
  }
};
</script>

<style lang="scss" scoped>
.audit-log-list-dialog__wrapper {
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
    width: 1080px;
    background: #ffffff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;

    .title {
      font-weight: 650;
      font-size: 16px;
      color: #222e61;
      line-height: 19px;
    }
    .tool {
      display: flex;
      margin: 20px 0 12px 0;
      .input-name {
        width: 140px;
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
          border: 2px solid #325bf2;
        }
        ::v-deep .el-input__inner:focus {
          border: 2px solid #325bf2;
          padding: 16px 25px 4px 10px;
        }
        ::v-deep .el-input__inner::placeholder {
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

        ::v-deep .el-input__prefix {
          left: 10px;
          height: 50%;
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

      .btn-search,
      .btn-refresh,
      .btn-clear {
        width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
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
    .list {
      border-radius: 10px;
      border: 1px solid rgba(22, 35, 71, 0.06);
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
          height: calc(100% - 32px);
          overflow-y: auto;
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
          .el-table__empty-text {
            height: 150px;
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
