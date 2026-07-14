<template>
  <div class="edit-sn__wrapper">
    <div class="popup" v-if="!showFailed">
      <div class="title">{{ $t('reseller0007') }}</div>
      <div class="tab__wrappper">
        <div class="tab">
          <div
            class="tab-item"
            :class="{ 'current-item': currentTab == 0 }"
            @click="currentTab = 0"
          >
            {{ $t('reseller0009') }}
          </div>
          <div
            class="tab-item"
            :class="{ 'current-item': currentTab == 1 }"
            @click="currentTab = 1"
          >
            {{ $t('reseller0010') }}
          </div>
        </div>
      </div>

      <div class="input__wrapper" v-if="currentTab == 0">
        <el-input
          v-model="sn"
          :placeholder="$t('serialNumber')"
          @keyup.enter.native="handleAddSn"
          maxlength="30"
        >
          <div slot="suffix" class="btn-add" @click="handleAddSn">{{ $t('add') }}</div>
        </el-input>

        <div class="result" v-if="sensorList.length > 0">
          <div class="label">{{ $t('devices') }}:</div>
          <div class="sensor-list">
            <div
              class="sensor-item"
              v-for="(item, index) in sensorList"
              :key="index"
            >
              <div class="sn">{{ item }}</div>
              <div class="icon-del" @click="handleDelSn(item)"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="batch-import" v-if="currentTab == 1">
        <div class="step__wrappper">
          <div class="label">{{ $t("reseller0011") }}</div>
          <div class="text">{{ $t('reseller0013') }}</div>

          <div class="example-excel__container">
            <div class="left">
              <div class="icon-file"></div>
              <div class="file-name">template-reseller-sensor.xlsx</div>
            </div>
            <div class="right" @click="handleDownload">
              <div class="icon-download"></div>
            </div>
          </div>
        </div>

        <div class="step__wrappper">
          <div class="label">{{ $t("reseller0012") }}</div>
          <div class="text">{{ $t('reseller0014') }}</div>

          <div class="upload-excel__container">
            <el-upload
              class="upload-excel"
              drag
              :auto-upload="false"
              action="#"
              :multiple="false"
              :show-file-list="false"
              :accept="'.xls,.xlsx'"
              :on-change="handleFileChange"
            >
              <div class="icon-upload"></div>
              <div class="text">{{ $t('reseller0015') }}</div>
            </el-upload>

            <div class="upload-result__container" v-if="fileName">
              <div class="left">
                <div
                  class="icon-file"
                  :class="{ failed: isError, success: !isError }"
                ></div>
                <div class="file-info">
                  <div class="name">{{ fileName }}</div>
                  <div class="error" v-if="isError">{{ errorText }}</div>
                </div>
              </div>
              <div class="right">
                <el-tooltip
                  effect="light"
                  :visible-arrow="false"
                  :content="$t('delete')"
                  placement="top"
                >
                  <div class="btn-del" @click="handleDelFile">
                    <div class="icon-del"></div>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-group">
        <CancelButton
          :text="$t('cancel')"
          :width="250"
          :height="36"
          @click.native="handleCancel"
        >
        </CancelButton>
        <ConfirmButton
          :text="$t('ok')"
          :width="250"
          :height="36"
          :isDisabled="btnDisable"
          @click.native="handleSubmit"
        >
        </ConfirmButton>
      </div>
    </div>

    <div class="failed-popup" v-else>
      <div class="title">{{ $t('devicefail001') }}</div>
      <div class="sensor__container">
        <div class="sensor-list">
          <div class="item" v-for="(item, index) in failedList" :key="index">{{ item }}</div>
        </div>
      </div>
      <div class="btn-group">
        <ConfirmButton
          :text="$t('ok')"
          :width="360"
          :height="36"
          @click.native="handleCloseFailed"
        >
        </ConfirmButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditSn',
  props: {
    currentReseller: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentTab: 0,
      sensorList: [],
      sn: '',

      // batch import
      file: null,
      fileName: '',
      isError: false,
      errorText: '',

      failedList: [],
      showFailed: false
    };
  },
  computed: {
    btnDisable() {
      return (this.currentTab === 0 && this.sensorList.length === 0) || (this.currentTab === 1 && (this.file === null || this.isError));
    }
  },
  methods: {
    handleDelSn(sn) {
      this.sensorList = this.sensorList.filter((item) => item != sn);
    },
    handleAddSn() {
      const result = this.sn.trim();
      if (result && !this.sensorList.includes(result)) {
        this.sensorList.push(result);
        this.sn = '';
      } else {
        this.sn = '';
      }
    },
    handleDownload() {
      location.href = 'https://static.pontosense.com/application/template-reseller-sensor.xlsx';
    },
    handleFileChange(file) {
      this.fileName = file.name;

      const lastDotIndex = this.fileName.lastIndexOf('.');
      if (lastDotIndex === -1) {
        return { name: this.fileName, ext: '' }; // 没有扩展名
      }

      const ext = this.fileName.slice(lastDotIndex + 1).toLowerCase();

      if (ext !== 'xlsx' && ext !== 'xls') {
        // 检查扩展名是否为xlsx或xls
        this.isError = true;
        this.errorText = this.$t('invalidFileType');
        return;
      }

      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 5) {
        this.isError = true;
        this.errorText = this.$t('invalidFileSize');
        return;
      }
      this.isError = false;
      this.file = file.raw;
    },
    handleDelFile() {
      this.file = null;
      this.fileName = '';
      this.isError = false;
    },
    handleCancel() {
      this.$emit('closeEdit', false);
    },
    handleSubmit() {
      if (this.currentTab === 0) {
        this.handleSubmitSn();
      }
      if (this.currentTab === 1) {
        this.handleSubmitFile();
      }
    },
    handleSubmitSn() {
      if (this.sensorList.length === 0) return;
      this.$psPageLoading().show();
      const params = {
        sensors: this.sensorList
      };
      this.$http.addResellerSensor(this.currentReseller.id, params)
        .then((res) => {
          if (res.length !== 0) {
            this.failedList = res;
            this.showFailed = true;
          } else {
            this.$emit('closeEdit', true);
          }
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    handleSubmitFile() {
      if (this.file === null || this.isError) return;
      this.$psPageLoading().show();
      const formData = new FormData();
      formData.append('file', this.file);
      this.$http
        .importResellerSensors(this.currentReseller.id, formData)
        .then((res) => {
          if (res && res instanceof Blob && res.size !== 0) {
            this.$emit('addFaild', res, this.fileName);
          } else {
            this.$psNotifyMessage().success(this.$t('operationSuccessful'));
            this.$emit('closeEdit', true);
          }
        })
        .finally(() => {
          this.$psPageLoading().hide();
        })
        .catch(() => {});
    },
    handleCloseFailed() {
      this.showFailed = false;
      this.failedList = [];
      this.sensorList = [];
      this.$emit('closeEdit', true);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-sn__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  .popup,
  .failed-popup {
    width: 550px;
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

    .tab__wrappper {
      height: 36px;
      margin-top: 10px;

      .tab {
        display: inline-flex;
        align-items: center;
        padding: 4px;
        background: rgba(184, 184, 224, 0.2);
        border-radius: 15px;
        gap: 5px;
        height: 100%;

        .tab-item {
          display: flex;
          align-items: center;
          height: 100%;
          font-size: 14px;
          font-weight: 500;
          color: #222e61;
          border-radius: 15px;
          padding: 0 10px;
          cursor: pointer;
        }
        .current-item {
          background: #325bf2;
          color: #fff;
        }
      }
    }

    .input__wrapper {
      width: 100%;
      margin-top: 16px;
      ::v-deep .el-input {
        height: 36px;
        .el-input__inner {
          border: 1px solid transparent;
          border-radius: 20px;
          height: 100%;
          padding: 0 60px 0 15px;
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
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          right: 6px;
          padding: 6px;

          .el-input__suffix-inner {
            width: 100%;
            height: 100%;
            font-size: 14px;
            color: #222e61;
            display: flex;
            align-items: center;

            .btn-add {
              width: 100%;
              height: 100%;
              border-radius: 5px;
              border: 1px solid rgba(51, 73, 153, 0.2);
              padding: 0 6px;
              display: flex;
              align-items: center;
              cursor: pointer;
            }
          }
        }
      }
      .result {
        margin-top: 16px;
        .label {
          font-size: 14px;
          color: #222e61;
        }
        .sensor-list {
          width: 100%;
          max-height: 200px;
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(2, 250px);
          justify-content: space-between;
          gap: 10px;
          .sensor-item {
            height: 30px;
            background: rgba(184, 184, 224, 0.1);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            flex-grow: 0;
            flex-shrink: 0;

            .sn {
              width: calc(100% - 34px);
              font-size: 14px;
              color: #222e61;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .icon-del {
              display: none;
              width: 18px;
              height: 18px;
              margin-left: 6px;
              background: url("@/assets/icons/ic_del.svg") no-repeat center;
              cursor: pointer;
            }
          }
          .sensor-item:hover {
            .icon-del {
              display: block;
            }
          }
        }
      }
    }

    .batch-import {
      width: 100%;
      margin-top: 16px;

      .step__wrappper {
        width: 100%;
        margin-top: 20px;

        .label {
          font-size: 13px;
          font-weight: 600;
          color: #7982a6;
        }

        .text {
          font-size: 14px;
          color: #222e61;
          margin: 6px 0;
        }

        .example-excel__container {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.7);
          display: flex;
          padding: 10px;
          align-items: center;
          justify-content: space-between;

          .left {
            width: calc(100% - 42px);
            display: flex;
            align-items: center;

            .icon-file {
              width: 18px;
              height: 18px;
              background: url("@/assets/icons/ic_file.svg") no-repeat center;
              background-size: contain;
              margin-right: 6px;
            }

            .file-name {
              width: calc(100% - 25px);
              font-size: 14px;
              color: #7982a6;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .right {
            width: 32px;
            height: 32px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .icon-download {
              width: 18px;
              height: 18px;
              background: url("@/assets/icons/ic_download.svg") no-repeat center;
              background-size: contain;
            }
          }

          .right:hover {
            background: rgba(102, 124, 204, 0.12);
          }
        }

        .upload-excel__container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;

          .upload-excel {
            width: 100%;

            ::v-deep .el-upload {
              width: 100%;
              height: 75px;

              .el-upload-dragger {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.7);
                border: 1px dashed rgba(51, 73, 153, 0.2);

                .icon-upload {
                  width: 18px;
                  height: 18px;
                  background: url("@/assets/icons/ic_upload.svg") no-repeat
                    center;
                  background-size: contain;
                }

                .text {
                  font-size: 12px;
                  color: #325bf2;
                  margin-top: 6px;
                }
              }
            }
          }

          .upload-result__container {
            width: 100%;
            height: 48px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.7);
            margin-top: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 10px;

            .left {
              width: calc(100% - 40px);
              display: flex;
              align-items: center;

              .icon-file {
                width: 18px;
                height: 18px;
                margin-right: 10px;
              }

              .failed {
                background: url("@/assets/icons/ic_file_failed.svg") no-repeat
                  center;
                background-size: contain;
              }

              .success {
                background: url("@/assets/icons/ic_file_success.svg") no-repeat
                  center;
                background-size: contain;
              }

              .file-info {
                width: calc(100% - 30px);
                display: flex;
                flex-direction: column;
                justify-content: center;

                .name {
                  font-size: 14px;
                  color: #7982a6;
                }

                .error {
                  font-size: 12px;
                  color: #ff2c50;
                }
              }
            }

            .right {
              width: 32px;
              height: 32px;

              .btn-del {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 24px;
                background: rgba(102, 124, 204, 0.12);
                cursor: pointer;

                .icon-del {
                  width: 18px;
                  height: 18px;
                  background: url("@/assets/icons/ic_del.svg") no-repeat center;
                  background-size: contain;
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
    }
    .sensor__container{
      width: 100%;
      max-height: 260px;
      margin-top: 16px;
      overflow-y: auto;

      .sensor-list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .item{
          font-size: 14px;
          color: #222e61;
          font-weight: 500;
        }
      }

    }
  }
  .failed-popup{
    width: 360px;
  }
}
</style>
