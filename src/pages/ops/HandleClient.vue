<template>
  <div class="add-new-member">
    <div class="popup">
      <div class="title">Set Distributor</div>
      <div class="btn-group">
        <CancelButton :width="175"
                      :height="36"
                      :text="$t('cancel')"
                      @click.native="closePopup" />
        <ConfirmButton :width="175"
                       :height="36"
                       :text="$t('save')"
                       @click.native="handleAdd" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    currentClient: [Object]
  },
  data() {
    return {
    };
  },
  methods: {
    closePopup() {
      this.$emit('closeHandleClient');
    },
    handleAdd() {
      const payload = {};
      this.$psPageLoading().show();
      this.$http.setDistributor(this.currentClient.id, payload)
        .then(() => {
          this.$emit('confirmHandleClientSuccess');
        }).finally(() => {
          this.$psPageLoading().hide();
        });
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
    background: #ffffff;
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
        color: #7982A6;
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
        border: 1px solid #B9BCCA;
        width: 180px;
      }
      ::v-deep .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 12px 0 0 12px;
        border: 1px solid #B9BCCA;
        width: 180px;
      }
      ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background: linear-gradient( 90deg, #1C21E4 0%, #4895FF 100%);
        box-shadow: 0px 2px 6px 0px rgba(72,149,255,0.2);
      }

      ::v-deep .el-input {
        height: 36px;
        margin-top: 6px;
        .el-input__inner {
          border: 1px solid #e2e3e9;
          border-radius: 10px;
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
          border: 2px solid #325bf2;
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
          border: 1px solid #E2E3E9;
          font-size: 14px;
          font-weight: normal;
          color: #222E61;
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
    }

    ::v-deep .el-input {
      margin-top: 6px;
      height: 36px;
      .el-input__inner {
        height: 36px;
        border-radius: 10px;
        border: 1px solid #e2e3e9;
      }
      .el-input__inner:hover,
      .el-input__inner:focus {
        border: 2px solid #325bf2;
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
