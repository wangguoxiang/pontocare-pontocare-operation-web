<template>
  <div class="rooms__wrapper">
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
          :class="{'input-not-empty': home !== ''}"
          @focus="homeFocus = true"
          @blur="homeFocus = false"
          :placeholder="homeFocus ? '' : $t('home')"
          v-model="home"
        >
          <span v-if="homeFocus || home" slot="prefix" class="prefix-filter">{{
            $t("home")
          }}</span>
          <span
            v-if="home"
            slot="suffix"
            class="icon-clean"
            @click="home = ''"
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
          :class="{'input-not-empty': id !== ''}"
          @focus="idFocus = true"
          @blur="idFocus = false"
          :placeholder="idFocus ? '' : $t('roomID')"
          v-model="id"
        >
          <span v-if="idFocus || id" slot="prefix" class="prefix-filter">{{
            $t("roomID")
          }}</span>
          <span
            v-if="id"
            slot="suffix"
            class="icon-clean"
            @click="id = ''"
          ></span>
        </el-input>
        <el-input
          class="input-filter"
          :class="{'input-not-empty': serialNumber !== ''}"
          @focus="serialNumberFocus = true"
          @blur="serialNumberFocus = false"
          :placeholder="serialNumberFocus ? '' : $t('serialNumber')"
          v-model="serialNumber"
        >
          <span
            v-if="serialNumberFocus || serialNumber"
            slot="prefix"
            class="prefix-filter"
          >{{ $t("serialNumber") }}</span
          >
          <span
            v-if="serialNumber"
            slot="suffix"
            class="icon-clean"
            @click="serialNumber = ''"
          ></span>
        </el-input>
        <div class="time-select" id="timeSelect">
          <div class="select" @click="handleDatePicker">
            <div
              class="select-span"
              v-if="selectedStartDate && selectedEndDate"
            >
              <div class="start">{{ selectedStartDate }}</div>
              <span style="margin: 0 3px">-</span>
              <div class="end">{{ selectedEndDate }}</div>
            </div>
            <div class="select-span" v-else>{{ $t("date") }}</div>
            <el-tooltip
              effect="light"
              :content="$t('statsPeriod')"
              placement="bottom-end"
            >
              <div class="form-icon-help" style="width: 24px;height: 24px"></div>
            </el-tooltip>
          </div>
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
        <div class="btn-view-trends" @click="showViewPastTrends({})">{{$t('viewPastTrends')}}</div>
      </div>
    </div>
    <div class="table__container">
      <el-table
        ref="table"
        :data="roomList"
        row-key="id"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
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
        <el-table-column prop="homeName" width="150">
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
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("room") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.roomName" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="date" min-width="200">
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
                {{ $t("addedDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ formatTableTime(scope.row.createTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="id" min-width="200">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("roomID") }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sn" width="230">
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
            <ps-tool-tip :content="scope.row.sn ? scope.row.sn : '-'" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="totalOccupany" min-width="180">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'totalOccupany' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'totalOccupany')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'totalOccupany' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'totalOccupany')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'totalOccupany' }"
              >
                {{ $t("occupancyHours") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ secondsToHours(scope.row.totalOccupany) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="fallCount" min-width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'fallCount' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'fallCount')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'fallCount' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'fallCount')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'fallCount' }"
              >
                {{ $t("fallsDetected") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fpReported" min-width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'fpReported' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'fpReported')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'fpReported' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'fpReported')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'fpReported' }"
              >
                {{ $t("fpReported") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceErrorNotifications" min-width="196">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'deviceErrorNotifications' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'deviceErrorNotifications')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'deviceErrorNotifications' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'deviceErrorNotifications')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'deviceErrorNotifications' }"
              >
                {{ $t("deviceErrorNotifications") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="offline" min-width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'offline' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'offline')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'offline' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'offline')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'offline' }"
              >
                {{ $t("offlineHours") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ secondsToHours(scope.row.offline) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="offlineCount" min-width="150">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'offlineCount' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'offlineCount')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'offlineCount' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'offlineCount')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'offlineCount' }"
              >
                {{ $t("offlineCount") }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150" fixed="right">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("actions") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="viewPastTrends" @click="showViewPastTrends(scope.row)">{{$t("viewPastTrends")}}</div>
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
      :data="currentNameList"
      :title="nameListTitle"
      :type="nameListType"
      @closePopup="showNameListDialog = false"
    />
    <div
      class="date-picker__wrapper"
      id="datePicker"
      :key="'datePicker' + showDatePicker"
      @click="clickDatePicker"
      v-if="showDatePicker"
    >
      <div class="popup">
        <datepicker
          placeholder="Select Date"
          v-model="date"
          :open-date="today"
          :disabled-dates="disabledDates"
          maximum-view="day"
          initial-view="day"
          :opened="true"
          @selected="handleSelectedDate"
          @changedMonth="changedMonth"
          :highlighted="highlighted"
          :language="
            lang === 'zh' ? zh : lang === 'fi' ? fi : lang === 'ja' ? ja : en
          "
        >
          <div slot="beforeCalendarHeader" class="calender-header">
            {{ mouth }}
          </div>
        </datepicker>
        <div class="date-choice">
          <div class="date-span">
            <div class="choice-start-date">
              <div class="label">{{ $t("startDate") }}</div>
              <div class="date">{{ startDateFormatted }}</div>
            </div>
            <div class="split-line"></div>
            <div class="choice-end-date">
              <div class="label">{{ $t("endDate") }}</div>
              <div class="date">{{ endDateFormatted }}</div>
            </div>
          </div>
        </div>

        <div class="btn-group">
          <CancelButton :height="36" :text="$t('cancel')" @click.native="handleCloseSelectDate('cancel')" />
          <CancelButton :height="36" :text="$t('reset')" @click.native="handleClearDate" />
          <ConfirmButton :height="36" :text="$t('ok')" @click.native="handleCloseSelectDate('ok')" />
        </div>
      </div>
    </div>
    <PastTrendsDialog v-if="showViewTrends"
                      :currentHomeId="currentHomeId"
                      :currentRoomId="currentRoomId"
                      @closePopup="showViewTrends = false" />
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
  formatTableTime,
  DatePickerTitle,
  formatYMDTime,
  secondsToHours,
  getCurrentLanguage
} from '@/utils';
import NameListDialog from '@/components/NameListDialog';
import PastTrendsDialog from '@/components/pastTrendsDialog';
import Datepicker from 'vuejs-datepicker';
import { zh, en, fi, ja } from 'vuejs-datepicker/dist/locale';
import { ExportRecordsLimit } from '@/utils/constant';
import { blobUtil } from '@/utils/util';
import moment from 'moment';
export default {
  components: {
    NameListDialog,
    PastTrendsDialog,
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
      organization: '',
      organizationFocus: false,
      home: '',
      homeFocus: false,
      room: '',
      roomFocus: false,
      id: '',
      idFocus: false,
      serialNumber: '',
      serialNumberFocus: false,
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      roomList: [],
      currentNameList: [],
      nameListType: '',
      showNameListDialog: false,

      showDatePicker: false,
      mouth: '',
      date: null,
      today: moment().subtract(1, 'day').startOf('day').toDate(), // 由于当天不能进行选择，所以把当天减去1天
      disabledDates: {
        // 禁用的自定义规则
        from: moment().subtract(1, 'day').startOf('day').toDate() // 禁用今天及以后的日期
      },
      startDate: null,
      endDate: null,
      selectedStartDate: null,
      selectedEndDate: null,
      lastStartTimestamp: null,
      lastEndTimestamp: null,
      showViewTrends: false,

      currentTenantId: '',
      currentRoomId: '',
      currentHomeId: '',
      showConfirm: false,
      confirmInfo: {},
      lastFilterSnapshot: null
    };
  },
  watch: {
    showDatePicker(newValue) {
      if (newValue) {
        this.disabledDates = {
          from: moment().subtract(1, 'day').toDate()
        };
        if (this.selectedStartDate && this.selectedEndDate) {
          this.startDate = this.lastStartTimestamp;
          this.endDate = this.lastEndTimestamp;
        }
        this.$nextTick(() => {
          const calendar = document.querySelectorAll(
            '.vdp-datepicker__calendar'
          )[0];
          calendar.style.display = 'flex';

          if (!this.date) {
            this.mouth = this.DatePickerTitle(this.today);
          } else {
            this.mouth = this.DatePickerTitle(this.date);
          }
        });
      }
    }
  },
  computed: {
    highlighted() {
      if (this.startDate && this.endDate) {
        return {
          to: new Date(this.endDate),
          from: new Date(this.startDate)
        };
      } else {
        return {
          dates: []
        };
      }
    },
    startDateFormatted() {
      return this.startDate ? this.formatYMDTime(this.startDate) : '-';
    },
    endDateFormatted() {
      return this.endDate ? this.formatYMDTime(this.endDate) : '-';
    },
    nameListTitle() {
      const title =
        this.nameListType === 'member'
          ? this.$t('associatedUsers')
          : this.$t('associatedRooms');
      return title + ' (' + this.currentNameList.length + ')';
    }
  },
  created() {
    if (this.$route.params.id) {
      this.id = String(this.$route.params.id);
    }
    this.initDate();
    this.loadParamsFromQuery();
    this.getRoomList();
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDatePicker);
  },
  methods: {
    formatTableTime,
    DatePickerTitle,
    formatYMDTime,
    blobUtil,
    secondsToHours,
    changeSort(sort, name) {
      if (this.sort === name && this.order === sort) {
        this.order = '';
        this.sort = '';
      } else {
        this.sort = name;
        this.order = sort;
      }
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getRoomList();
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getRoomList();
    },
    loadParamsFromQuery() {
      const query = this.$route.query || {};
      if (query.organization) {
        this.organization = query.organization;
      }
      if (query.serialNumber) {
        this.serialNumber = query.serialNumber;
      }
      if (query.home) {
        this.home = query.home;
      }
      if (query.room) {
        this.room = query.room;
      }
      if (query.id) {
        this.id = query.id;
      }
      if (query.startDate && query.startDate !== '') {
        this.startDate = Number(query.startDate);
      }
      if (query.endDate && query.endDate !== '') {
        this.endDate = Number(query.endDate);
      }
      this.lastStartTimestamp = this.startDate;
      this.lastEndTimestamp = this.endDate;
      this.selectedStartDate = this.startDateFormatted === '-' ? null : this.startDateFormatted;
      this.selectedEndDate = this.endDateFormatted === '-' ? null : this.endDateFormatted;
    },
    updateQueryParams() {
      const query = {};
      if (this.organization && this.organization.trim()) {
        query.organization = this.organization.trim();
      }
      if (this.home && this.home.trim()) {
        query.home = this.home.trim();
      }
      if (this.id && this.id.trim()) {
        query.id = this.id.trim();
      }
      if (this.serialNumber && this.serialNumber.trim()) {
        query.serialNumber = this.serialNumber.trim();
      }
      if (this.startDate) {
        query.startDate = this.startDate;
      }
      if (this.endDate) {
        query.endDate = this.endDate;
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    showViewPastTrends(room) {
      this.showViewTrends = true;
      this.currentHomeId = room.homeId;
      this.currentRoomId = room.id;
    },
    searchList() {
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getRoomList();
    },
    clearList() {
      this.organization = '';
      this.home = '';
      this.room = '';
      this.id = '';
      this.serialNumber = '';
      this.pageNo = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.initDate();
      this.getRoomList();
    },
    refreshList() {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getRoomList();
    },
    initDate() {
      this.date = null;
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setDate(now.getDate() - 7);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setDate(now.getDate() - 1);
      endOfDay.setHours(23, 59, 59, 999);
      this.startDate = startOfDay.getTime();
      this.endDate = endOfDay.getTime();
      this.lastStartTimestamp = startOfDay.getTime();
      this.lastEndTimestamp = endOfDay.getTime();
      this.selectedStartDate =
        this.startDateFormatted === '-' ? null : this.startDateFormatted;
      this.selectedEndDate =
        this.endDateFormatted === '-' ? null : this.endDateFormatted;
    },
    adjustDate() {
      const startOfDay = new Date(this.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      this.startDate = startOfDay.getTime();
      const endOfDay = new Date(this.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      this.endDate = endOfDay.getTime();
    },
    getRoomList() {
      this.adjustDate();
      this.$psPageLoading().show();
      this.updateQueryParams();
      const filter = {
        tenantName: this.organization.trim(),
        sn: this.serialNumber.trim(),
        homeName: this.home.trim(),
        roomName: this.room.trim(),
        roomId: this.id.trim(),
        startTime: this.startDate,
        endTime: this.endDate
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
        .getRoomList(filterParams)
        .then((res) => {
          this.roomList = res.records;
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
      this.$http.exportRoomList({
        ...(this.lastFilterSnapshot || {}),
        order: this.order,
        sort: this.sort
      }).then((res) => {
        this.blobUtil(res, `Rooms-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    gotoMember() {
      this.$router.push('/users');
    },
    openNameList(nameList, type) {
      this.showNameListDialog = true;
      this.currentNameList = nameList;
      this.nameListType = type;
    },
    handleSelectedDate(date) {
      const timestamp = new Date(date).getTime();
      if (this.startDate && this.endDate) {
        // 第三次选择日期
        this.startDate = timestamp;
        this.endDate = null;
        return;
      }
      if (!this.startDate) {
        // 当前选择的是起始时间
        this.startDate = timestamp;
      } else if (timestamp >= this.startDate) {
        // 当前选择的是结束时间
        this.endDate = timestamp;
      } else {
        this.startDate = timestamp;
      }
    },
    changedMonth(data) {
      const date = new Date(data);
      this.mouth = this.DatePickerTitle(date);
    },
    handleCloseSelectDate(type) {
      if (type === 'cancel') {
        this.date = null;
        this.showDatePicker = false;
      } else {
        if (this.endDate === null) {
          return;
        }
        // 检查是否大于31天
        const differenceInMilliseconds = Math.abs(
          this.endDate - this.startDate
        );
        const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        const differenceInDays =
          differenceInMilliseconds / millisecondsInOneDay + 1;
        if (differenceInDays > 31) {
          this.$psNotifyMessage().fail(this.$t('queryTimeRangeLimit'));
          return;
        }
        this.lastStartTimestamp = this.startDate;
        this.lastEndTimestamp = this.endDate;
        this.selectedStartDate =
          this.startDateFormatted === '-' ? null : this.startDateFormatted;
        this.selectedEndDate =
          this.endDateFormatted === '-' ? null : this.endDateFormatted;
        this.showDatePicker = false;
      }
      window.removeEventListener('click', this.hideDatePicker);
    },
    handleClearDate() {
      this.today = moment().subtract(1, 'day').startOf('day').toDate();
      this.date = null;
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setDate(now.getDate() - 7);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setDate(now.getDate() - 1);
      endOfDay.setHours(23, 59, 59, 999);
      this.startDate = startOfDay.getTime();
      this.endDate = endOfDay.getTime();
      this.mouth = this.DatePickerTitle(this.today);
    },
    handleDatePicker() {
      const oldStatus = this.showDatePicker;
      this.showDatePicker = !this.showDatePicker;
      if (oldStatus) {
        window.removeEventListener('click', this.hideDatePicker);
      } else {
        this.$nextTick(() => {
          this.updateFixedPosition();
        });
        setTimeout(() => {
          window.addEventListener('click', this.hideDatePicker);
        }, 0);
      }
    },
    updateFixedPosition() {
      let target = document.getElementById('timeSelect');
      let fixedBox = document.getElementById('datePicker');

      if (target && fixedBox) {
        let targetRect = target.getBoundingClientRect();

        if (targetRect.bottom >= 0 && targetRect.bottom <= window.innerHeight) {
          fixedBox.style.top = `${targetRect.bottom + 5}px`;
          fixedBox.style.left = `${targetRect.left}px`;
        } else {
          fixedBox.style.top = `20px`;
        }
      }
    },
    clickDatePicker(event) {
      event.stopPropagation(); // 阻止事件冒泡到 document
    },
    hideDatePicker(event) {
      let targetDiv = document.getElementById('datePicker');
      if (targetDiv && !targetDiv.contains(event.target)) {
        this.handleCloseSelectDate('cancel');
        window.removeEventListener('click', this.hideDatePicker);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rooms__wrapper {
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
      .time-select {
        min-width: 250px;
        height: 36px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.9);
        margin: 0;

        .select {
          width: 100%;
          border: 1px solid transparent;
          border-radius: 20px;
          height: 100%;
          padding: 10px;
          display: flex;
          align-items: center;
          font-size: 15px;
          color: #222e61;
          justify-content: space-between;

          .select-span {
            display: flex;
            align-items: center;
            height: 100%;
          }
        }
        .select:hover{
          border: 1px solid #325bf2;
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
      .btn-view-trends:hover {
        background: #EDEEF3;
      }
      .btn-view-trends {
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
        .el-table__empty-block {
          width: 100% !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .amountNumber {
      text-decoration: underline;
      cursor: pointer;
    }
    .viewPastTrends {
      font-size: 14px;
      font-weight: normal;
      color: #325BF2;
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
  .date-picker__wrapper {
    position: fixed;
    width: 323px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 16px;
    z-index: 100;
    border-radius: 10px;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    .popup {
      position: relative;
      width: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      overflow: hidden;
      ::v-deep .vdp-datepicker {
        width: 100%;

        input {
          display: none;
        }

        .vdp-datepicker__calendar {
          position: relative;
          width: auto;
          border: none;
          flex-direction: column;
          header {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
            height: 22px;
            padding: 0 5px;
            .header__title {
              flex: 1;
              height: 100%;
              font-weight: 600;
              font-size: 17px;
              color: #000000;
              line-height: 22px;
            }

            .day__month_btn {
              display: none;
            }
            .prev:hover {
              opacity: 0.7;
            }
            .prev {
              width: 10px;
              height: 18px;
              background: url("@/assets/icons/ic_left@2x.png") no-repeat center;
              background-size: contain;
              margin-right: 30px;
            }

            .prev::after {
              display: none;
            }
            .next:hover {
              opacity: 0.7;
            }
            .next {
              width: 10px;
              height: 18px;
              background: url("@/assets/icons/ic_left@2x.png") no-repeat center;
              background-size: contain;
              transform: rotate(180deg);
            }

            .next::after {
              display: none;
            }
            .disabled {
              background: url("@/assets/icons/ic_right_disabled.png") no-repeat
                center;
              background-size: contain;
            }
          }
          .calender-header {
            position: absolute;
            font-size: 16px;
            font-weight: 600;
            padding-left: 2px;
          }
          .cell {
            border-radius: 0;
            border: none !important;
          }

          .day-header {
            font-weight: 600;
            font-size: 13px;
            color: rgba(60, 60, 67, 0.3);
          }

          .day {
            font-weight: 400;
            font-size: 14px;
            color: #222e61;
            line-height: 40px;
            text-align: center;
            border-radius: 0;
          }

          .selected {
            background: #e4e8fd;
            border-radius: 0;
            font-weight: 600;
            font-size: 14px;
            color: #325bf2;
            border: none;
            outline: none;
          }

          .highlighted {
            background: rgba(50, 91, 242, 0.1);
          }

          .highlighted.highlight-start,
          .highlighted.highlight-end {
            position: relative;
            color: #ffffff;
            font-weight: 600;
          }

          .highlight-start {
            position: relative;
            background: linear-gradient(
              to right,
              transparent 50%,
              rgba(50, 91, 242, 0.1) 50%
            );
          }

          .highlight-end {
            position: relative;
            background: linear-gradient(
              to right,
              rgba(50, 91, 242, 0.1) 50%,
              transparent 50%
            );
          }
          .highlight-start.highlight-end {
            background: none;
          }

          .highlight-start::after,
          .highlight-end::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            background-color: #325bf2;
            color: #fff;
            z-index: -99;
          }

          .highlighted.sat {
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
          }

          .highlighted.sun {
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
          }

          .prev.disabled {
            background: url("@/assets/icons/ic_right_disabled.png") no-repeat
              center;
            background-size: contain;
            transform: rotate(180deg);
          }
          .next.disabled {
            background: url("@/assets/icons/ic_right_disabled.png") no-repeat
              center;
            background-size: contain;
            transform: rotate(0deg);
          }

          .today {
            color: #325bf2;
            font-weight: 600;
          }

          .disabled {
            color: rgba(34, 46, 97, 0.3);
            cursor: not-allowed;
          }
        }
      }

      .date-choice {
        width: 100%;
        height: 56px;
        .date-span {
          width: 100%;
          height: 100%;
          background: #f7f7fa;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .split-line {
            width: 3px;
            height: 30px;
            border-radius: 20px;
            opacity: 1;
            background: rgba(50, 91, 242, 0.1);
          }

          .choice-start-date,
          .choice-end-date {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            > .label {
              font-size: 14px;
              text-align: center;
              color: #7982a6;
            }

            > .date {
              font-size: 14px;
              font-weight: 600;
              text-align: center;
              color: #222e61;
              margin-top: 4px;
            }
          }
        }
      }

      .btn-group {
        width: 100%;
        height: 48px;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        gap: 5px;
      }
    }
  }
}
</style>
