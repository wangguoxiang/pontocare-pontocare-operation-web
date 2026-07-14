<template>
  <div class="past-trends-dialog__wrapper">
    <div class="popup">
      <div class="title">
        {{$t('pastTrends')}}
        <i class="el-icon-close" style="float: right;cursor: pointer;font-size: 22px" @click="closePopup"></i>
      </div>
      <div class="tool">
        <div class="filter-selector">
          <div class="past-trends-selector" id="organizationSelect">
            <div class="select" @click="showSelectChange($event, 'organization')">
              <div class="select-span" v-if="organizationId !== ''">
                <div class="prefix">{{$t('organization')}}</div>
                <div class="name">{{organizationList.find(item => item.id === organizationId)?.name}}</div>
              </div>
              <div class="placeholder" v-if="organizationId === ''">{{$t('organization')}}</div>
              <div class="icon-calendar"></div>
            </div>
          </div>
        </div>
        <div class="filter-selector">
          <div class="past-trends-selector" id="homeSelect">
            <div class="select" @click="showSelectChange($event, 'home')">
              <div class="select-span" v-if="homeId !== ''">
                <div class="prefix">{{$t('home')}}</div>
                <div class="name">{{homeList.find(item => item.groupId === homeId)?.groupName}}</div>
              </div>
              <div class="placeholder" v-if="homeId === ''">{{$t('home')}}</div>
              <div class="icon-calendar"></div>
            </div>
          </div>
        </div>
        <div class="filter-selector">
          <div class="past-trends-selector" id="roomSelect">
            <div class="select" @click="showSelectChange($event, 'room')">
              <div class="select-span" v-if="roomId !== ''">
                <div class="prefix">{{$t('room')}}</div>
                <div class="name">{{roomList.find(item => item.roomId === roomId)?.roomName}}</div>
              </div>
              <div class="placeholder" v-if="roomId === ''">{{$t('room')}}</div>
              <div class="icon-calendar"></div>
            </div>
          </div>
        </div>
        <div class="time-select" id="timeSelectFilter">
          <div class="select" @click="handleDatePicker">
            <div class="icon-calendar"></div>
            <div
              class="select-span"
              v-if="selectedStartDate && selectedEndDate"
            >
              <div class="start">{{ selectedStartDate }}</div>
              <span style="margin: 0 3px">-</span>
              <div class="end">{{ selectedEndDate }}</div>
            </div>

            <div class="select-span" v-else>{{ $t("date") }}</div>
          </div>
        </div>
        <el-tooltip effect="light"
                    :visible-arrow="false"
                    :content="$t('search')"
                    placement="bottom-end">
          <div class="btn-search" @click="searchList"></div>
        </el-tooltip>
      </div>
      <div class="list" id="echarts" v-show="chartData.xAxisData.length > 0">
      </div>
      <div class="noData" v-show="chartData.xAxisData.length === 0">
        <img src="@/assets/icons/ic_empty.svg" alt="" />
        <div style="margin-top: 20px">{{ $t('noData') }}</div>
      </div>
    </div>
    <div
      class="select__wrapper"
      id="selectWrapper"
      :key="'selectWrapper' + showSelect"
      @click="clickSelect"
      v-if="showSelect"
    >
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
            v-for="(item, index) in showResultList"
            :key="index"
            @click="changeFilter(item)"
          >
            <div class="left">
              <div
                class="name"
                :class="{ selected: filterType === 'organization' ? item.id === organizationId :
                  (filterType === 'home' ? item.groupId === homeId : item.roomId === roomId) }"
              >
                {{ filterType === 'organization' ? item.name :
                  (filterType === 'home' ? item.groupName : item.roomName) }}
              </div>
              <div class="id">{{$t('id')}}: {{ filterType === 'organization' ? item.id :
                (filterType === 'home' ? item.groupId : item.roomId) }}</div>
            </div>
            <div
              class="current"
              v-if="filterType === 'organization' ? item.id === organizationId :
                (filterType === 'home' ? item.groupId === homeId : item.roomId === roomId)"
            ></div>
          </div>
          <div class="noResult" v-if="showResultList.length ===0">
            {{$t('noResults')}}
          </div>
        </div>
      </div>
    </div>
    <div
      class="date-picker__wrapper"
      id="datePicker"
      :key="'datePicker' + showDatePicker"
      @click="clickDatePicker"
      v-if="showDatePicker"
    >
      <div class="datePicker-popup">
        <div class="date-content">
          <div class="left">
            <div class="btn-past-date"
                 :class="{'selected': selectedDateType === 'month'}"
                 style="margin-bottom: 6px"
                 @click="selectPastDate('month')">
              {{ $t("pastMonth") }}
            </div>
            <div class="btn-past-date" :class="{'selected': selectedDateType === 'week'}" @click="selectPastDate('week')">
              {{ $t("pastWeek") }}
            </div>
          </div>
          <div class="right">
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
          </div>
        </div>

        <div class="btn-group">
          <CancelButton :height="36" :text="$t('cancel')" @click.native="handleCloseSelectDate('cancel')" />
          <CancelButton :height="36" :text="$t('reset')" @click.native="handleClearDate" />
          <ConfirmButton :height="36" :text="$t('ok')" @click.native="handleCloseSelectDate('ok')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DatePickerTitle, formatYMDTime, secondsToHours, getCurrentLanguage } from '@/utils';
import Datepicker from 'vuejs-datepicker';
import { zh, en, fi, ja } from 'vuejs-datepicker/dist/locale';
import moment from 'moment';
import * as echarts from 'echarts';
export default {
  components: {
    Datepicker
  },
  props: {
    currentRoomId: {
      type: [String, Number],
      default: ''
    },
    currentHomeId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      lang: getCurrentLanguage(),
      zh,
      en,
      fi,
      ja,
      organizationId: '',
      homeId: '',
      roomId: '',
      organizationList: [],
      homeList: [],
      roomList: [],

      showSelect: false,
      filterType: '',
      filterContent: '',

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

      chart: null,
      chartData: {
        legendData: [this.$t('occupancyHours'), this.$t('fallsDetected'), this.$t('fpReported'), this.$t('deviceErrorNotifications'), this.$t('offlineHours'), this.$t('offlineCount')],
        colorData: ['#8EA5F8', '#E03A3A', '#FFD034', '#BF7FF0', '#979797', '#49DF5D'],
        xAxisData: [],
        seriesData: []
      },
      selectedDateType: 'week',
      tempSelectedDateType: ''
    };
  },
  computed: {
    showResultList() {
      if (this.filterType === 'organization') {
        return this.showOrganizationList;
      } else if (this.filterType === 'home') {
        return this.showHomeList;
      } else if (this.filterType === 'room') {
        return this.showRoomList;
      }
      return [];
    },
    showOrganizationList() {
      if (this.filterType === 'organization') {
        return this.organizationList.filter((item) => {
          return String(item.id).includes(this.filterContent.trim().toLowerCase()) ||
            item.name.toLowerCase().includes(this.filterContent.trim().toLowerCase());
        });
      }
      return this.organizationList;
    },
    showHomeList() {
      if (this.filterType === 'home') {
        return this.homeList.filter((item) => {
          return String(item.groupId).includes(this.filterContent.trim().toLowerCase()) ||
            item.groupName.toLowerCase().includes(this.filterContent.trim().toLowerCase());
        });
      }
      return this.homeList;
    },
    showRoomList() {
      if (this.filterType === 'room') {
        return this.roomList.filter((item) => {
          return String(item.roomId).includes(this.filterContent.trim().toLowerCase()) ||
            item.roomName.toLowerCase().includes(this.filterContent.trim().toLowerCase());
        });
      }
      return this.homeList;
    },
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
    }
  },
  watch: {
    showDatePicker(newValue) {
      if (newValue) {
        this.tempSelectedDateType = this.selectedDateType;
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
  mounted() {
    this.chart = echarts.init(document.getElementById('echarts'));
    this.initData();
    window.addEventListener('resize', this.updatePosition);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideSelect);
    window.removeEventListener('resize', this.updatePosition);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    DatePickerTitle,
    formatYMDTime,
    secondsToHours,
    initData() {
      this.initDate(true, 'week');
      this.$psPageLoading().show();
      this.$http.getAllRegisteredClientList()
        .then((res) => {
          this.organizationList = res.records;
          if (this.organizationList && this.organizationList.length > 0) {
            let currentOrganization = null;
            if (this.currentHomeId) {
              currentOrganization = this.organizationList.find((item) => {
                return item.homes && item.homes.length > 0 && item.homes.findIndex(item => item.groupId === this.currentHomeId) > -1;
              });
            } else {
              // 找到第一个有home的organization
              currentOrganization = this.organizationList.find((item) => {
                return item.homes && item.homes.length > 0;
              });
            }
            if (currentOrganization) {
              this.organizationId = currentOrganization.id;
              this.homeList = currentOrganization.homes;
              this.homeId = this.currentHomeId ? this.currentHomeId : this.homeList[0].groupId;
              if (!this.currentRoomId) {
                this.getStatisticsData();
              }
              this.getAllRoomListByHome();
            }
          }
        }).finally(() => {
          this.$psPageLoading().hide();
        });
    },
    initDate(isInit, type) {
      this.date = null;
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setDate(now.getDate() - (type === 'week' ? 7 : 30));
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setDate(now.getDate() - 1);
      endOfDay.setHours(23, 59, 59, 999);
      this.startDate = startOfDay.getTime();
      this.endDate = endOfDay.getTime();
      if (isInit) {
        this.lastStartTimestamp = startOfDay.getTime();
        this.lastEndTimestamp = endOfDay.getTime();
        this.selectedStartDate =
          this.startDateFormatted === '-' ? null : this.startDateFormatted;
        this.selectedEndDate =
          this.endDateFormatted === '-' ? null : this.endDateFormatted;
      }
    },
    adjustDate() {
      const startUserTimezone = new Date(this.lastStartTimestamp).getTimezoneOffset();
      const endUserTimezone = new Date(this.lastEndTimestamp).getTimezoneOffset();
      this.startDate = this.lastStartTimestamp
        ? moment(this.lastStartTimestamp).startOf('day').add(endUserTimezone - startUserTimezone, 'minutes').valueOf()
        : '';
      this.endDate = this.lastEndTimestamp
        ? moment(this.lastEndTimestamp).endOf('day').valueOf()
        : '';
    },
    getAllRoomListByHome() {
      this.$psPageLoading().show();
      this.$http.getAllRoomListByHome(this.homeId)
        .then((res) => {
          if (res.records && res.records.length > 0) {
            this.roomList = res.records.find(item => item.id === this.homeId)?.rooms || [];
            if (this.roomList.length > 0 && this.currentRoomId) {
              this.roomId = this.currentRoomId;
              this.getStatisticsData();
            }
          } else {
            this.roomList = [];
          }
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    searchList() {
      this.getStatisticsData();
    },
    handleData(data) {
      this.chartData.xAxisData = [];
      this.chartData.seriesData = [];
      if (data && data.length > 0) {
        let occupancyHoursData = [];
        let fallsDetectedData = [];
        let fpReportedData = [];
        let deviceErrorNotificationsData = [];
        let offlineHoursData = [];
        let offlineCountData = [];
        data.forEach(item => {
          let userTimezone = new Date(item.cycleTime).getTimezoneOffset();
          let endUserTimezone = new Date(this.endDate).getTimezoneOffset();
          this.chartData.xAxisData.push(this.formatYMDTime(item.cycleTime - (endUserTimezone - userTimezone) * 60 * 1000));
          occupancyHoursData.push(this.secondsToHours(item.totalOccupany));
          fallsDetectedData.push(item.fallCount);
          fpReportedData.push(item.fpReported);
          deviceErrorNotificationsData.push(item.deviceErrorNotifications);
          offlineHoursData.push(this.secondsToHours(item.offline));
          offlineCountData.push(item.offlineCount);
        });
        this.chartData.seriesData = [occupancyHoursData, fallsDetectedData, fpReportedData, deviceErrorNotificationsData, offlineHoursData, offlineCountData];
      }
    },
    initEcharts() {
      if (this.chartData.xAxisData.length > 0) {
        const series = [];
        for (let i = 0; i < this.chartData.legendData.length; i++) {
          series.push({
            name: this.chartData.legendData[i],
            type: 'line',
            data: this.chartData.seriesData[i],
            smooth: true,
            showSymbol: this.chartData.xAxisData.length === 1,
            emphasis: { // 悬停时显示
              showSymbol: true,
              symbolSize: 10
            },
            itemStyle: {
              color: this.chartData.colorData[i]
            }
          });
        }
        if (this.chart === null) { // 后端接口还没返回数据时关闭弹框，此时chart会被重置为null
          return;
        }
        this.$nextTick(() => {
          this.chart.resize();
          this.chart.setOption({
            tooltip: {
              trigger: 'axis',
              formatter: (params) => {
                let result = `<div style="font-size: 14px;font-weight: 600;color: #222E61">${params[0].name}</div>`;
                for (const paramInfo of params) {
                  result += `<div style="display: flex;font-size: 14px;font-weight: normal;color: #222E61;margin-top: 2px">
                                      <div>${paramInfo.marker}</div>
                                      <div>${paramInfo.seriesName}:</div>
                                      <div style="margin-left: 6px">${paramInfo.data}</div>
                                   </div>`;
                }
                return result;
              }
            },
            legend: {
              data: this.chartData.legendData,
              left: '0%',
              top: '5%',
              icon: 'circle',
              itemGap: 15,
              itemHeight: 16,
              textStyle: {
                fontSize: 12,
                fontWeight: 600,
                color: '#666F99',
                padding: [0, 0, 0, -5],
                lineHeight: 16
              }
            },
            grid: {
              left: '1%',
              right: '2.1%',
              bottom: '0%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: this.chartData.xAxisData,
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#666F99',
                  fontSize: 12
                }
              },
              axisLine: {
                show: true, // 是否显示X轴线
                lineStyle: {
                  color: 'rgba(22, 35, 71, 0.06)' // 设置颜色
                }
              }
            },
            yAxis: {
              type: 'value',
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#292D3D',
                  fontSize: 13
                }
              }
            },
            series: series
          });
        });
      }
    },
    getStatisticsData() {
      if (!this.homeId && !this.roomId) {
        this.handleData([]);
        return;
      }
      this.adjustDate();
      this.$psPageLoading().show();
      this.$http.getStatisticsData(this.homeId, this.roomId, this.startDate, this.endDate, 3)
        .then((res) => {
          this.handleData(res);
          this.initEcharts();
        }).finally(() => {
          this.$psPageLoading().hide();
        });
    },
    closePopup() {
      this.$emit('closePopup');
    },
    clickSelect(event) {
      event.stopPropagation(); // 阻止事件冒泡到 document
    },
    changeFilter(item) {
      this.showSelect = false;
      window.removeEventListener('click', this.hideSelect);
      if (this.filterType === 'organization') {
        this.roomId = '';
        this.roomList = [];
        this.organizationId = item.id;
        this.homeList = item.homes || [];
        if (this.homeList && this.homeList.length > 0) {
          this.homeId = this.homeList[0].groupId;
          this.getAllRoomListByHome();
        } else {
          this.homeId = '';
        }
      } else if (this.filterType === 'home') {
        this.homeId = item.groupId;
        this.roomId = '';
        this.roomList = [];
        this.getAllRoomListByHome();
      } else {
        this.roomId = item.roomId;
      }
    },
    showSelectChange(event, type) {
      event.stopPropagation(); // 阻止事件冒泡到 document

      this.filterContent = '';
      const oldStatus = this.showSelect;
      if (oldStatus && this.filterType === type) {
        this.showSelect = false;
        this.filterType = '';
        window.removeEventListener('click', this.hideSelect);
      } else {
        this.showSelect = true;
        this.filterType = type;
        this.$nextTick(() => {
          this.updateFixedPosition();
          const targetElement = document.querySelector('.current');
          if (targetElement) {
            targetElement.scrollIntoView({
              top: 200,
              behavior: 'auto',
              block: 'center'
            });
          }
        });
        setTimeout(() => {
          window.addEventListener('click', this.hideSelect);
        }, 0);
      }
    },
    hideSelect(event) {
      this.filterType = '';
      let targetDiv = document.getElementById('selectWrapper');
      if (targetDiv && !targetDiv.contains(event.target)) {
        this.showSelect = false;
        window.removeEventListener('click', this.hideSelect);
      }
    },
    updatePosition() {
      this.updateFixedPosition();
      this.updateDatePickerFixedPosition();
    },
    updateFixedPosition() {
      let target = null;
      if (this.filterType === 'organization') {
        target = document.getElementById('organizationSelect');
      } else if (this.filterType === 'home') {
        target = document.getElementById('homeSelect');
      } else {
        target = document.getElementById('roomSelect');
      }
      let fixedBox = document.getElementById('selectWrapper');

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
    handleDatePicker() {
      const oldStatus = this.showDatePicker;
      this.showDatePicker = !this.showDatePicker;
      if (oldStatus) {
        window.removeEventListener('click', this.hideDatePicker);
      } else {
        this.$nextTick(() => {
          this.updateDatePickerFixedPosition();
        });
        setTimeout(() => {
          window.addEventListener('click', this.hideDatePicker);
        }, 0);
      }
    },
    updateDatePickerFixedPosition() {
      let target = document.getElementById('timeSelectFilter');
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
    },
    handleSelectedDate(date) {
      this.selectedDateType = '';
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
        this.endDate = moment(timestamp).endOf('day').valueOf();
      } else {
        this.startDate = timestamp;
      }
    },
    changedMonth(data) {
      const date = new Date(data);
      this.mouth = this.DatePickerTitle(date);
    },
    handleClearDate() {
      this.selectedDateType = 'week';
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
    selectPastDate(type) {
      this.selectedDateType = type;
      this.initDate(false, type);
    },
    handleCloseSelectDate(type) {
      if (type === 'cancel') {
        this.selectedDateType = this.tempSelectedDateType;
        this.date = null;
        this.showDatePicker = false;
      } else {
        if (this.endDate === null) {
          return;
        }
        // 检查是否大于31天
        let differenceInMilliseconds = Math.abs(this.endDate - this.startDate);
        const startUserTimezone = new Date(this.startDate).getTimezoneOffset();
        const endUserTimezone = new Date(this.endDate).getTimezoneOffset();
        if (endUserTimezone > startUserTimezone) {
          // 夏令时 → 冬令时，由于当天会多一些时间出来（即时令差），要把这段时间减掉
          differenceInMilliseconds = differenceInMilliseconds - (endUserTimezone - startUserTimezone) * 60 * 1000;
        }
        const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        const differenceInDays = differenceInMilliseconds / millisecondsInOneDay + 1;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.past-trends-dialog__wrapper {
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
    width: 880px;
    background: #F3F4F7;
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
      margin-top: 20px;
      gap: 6px;
      .filter-selector {
        width: 140px;
        height: 36px;
        .past-trends-selector {
          width: 140px;
          height: 36px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          margin: 0;
          cursor: pointer;
          .error-input {
            border: 2px solid #ff2c50 !important;
          }
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
              padding: 16px 25px 4px 10px;
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
              .prefix-status {
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
      .time-select {
        min-width: 250px;
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
          padding: 10px;
          display: flex;
          align-items: center;
          font-size: 15px;
          color: #222e61;
          gap: 6px;
          .icon-calendar {
            width: 24px;
            height: 24px;
            background: url("@/assets/icons/ic_calendar.svg") no-repeat
            center;
            background-size: contain;
          }

          .select-span {
            display: flex;
            align-items: center;
            height: 100%;
          }
        }
      }
      .btn-search:hover {
        background-color: rgba(187, 197, 232, 0.6);
      }
      .btn-search {
        width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        cursor: pointer;
        background: url("@/assets/icons/ic_search.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
    }
    .list {
      height: 350px;
    }
    .noData {
      height: 350px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .select__wrapper {
    position: fixed;
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
  .date-picker__wrapper {
    position: fixed;
    min-width: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    border-radius: 10px;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    .datePicker-popup {
      position: relative;
      width: 100%;
      background: #fff;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .date-content {
        display: flex;
        border-bottom: 1px solid #F7F7FA;
        .left {
          flex: 1;

          padding: 12px;
          border-right: 1px solid #F7F7FA;
          .btn-past-date:hover {
            background-color: rgba(50, 91, 242, 0.19);
          }
          .selected:hover {
            background-color: rgba(50, 91, 242, 0.6) !important;
            color: #fff !important;
          }
          .selected {
            background-color: #325BF2 !important;
            color: #fff !important;
          }
          .btn-past-date {
            flex: 1;
            height: 37px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: pointer;
            padding: 10px;
            background-color: rgba(50, 91, 242, 0.06);
          }
        }
        .right {
          padding: 14px 16px 10px 12px;
          ::v-deep .vdp-datepicker {
            width: 291px;

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
                border-radius: 100%;
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
            width: 291px;
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
        }
      }

      .btn-group {
        width: 100%;
        height: 48px;
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding: 0 16px;
        gap: 10px;
      }
    }
  }
}
</style>
