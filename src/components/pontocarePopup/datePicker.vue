<template>
  <div class="date-picker__wrapper" :style="divStyle">
    <div class="popup">
      <datepicker
        placeholder="Select Date"
        @selected="handleSelected"
        @changedMonth="changedMonth"
        v-model="date"
        :open-date="today"
        :disabled-dates="disabledDates"
        maximum-view="day"
        initial-view="day"
        :language="
          lang === 'zh' ? zh : lang === 'fi' ? fi : lang === 'ja' ? ja : en
        "
      >
      </datepicker>
      <div class="btn-group">
        <CancelButton :width="160"
                      :height="36"
                      :text="$t('cancel')"
                      @click.native="handleClose" />
        <ConfirmButton :widht="160"
                       :height="36"
                       :text="$t('ok')"
                       @click.native="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import { zh, en, fi, ja } from 'vuejs-datepicker/dist/locale';
import { DatePickerTitle, getCurrentLanguage } from '@/utils/index';
import moment from 'moment';
export default {
  name: 'DatePicker',
  props: {
    selectedTimestamp: [String, Number],
    clickX: [String, Number],
    clickY: [String, Number]
  },
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
      date: null,
      currentYear: '',
      currentMounth: '',
      pickerTitle: null,
      today: new Date(),
      disabledDates: {
        // 禁用的自定义规则
        from: moment().add(0, 'day').toDate() // 禁用明天及以后的日期
      }
    };
  },
  computed: {
    divStyle() {
      const viewportHeight = window.innerHeight;
      const maxTop = viewportHeight - 400;
      const top = Math.min(this.clickY, maxTop);
      return {
        top: `${top}px`,
        left: `${this.clickX}px`
      };
    }
  },
  watch: {
    selectedTimestamp: {
      handler(newVal) {
        if (!newVal) return;
        this.date = new Date(newVal);
        this.getCurrentPickerTitle();
      },
      immediate: true
    }
  },
  mounted() {
    this.date = new Date(this.selectedTimestamp);
    const calendar = document.querySelectorAll('.vdp-datepicker__calendar')[0];
    calendar.style.display = 'block';
    const header = calendar.querySelector('header');
    const newElement = document.createElement('div');
    newElement.classList.add('header__title');
    // 将新元素添加到 header 中
    header.insertBefore(newElement, header.firstChild);
    this.pickerTitle = newElement;
    this.$nextTick(() => {
      this.getCurrentPickerTitle();
    });
    setTimeout(() => {
      window.addEventListener('click', this.hideDatePicker);
    }, 0);
  },
  methods: {
    DatePickerTitle,
    getCurrentPickerTitle() {
      const title = this.DatePickerTitle(this.selectedTimestamp);
      if (this.pickerTitle) {
        this.pickerTitle.innerText = title;
      }
    },
    changedMonth(data) {
      const date = new Date(data);
      const title = this.DatePickerTitle(date);
      this.pickerTitle.innerText = title;
    },
    formatDate(date) {
      return date ? date.getTime() : null;
    },
    handleSelected(date) {
      const timestamp = new Date(date).getTime();
      this.date = timestamp;
    },
    handleClose(e) {
      this.$emit('closeDatePicker');
      window.removeEventListener('click', this.hideDatePicker);
    },
    handleConfirm() {
      this.$emit('selectedDate', this.date);
    },
    hideDatePicker(event) {
      let targetDiv = document.querySelector('.date-picker__wrapper');
      if (targetDiv && !targetDiv.contains(event.target)) {
        this.$emit('closeDatePicker');
        window.removeEventListener('click', this.hideDatePicker);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.date-picker__wrapper {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.1);
  z-index: 2;
  .popup {
    position: relative;
    width: 100%;
    height: 100%;
    ::v-deep .vdp-datepicker {
      position: relative;
      width: 100%;
      height: 100%;
      input {
        display: none;
      }

      .vdp-datepicker__calendar {
        position: relative;
        width: 360px;
        border: 0 !important;
        padding: 14px 14px 20px 14px;
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
            font-size: 16px;
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

        .cell {
          border-radius: 100%;
          border: 1px solid transparent !important;
          height: 30px;
        }

        .day-header {
          font-weight: 600;
          font-size: 12px;
          color: rgba(60, 60, 67, 0.3);
        }

        .day {
          font-weight: 400;
          font-size: 14px;
          color: #222e61;
          line-height: 30px;
          text-align: center;
          border-radius: 100%;
          margin-top: 10px;
        }

        .selected {
          background: #325bf2;
          border-radius: 22px;
          font-weight: 600;
          font-size: 14px;
          color: #e4e8fd !important;
          border: none;
          outline: none;
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
    .btn-group {
      display: flex;
      justify-content: space-between;
      margin: 0 16px 20px 16px;
    }
  }
}
</style>
