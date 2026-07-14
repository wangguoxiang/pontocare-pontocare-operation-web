<template>
  <div class="devices__wrapper">
    <div class="search__container">
      <div class="left">
        <el-input
          class="input-filter"
          :class="{'input-not-empty': organization !== ''}"
          @focus="organizationFocus = true"
          @blur="organizationFocus = false"
          :placeholder="organizationFocus ? '' : $t('organization')"
          v-model="organization"
        >
          <span
            v-if="organizationFocus || organization"
            slot="prefix"
            class="prefix-filter"
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
          class="input-filter"
          :class="{'input-not-empty': homeName !== ''}"
          @focus="homeNameFocus = true"
          @blur="homeNameFocus = false"
          :placeholder="homeNameFocus ? '' : $t('home')"
          v-model="homeName"
        >
          <span
            v-if="homeNameFocus || homeName"
            slot="prefix"
            class="prefix-filter"
          >{{ $t("home") }}</span
          >
          <span
            v-if="homeName"
            slot="suffix"
            class="icon-clean"
            @click="homeName = ''"
          ></span>
        </el-input>
        <el-input
          class="input-filter"
          :class="{'input-not-empty': room !== ''}"
          @focus="roomFocus = true"
          @blur="roomFocus = false"
          :placeholder="roomFocus ? '' : $t('room')"
          v-model="room"
        >
          <span v-if="roomFocus || room" slot="prefix" class="prefix-filter">{{
            $t("room")
          }}</span>
          <span
            v-if="room"
            slot="suffix"
            class="icon-clean"
            @click="room = ''"
          ></span>
        </el-input>
        <el-input
          class="input-filter"
          :class="{'input-not-empty': sn !== ''}"
          @focus="snFocus = true"
          @blur="snFocus = false"
          :placeholder="snFocus ? '' : $t('serialNumber')"
          v-model="sn"
        >
          <span v-if="snFocus || sn" slot="prefix" class="prefix-filter">{{
            $t("serialNumber")
          }}</span>
          <span
            v-if="sn"
            slot="suffix"
            class="icon-clean"
            @click="sn = ''"
          ></span>
        </el-input>
        <div class="status-selector">
          <el-select
            v-model="sensorStatus"
            :placeholder="$t('status')"
            :clearable="true"
            :class="{'input-not-empty': sensorStatus !== ''}"
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
              v-if="sensorStatus"
              class="prefix-register-status"
            >{{ $t("status") }}</span
            >
          </el-select>
        </div>
        <div class="firmware-selector">
          <el-select
            v-model="upgradeStatus"
            :placeholder="$t('firmware')"
            :clearable="true"
            :class="{'input-not-empty': upgradeStatus !== ''}"
            popper-class="mark-selector"
          >
            <el-option
              v-for="item in upgradeStatusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
            <span
              slot="prefix"
              v-if="upgradeStatus !== ''"
              class="prefix-register-status"
            >{{ $t("firmware") }}</span
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
    </div>
    <div class="table__container">
      <el-table
        ref="table"
        :data="devicesList"
        row-key="id"
        border
        with="100%"
        height="calc(100% - 48px)"
        :row-style="{ height: '84px' }"
        @header-dragend="handleHeaderDragEnd"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column prop="tenantName" width="200">
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
        <el-table-column prop="homeName" width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'homeName' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'homeName')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'homeName' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'homeName')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'homeName' }"
              >
                {{ $t("home") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.homeName" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="roomName" width="230">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'roomName' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'roomName')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'roomName' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'roomName')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'roomName' }"
              >
                {{ $t("room") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.roomName" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="sn" min-width="163">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'sn' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'sn')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'sn' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'sn')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'sn' }"
              >
                {{ $t("serialNumber") }}
              </div>
            </div>
          </template>

          <template slot-scope="scope">
            <div>{{ scope.row.sn }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="model" min-width="133">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("deviceModel") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ $t("artGnP") }}{{ scope.row.model }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="status" min-width="133">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("status") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="status">
              <div
                class="status-online"
                v-if="scope.row.sensorStatus === SensorStatusConst.Online"
              >
                <div class="normal-online">
                  <div class="icon-online"></div>
                  <div>{{ $t("online") }}</div>
                </div>
              </div>
              <div
                class="status-offline"
                v-if="scope.row.sensorStatus === SensorStatusConst.Offline"
              >
                {{ $t("offline") }}
              </div>
              <div
                class="status-notActive"
                v-if="scope.row.sensorStatus === SensorStatusConst.NotActive"
              >
                {{ $t("device0005") }}
              </div>
              <el-tooltip
                v-if="
                  scope.row.errorCode === DeviceStatusConst.radarException ||
                    scope.row.errorCode === DeviceStatusConst.alignmentIncorrect ||
                    scope.row.errorCode === DeviceStatusConst.radarRebootException
                "
                effect="light"
                :content="errorContent[scope.row.errorCode]"
                placement="bottom-end"
              >
                <div class="error-online">
                  <div class="icon-error"></div>
                  <div class="error-online-text">
                    {{ $t("error") }}: {{ scope.row.errorCode }}
                  </div>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="firmware" min-width="163">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'currentVersion' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'currentVersion')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'currentVersion' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'currentVersion')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'currentVersion' }"
              >
                {{ $t("firmware") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="firmware">
              <div class="current-version">
                v{{ scope.row.upgrade.currentVersion }}
              </div>
              <div
                class="can-upgrade"
                v-if="
                  scope.row.upgrade.upgradeStatus ===
                    FirmwareUpgradeStatusConst.NewFirmwareAvailable
                "
              >
                {{ $t("new") }} v{{ scope.row.upgrade.availableVersion }}
              </div>
              <div
                class="is-upgrading"
                v-if="
                  scope.row.upgrade.upgradeStatus ===
                    FirmwareUpgradeStatusConst.Upgrading
                "
              >
                <div style="display: flex">
                  <div>
                    {{ $t("upgrading") }} v{{
                      scope.row.upgrade.availableVersion
                    }}
                  </div>
                  <div
                    v-jsonAnimation="upgradingJson"
                    style="width: 17px; height: 17px; margin-left: 8px"
                  ></div>
                </div>
              </div>
              <div
                class="is-failed"
                v-if="
                  scope.row.upgrade.upgradeStatus ===
                    FirmwareUpgradeStatusConst.UpgradeFailed
                "
              >
                {{ $t("failed") }} v{{ scope.row.upgrade.availableVersion }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" min-width="163">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'createTime' && order === 'asc',
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
                {{ $t("activatedDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ formatTableTime(scope.row.createTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column width="200" fixed="right">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t('device0001') }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-select
              :value="getPolicies(scope.row.cdcPolicies || [])"
              :placeholder="$t('pleaseSelect')"
              :disabled="scope.row.sensorStatus === SensorStatusConst.NotActive"
              popper-class="mark-selector"
              @change="changeStrategy($event, scope.row)"
            >
              <el-option
                v-for="item in policyList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
  FirmwareUpgradeStatusConst,
  SensorStatusConst,
  DeviceStatusConst,
  ExportRecordsLimit
} from '@/utils/constant';
import { formatTableTime } from '@/utils';
import { blobUtil } from '@/utils/util';
import moment from 'moment';
import upgradingJson from '../../assets/icons/upgrading.json';
export default {
  data() {
    return {
      upgradingJson,
      FirmwareUpgradeStatusConst,
      SensorStatusConst,
      DeviceStatusConst,
      ExportRecordsLimit,
      sn: '',
      snFocus: false,
      homeName: '',
      homeNameFocus: false,
      organization: '',
      organizationFocus: false,
      room: '',
      roomFocus: false,
      sensorStatus: '',
      upgradeStatus: '',
      statusList: [
        { key: 1, value: this.$t('online') },
        { key: 2, value: this.$t('offline') },
        { key: 3, value: this.$t('error') },
        { key: 0, value: this.$t('device0005') }
      ],
      upgradeStatusList: [
        { key: 30, value: this.$t('upgradeFailed') },
        { key: 10, value: this.$t('newAvailable') },
        { key: 20, value: this.$t('upgrading') },
        { key: 0, value: this.$t('upToDate') }
      ],
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      devicesList: [],
      errorContent: {
        21: this.$t('errorTip1'),
        22: this.$t('errorTip2'),
        23: this.$t('errorTip1')
      },
      policyList: [
        {
          value: 'on',
          name: this.$t('device0002')
        },
        {
          value: 'off',
          name: this.$t('device0003')
        },
        {
          value: 'occupation',
          name: this.$t('device0004')
        }
      ],
      showConfirm: false,
      confirmInfo: {},
      lastFilterSnapshot: null
    };
  },
  created() {
    this.loadParamsFromQuery();
    this.getDeviceList();
  },
  methods: {
    formatTableTime,
    blobUtil,
    getDeviceList() {
      this.$psPageLoading().show();
      this.updateQueryParams();
      const filter = {
        sn: this.sn.trim(),
        sensorStatus: this.sensorStatus,
        homeName: this.homeName.trim(),
        tenantName: this.organization.trim(),
        roomName: this.room.trim(),
        upgradeStatus: this.upgradeStatus
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
        .getDeviceList(filterParams)
        .then((res) => {
          this.devicesList = res.records;
          this.pageTotal = res.total;
          setTimeout(() => {
            this.$refs.table.doLayout();
          }, 0);
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
      this.getDeviceList();
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getDeviceList();
    },
    handleHeaderDragEnd() {
      this.$refs.table.doLayout();
    },
    loadParamsFromQuery() {
      const query = this.$route.query || {};
      if (query.organization) {
        this.organization = query.organization;
      }
      if (query.homeName) {
        this.homeName = query.homeName;
      }
      if (query.room) {
        this.room = query.room;
      }
      if (query.sensorStatus) {
        this.sensorStatus = +query.sensorStatus;
      }
      if (query.upgradeStatus) {
        this.upgradeStatus = +query.upgradeStatus;
      }
      if (query.sn) {
        this.sn = query.sn;
      }
    },
    updateQueryParams() {
      const query = {};
      if (this.organization && this.organization.trim()) {
        query.organization = this.organization.trim();
      }
      if (this.homeName && this.homeName.trim()) {
        query.homeName = this.homeName.trim();
      }
      if (this.room && this.room.trim()) {
        query.room = this.room.trim();
      }
      if (this.sensorStatus) {
        query.sensorStatus = this.sensorStatus;
      }
      if (this.upgradeStatus) {
        query.upgradeStatus = this.upgradeStatus;
      }
      if (this.sn && this.sn.trim()) {
        query.sn = this.sn.trim();
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    searchList() {
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getDeviceList();
    },
    clearList() {
      this.sn = '';
      this.homeName = '';
      this.organization = '';
      this.room = '';
      this.sensorStatus = '';
      this.upgradeStatus = '';
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getDeviceList();
    },
    refreshList() {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getDeviceList();
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
      this.$http.exportDeviceList({
        ...(this.lastFilterSnapshot || {}),
        order: this.order,
        sort: this.sort
      }).then((res) => {
        this.blobUtil(res, `Devices-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    getPolicies(policies) {
      if (policies.some((item) => item.name === 'always' && item.value === true)) {
        return 'on';
      }
      if (policies.some((item) => item.name === 'occupation' && item.value === true)) {
        return 'occupation';
      }
      return 'off';
    },
    changeStrategy(type, item) {
      const sensorId = item.id;
      const tenantId = item.tenantId;
      const params = {
        tenantId,
        policies: [
          {
            name: type === 'occupation' ? 'occupation' : 'always',
            value: type !== 'off'
          }
        ]
      };
      this.$http.editStrategy(sensorId, params).then(() => {
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
        this.getDeviceList();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.devices__wrapper {
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
      .input-filter {
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
          .prefix-filter {
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

      .status-selector,
      .firmware-selector {
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
      .btn-add-member {
        width: 150px;
        height: 36px;
        background: linear-gradient(90deg, #1c21e4 0%, #4895ff 100%);
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        border-radius: 10px;
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
                    .status-notActive {
                      font-weight: 400;
                      font-size: 14px;
                      color: #7A8497;
                      line-height: 16px;
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
                      width: fit-content;
                      padding: 3px;
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
                      line-height: 17px;
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
