<template>
  <div class="add-new-member">
    <div class="popup">
      <div class="title">
        {{ isEdit ? $t("editClient") : $t("addNewClient") }}
      </div>
      <div class="form-item">
        <div class="label">
          <span>{{ $t("organizationName") }}</span>
          <el-tooltip
            effect="light"
            :content="$t('organizationNameTip')"
            placement="right"
          >
            <div class="form-icon-help"></div>
          </el-tooltip>
        </div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="name"
          @focus="handleNameFocus"
          @blur="handleNameBlur"
          :class="{ 'error-input': nameError }"
        >
        </el-input>
        <div class="error-text" v-if="nameError">{{ nameErrorText }}</div>
      </div>
      <div class="form-item" v-if="type === 0">
        <div class="label">
          <div>{{ $t("loginEmail") }}</div>
          <el-tooltip effect="light" placement="right">
            <div slot="content">
              {{ $t("loginEmailTip1") }}<br />
              <span v-if="!isEdit">{{ $t("loginEmailTip2") }}</span>
            </div>
            <div class="form-icon-help"></div>
          </el-tooltip>
        </div>
        <el-input
          v-if="!isEdit"
          :placeholder="$t('pleaseEnter')"
          v-model="email"
          @focus="handleEmailFocus"
          @blur="handleEmailBlur"
          :class="{ 'error-input': emailError }"
        >
        </el-input>
        <div v-else class="desc">{{ email }}</div>
        <div class="error-text" v-if="emailError">{{ emailErrorText }}</div>
      </div>
      <div class="form-item" v-if="type === 0">
        <div class="label">
          <span>{{ $t("role") }}</span>
          <el-tooltip effect="light" :content="$t('roleTip')" placement="right">
            <div class="form-icon-help"></div>
          </el-tooltip>
        </div>
        <div class="role-select" v-if="!isEdit">
          <div
            class="role-item"
            :class="{ active: isDistributor }"
            @click="selectRole('distributor')"
          >
            <div class="select-icon" v-if="isDistributor"></div>
            {{ $t("distributor") }}
          </div>
          <div
            class="role-item"
            :class="{ active: isTenant }"
            @click="selectRole('tenant')"
          >
            <div class="select-icon" v-if="isTenant"></div>
            {{ $t("tenant") }}
          </div>
        </div>
        <div class="desc" v-else>{{ parseRole() }}</div>
        <div class="error-text" v-if="roleError">{{ roleErrorText }}</div>
      </div>
      <div class="form-item" v-if="type === 0">
        <div class="label">
          <span>{{ $t("accountExecutive") }}</span>
          <el-tooltip
            effect="light"
            :content="$t('organizationAccountExecutiveTip')"
            placement="right"
          >
            <div class="form-icon-help"></div>
          </el-tooltip>
        </div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="accountExecutive"
          @focus="handleAccountExecutiveFocus"
          @blur="handleAccountExecutiveBlur"
          :class="{ 'error-input': accountExecutiveError }"
        >
        </el-input>
        <div class="error-text" v-if="accountExecutiveError">
          {{ accountExecutiveErrorText }}
        </div>
      </div>
      <div class="form-item price-item" v-if="type === 0">
        <div class="label">{{ $t("reseller0004") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="activationFee"
          :disabled="isDisablePrice"
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
                v-for="item in CurrencyList"
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
      <div class="form-item price-item" v-if="type === 0">
        <div class="label">{{ $t("reseller0003") }}</div>
        <el-input
          :placeholder="$t('pleaseEnter')"
          v-model="monthlyFee"
          :disabled="isDisablePrice"
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
                v-for="item in CurrencyList"
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
      <div class="form-item" v-if="type === 0 && !isEdit">
        <div class="label">
          {{ $t("password")
          }}<span style="margin-left: 20px; font-weight: 400; color: #666f99">{{
            $t("randomlyGenerated")
          }}</span>
        </div>
      </div>
      <div class="form-item" v-if="type === 0 && isEdit && !isDisablePrice">
        <div class="text__container" v-html="$t('price0002')">
        </div>
      </div>
      <div class="btn-group">
        <CancelButton
          :text="$t('cancel')"
          :width="175"
          :height="36"
          @click.native="closePopup"
        >
        </CancelButton>

        <ConfirmButton
          :text="isEdit ? $t('save') : $t('add')"
          :width="175"
          :height="36"
          @click.native="handleAdd"
        >
        </ConfirmButton>
      </div>
    </div>
  </div>
</template>

<script>
import { CurrencyList, UserType } from '@/utils/constant';

export default {
  props: {
    currentClient: [Object],
    type: [Number, String]
  },
  data() {
    return {
      UserType,
      CurrencyList,
      email: '',
      emailError: false,
      emailErrorText: '',

      name: '',
      nameError: false,
      nameErrorText: '',

      accountExecutive: '',
      accountExecutiveError: false,
      accountExecutiveErrorText: '',

      monthlyFee: '',
      monthlyFeeError: false,
      monthlyFeeErrorText: '',

      activationFee: '',
      activationFeeError: false,
      activationFeeErrorText: '',
      currency: 'usd',

      isDistributor: false,
      isTenant: false,
      roleError: false,
      roleErrorText: ''
    };
  },
  computed: {
    isEdit() {
      return !!this.currentClient;
    },
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
    isDisablePrice() {
      if (!this.isEdit) {
        return false;
      }
      return this.currentClient.distributorId ? !this.currentClient.roles.includes(UserType.distributor) : false;
    },
    btnDisable() {
      return (
        this.nameError ||
        this.emailError ||
        this.accountExecutiveError ||
        this.roleError ||
        this.activationFeeError ||
        this.monthlyFeeError
      );
    }
  },
  mounted() {
    if (this.isEdit) {
      this.name = this.currentClient.name || '';
      if (this.type === 1) return;
      this.email = this.currentClient.email || '';
      this.accountExecutive = this.currentClient.accountExecutive || '';
      this.isDistributor = this.currentClient.roles.includes(
        UserType.distributor
      );
      this.isTenant = this.currentClient.roles.includes(UserType.tenantAdmin);
      if (this.currentClient.prices) {
        this.monthlyFee = (
          this.currentClient.prices.find((item) => item.resourceId === 20)
            .amount / 100
        ).toFixed(2);
        this.activationFee = (
          this.currentClient.prices.find((item) => item.resourceId === 10)
            .amount / 100
        ).toFixed(2);
        this.currency = this.currentClient.prices[0]?.currency || 'usd';
      }
    }
  },
  methods: {
    handleEmailFocus() {
      this.emailError = false;
    },
    handleEmailBlur() {
      this.email = this.email.trim(); // 去除邮箱前后空格
      this.checkEmail();
    },
    checkEmail() {
      if (!this.emailEmpty) {
        this.emailErrorText = this.$t('emailNotEmpty');
        this.emailError = true;
        return;
      }
      if (!this.emailLength) {
        this.emailErrorText = this.$t('lengthMax', { length: 100 });
        this.emailError = true;
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
    checkRole() {
      if (!this.isDistributor && !this.isTenant) {
        this.roleErrorText = this.$t('pleaseSelect');
        this.roleError = true;
        return;
      }
      this.roleErrorText = '';
      this.roleError = false;
    },
    selectRole(type) {
      if (type === 'distributor') {
        this.isDistributor = !this.isDistributor;
      } else {
        this.isTenant = !this.isTenant;
      }
      this.checkRole();
    },
    handleAccountExecutiveFocus() {
      this.accountExecutiveError = false;
    },
    handleAccountExecutiveBlur() {
      this.accountExecutive = this.accountExecutive.trim();
      this.checkAccountExecutive();
    },
    checkAccountExecutive() {
      if (this.accountExecutive.length > 200) {
        this.accountExecutiveErrorText = this.$t('lengthMax', { length: 200 });
        this.accountExecutiveError = true;
        return;
      }
      this.accountExecutiveErrorText = '';
      this.accountExecutiveError = false;
    },
    handlePriceFocus(type) {
      if (type === 'monthlyFee') {
        this.monthlyFeeError = false;
      } else {
        this.activationFeeError = false;
      }
    },

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
    closePopup() {
      this.$emit('closeHandleClient');
    },
    handleAdd() {
      this.checkName();
      if (this.type === 0) {
        this.checkEmail();
        this.checkRole();
        this.checkAccountExecutive();
        this.checkPrice('monthlyFee');
        this.checkPrice('activationFee');
      }
      if (this.btnDisable) {
        return;
      }
      let payload = {};
      if (this.type === 0) {
        const roles = [];
        if (this.isDistributor) {
          roles.push(UserType.distributor);
        }
        if (this.isTenant) {
          roles.push(UserType.tenantAdmin);
        }
        payload = {
          name: this.name,
          email: this.email,
          accountExecutive: this.accountExecutive?.trim(),
          roles: roles,
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
      } else {
        payload = {
          name: this.name
        };
      }

      this.$psPageLoading().show();
      if (this.isEdit) {
        this.$http
          .editUserInfo(this.currentClient.id, payload)
          .then(() => {
            this.$emit('confirmHandleClientSuccess');
          })
          .finally(() => {
            this.$psPageLoading().hide();
          });
      } else {
        this.$http
          .addNewClient(payload)
          .then(() => {
            this.$emit('confirmHandleClientSuccess');
          })
          .finally(() => {
            this.$psPageLoading().hide();
          });
      }
    },
    parseRole() {
      const rolesList = [];
      if (this.isDistributor) {
        rolesList.push(this.$t('distributor'));
      }
      if (this.isTenant) {
        rolesList.push(this.$t('tenant'));
      }
      return rolesList.join(',');
    },
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
.add-new-member {
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
      ::v-deep .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 0 12px 12px 0;
        border: 1px solid #b9bcca;
        width: 180px;
      }
      ::v-deep .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 12px 0 0 12px;
        border: 1px solid #b9bcca;
        width: 180px;
      }
      ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: linear-gradient(90deg, #1c21e4 0%, #4895ff 100%);
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
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
          right: 10px;
        }
      }

      .role-select {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        .role-item:hover {
          border: 2px solid #325bf2;
        }
        .role-item {
          width: 175px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 9px;
          border-radius: 18px;
          border: 1px solid #e2e3e9;
          font-size: 14px;
          font-weight: normal;
          color: #222e61;
          cursor: pointer;
          position: relative;
          .select-icon {
            position: absolute;
            left: 7px;
            width: 18px;
            height: 18px;
            background: url("@/assets/icons/ic_mark.svg") no-repeat center;
          }
        }
        .active {
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
      .text__container {
        font-size: 15px;
        color: #222e61;
        padding: 8px;
        border-radius: 6px;
        background: #d4deff;
        border: 1px dashed #979797;
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
