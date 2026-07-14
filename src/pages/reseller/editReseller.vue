<template>
  <div class="edit-reseller">
    <div class="popup">
      <div class="title">
        {{ isEdit ? $t("reseller0005") : $t("reseller0016") }}
      </div>
      <div class="form-item">
        <div class="label">{{ $t("reseller0001") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="name"
          @focus="handleNameFocus"
          @blur="handleNameBlur"
          maxlength="200"
          :class="{ 'error-input': nameError }"
        >
        </el-input>
        <div class="error-text" v-if="nameError">{{ nameErrorText }}</div>
      </div>

      <div class="form-item">
        <div class="label">{{ $t("email") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="email"
          @focus="handleEmailFocus"
          @blur="handleEmailBlur"
          maxlength="128"
          :class="{ 'error-input': emailError }"
        >
        </el-input>
        <div class="error-text" v-if="emailError">{{ emailErrorText }}</div>
      </div>

      <div class="form-item">
        <div class="label">{{ $t("reseller0002") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="number"
          maxlength="32"
        >
        </el-input>
      </div>
      <div class="form-item price-item">
        <div class="label">{{ $t("reseller0004") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="activationFee"
          @focus="handlePriceFocus('activationFee')"
          @blur="checkPrice('activationFee')"
          @input="handlePriceInput('activationFee')"
          :class="{ 'error-input': activationFeeError }"
        >
          <div slot="suffix" class="currency-select">
            <el-select
              v-model="currency"
              :disabled="isEdit"
              popper-class="mark-selector"
            >
              <el-option
                v-for="item in currencyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-input>
        <div class="error-text" v-if="activationFeeError">
          {{ activationFeeErrorText }}
        </div>
      </div>

      <div class="form-item price-item">
        <div class="label">{{ $t("reseller0003") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="monthlyFee"
          @focus="handlePriceFocus('monthlyFee')"
          @blur="checkPrice('monthlyFee')"
          @input="handlePriceInput('monthlyFee')"
          :class="{ 'error-input': monthlyFeeError }"
        >
          <div slot="suffix" class="currency-select">
            <el-select
              v-model="currency"
              :disabled="isEdit"
              popper-class="mark-selector"
            >
              <el-option
                v-for="item in currencyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-input>
        <div class="error-text" v-if="monthlyFeeError">
          {{ monthlyFeeErrorText }}
        </div>
      </div>

      <div class="form-item">
        <div class="label">{{ $t("note") }}</div>
        <el-input
          type="textarea"
          resize="none"
          :rows="3"
          :placeholder="$t('pleaseEnter')"
          maxlength="500"
          v-model="note"
        >
        </el-input>
      </div>

      <div class="btn-group">
        <CancelButton
          :text="$t('cancel')"
          :width="175"
          :height="36"
          @click.native="handleCancel"
        >
        </CancelButton>

        <ConfirmButton
          :text="$t('save')"
          :width="175"
          :height="36"
          :isDisabled="btnDisable"
          @click.native="handleSubmit"
        >
        </ConfirmButton>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HandleReseller',
  props: {
    isEdit: Boolean,
    currentReseller: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currencyList: [
        {
          label: this.$t('price0004'),
          value: 'usd'
        }
      ],
      email: '',
      emailError: false,
      emailErrorText: '',

      name: '',
      nameError: false,
      nameErrorText: '',

      number: '',

      price: '',
      priceError: false,
      priceErrorText: '',

      monthlyFee: '',
      monthlyFeeError: false,
      monthlyFeeErrorText: '',

      activationFee: '',
      activationFeeError: false,
      activationFeeErrorText: '',

      currency: 'usd',

      note: ''
    };
  },
  mounted() {
    if (this.isEdit) {
      this.email = this.currentReseller.email || '';
      this.name = this.currentReseller.name || '';
      this.number = this.currentReseller.phone || '';
      this.note = this.currentReseller.note || '';
      if (this.currentReseller.prices) {
        this.monthlyFee = (
          this.currentReseller.prices.find((item) => item.resourceId === 20)
            .amount / 100
        ).toFixed(2);
        this.activationFee = (
          this.currentReseller.prices.find((item) => item.resourceId === 10)
            .amount / 100
        ).toFixed(2);
        this.currency = this.currentReseller.prices[0]?.currency || 'usd';
      }
    }
  },
  computed: {
    emailEmpty() {
      return this.email.length > 0;
    },
    // 邮箱长度校验
    emailLength() {
      return this.email.length <= 100;
    },
    // 邮箱格式校验
    emailFormat() {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(String(this.email).toLowerCase());
    },
    btnDisable() {
      if (this.isEdit) {
        return (
          this.name === '' ||
          this.nameError ||
          this.emailError
        );
      } else {
        return (
          this.name === '' ||
          this.nameError ||
          this.emailError ||
          this.monthlyFee === '' ||
          this.monthlyFeeError ||
          this.activationFee === '' ||
          this.activationFeeError
        );
      }
    }
  },
  methods: {
    handleNameFocus() {
      this.nameError = false;
    },
    handleNameBlur() {
      this.name = this.name.trim();
      this.checkName();
    },
    checkName() {
      if (this.name.length === 0) {
        this.nameErrorText = this.$t('nameNotEmpty');
        this.nameError = true;
        return;
      }
      if (this.name.length > 200) {
        this.nameErrorText = this.$t('lengthMax', { length: 200 });
        this.nameError = true;
        return;
      }
      this.nameErrorText = '';
      this.nameError = false;
    },
    handleEmailFocus() {
      this.emailError = false;
    },
    handleEmailBlur() {
      this.email = this.email.trim(); // 去除邮箱前后空格
      this.checkEmail();
    },
    checkEmail() {
      if (this.email === '' || this.email == null) {
        this.emailErrorText = '';
        this.emailError = false;
        return;
      }
      if (!this.emailFormat) {
        this.emailErrorText = this.$t('emailIllegal');
        this.emailError = true;
        return;
      }
      this.emailErrorText = '';
      this.emailError = false;
    },

    handlePriceFocus(type) {
      if (type === 'monthlyFee') {
        this.monthlyFeeError = false;
      } else {
        this.activationFeeError = false;
      }
    },

    // 限制输入最多两位小数（输入时不强制格式化，以提升输入体验）
    handlePriceInput(type) {
      if (type === 'monthlyFee') {
        let input = String(this.monthlyFee);
        // 仅保留数字和小数点
        input = input.replace(/[^\d.]/g, '');
        // 若以小数点开头，补 0
        if (input.startsWith('.')) input = '0' + input;
        // 仅保留第一个小数点
        const firstDot = input.indexOf('.');
        if (firstDot !== -1) {
          const integerPart = input.slice(0, firstDot);
          const decimalRaw = input.slice(firstDot + 1).replace(/\./g, '');
          const decimalPart = decimalRaw.slice(0, 2); // 最多两位
          input = integerPart + '.' + decimalPart;
        } else {
          // 没有小数点，去除前导的多余小零但保留单个 0
          input = input.replace(/^0+(\d)/, '$1');
        }
        this.monthlyFee = input;
      } else {
        let input = String(this.activationFee);
        // 仅保留数字和小数点
        input = input.replace(/[^\d.]/g, '');
        // 若以小数点开头，补 0
        if (input.startsWith('.')) input = '0' + input;
        // 仅保留第一个小数点
        const firstDot = input.indexOf('.');
        if (firstDot !== -1) {
          const integerPart = input.slice(0, firstDot);
          const decimalRaw = input.slice(firstDot + 1).replace(/\./g, '');
          const decimalPart = decimalRaw.slice(0, 2); // 最多两位
          input = integerPart + '.' + decimalPart;
        } else {
          // 没有小数点，去除前导的多余小零但保留单个 0
          input = input.replace(/^0+(\d)/, '$1');
        }
        this.activationFee = input;
      }
    },
    checkPrice(type) {
      if (type === 'monthlyFee') {
        if (this.monthlyFee == '') {
          this.monthlyFeeErrorText = this.$t('priceNotEmpty');
          this.monthlyFeeError = true;
          return;
        }
        if (this.monthlyFee > 999999.99) {
          this.monthlyFeeErrorText = this.$t('reseller0028');
          this.monthlyFeeError = true;
          return;
        }
        if (!this.isEdit && this.monthlyFee < 0.01) {
          this.monthlyFeeErrorText = this.$t('price0007');
          this.monthlyFeeError = true;
          return;
        }
        this.monthlyFeeErrorText = '';
        this.monthlyFeeError = false;
      } else {
        if (this.activationFee == '') {
          this.activationFeeErrorText = this.$t('priceNotEmpty');
          this.activationFeeError = true;
          return;
        }
        if (this.activationFee > 999999.99) {
          this.activationFeeErrorText = this.$t('reseller0028');
          this.activationFeeError = true;
          return;
        }
        if (!this.isEdit && this.activationFee < 0.01) {
          this.activationFeeErrorText = this.$t('price0007');
          this.activationFeeError = true;
          return;
        }
        this.activationFeeErrorText = '';
        this.activationFeeError = false;
      }
    },
    handleCancel() {
      this.$emit('cancelAdd');
    },
    handleSubmit() {
      this.checkPrice('monthlyFee');
      this.checkPrice('activationFee');

      this.checkName();
      this.checkEmail();
      if (this.btnDisable) return;
      const params = {
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.number.trim(),
        note: this.note.trim(),
        prices: [
          {
            amount: this.toMinorUnits(this.monthlyFee),
            resourceId: 20,
            currency: this.currency
          },
          {
            amount: this.toMinorUnits(this.activationFee),
            resourceId: 10,
            currency: this.currency
          }
        ]
      };
      // 编辑
      if (this.isEdit) {
        this.$http
          .editResellerInfo(this.currentReseller.id, params)
          .then(() => {
            this.$emit('cancelAdd', true);
          });
      } else {
        // 新建
        this.$http.addReseller(params).then(() => {
          this.$emit('cancelAdd', true);
        });
      }
    },
    // 处理精度丢失
    toMinorUnits(num, decimals = 2) {
      if (num === null || num === undefined || num === '') return 0;

      const str = String(num);

      // 小数点位置
      const dotIndex = str.indexOf('.');
      let result;

      if (dotIndex === -1) {
        // 没有小数，直接补零
        result = BigInt(str) * BigInt(10 ** decimals);
      } else {
        // 整数部分 + 小数部分
        const intPart = str.slice(0, dotIndex);
        let decimalPart = str.slice(dotIndex + 1);

        if (decimalPart.length < decimals) {
          decimalPart = decimalPart.padEnd(decimals, '0');
        } else {
          decimalPart = decimalPart.slice(0, decimals);
        }

        result = BigInt(intPart + decimalPart);
      }

      return Number(result);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-reseller {
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
    width: 400px;
    background: #f3f4f7;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;

    .title {
      font-weight: 600;
      font-size: 16px;
      color: #222e61;
      line-height: 19px;
    }

    .form-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .desc {
        margin-top: 5px;
        font-size: 14px;
        font-weight: normal;
        color: #7982a6;
      }
      .label {
        font-weight: 500;
        font-size: 14px;
        color: #222e61;
        line-height: 16px;
        display: flex;
      }
      ::v-deep .el-input {
        height: 36px;
        margin-top: 6px;
        .el-input__inner {
          border: 1px solid transparent;
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

      ::v-deep .el-textarea {
        margin-top: 6px;
        .el-textarea__inner {
          border: 1px solid transparent;
          border-radius: 20px;
        }
        .el-textarea__inner::placeholder {
          font-weight: 400;
          font-size: 14px;
          color: #7982a6;
          line-height: 16px;
        }
        .el-textarea__inner:hover {
          border: 1px solid #325bf2;
        }
        .el-textarea__inner:focus {
          border: 2px solid #325bf2;
        }
      }

      .error-text {
        font-weight: 400;
        font-size: 12px;
        color: #ff2c50;
        line-height: 14px;
        margin-top: 4px;
      }

      .error-input {
        ::v-deep .el-input__inner {
          border: 2px solid #ff2c50;
        }
      }
    }
    .price-item {
      ::v-deep .el-input {
        .el-input__inner {
          padding: 0 80px 0 15px;
        }
        .el-input__suffix {
          width: unset;
          height: unset;
          top: 50%;
          transform: translateY(-50%);
          right: 3px;
          .el-input__suffix-inner {
            .currency-select {
              width: 65px;
              height: 32px;

              .el-select {
                width: 100%;
                height: 100%;
                .el-input {
                  height: 100%;
                  margin-top: unset;
                  .el-input__inner {
                    height: 100%;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid transparent;
                    font-weight: 500;
                    font-size: 14px;
                    color: #222e61;
                    padding: 0 0 0 2px;
                  }
                  .el-input__prefix {
                    left: 10px;
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;

      .btn-cancel,
      .btn-save {
        width: 175px;
        height: 36px;
        cursor: pointer;
      }

      .btn-cancel {
        border-radius: 10px;
        border: 1px solid #b9bcca;
        font-weight: 400;
        font-size: 14px;
        color: #222e61;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-save {
        background: linear-gradient(90deg, #1c21e4 0%, #4895ff 100%);
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
