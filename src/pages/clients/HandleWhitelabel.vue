<template>
  <div class="handle-white-label">
    <div class="popup">
      <div class="header">
        <div class="title">{{$t('whitelabel0001')}}</div>
        <div class="desc">{{$t('whitelabel0002')}}</div>
      </div>
      <div class="content">
        <div class="form-item">
          <div class="label">
            {{$t('whitelabel0003')}}
          </div>
          <div class="desc">
            {{$t('whitelabel0004')}}
          </div>
          <div class="upload-img__container">
            <img v-if="firstImgUrl"
                 :src="firstImgUrl"
                 style="height: 50px"
                 alt="" />
            <el-upload
              v-if="!firstImgUrl"
              class="upload-img"
              drag
              :auto-upload="false"
              action="#"
              :multiple="false"
              :show-file-list="false"
              :accept="'.png,.svg,.jpg'"
              :on-change="(file) => handleFileChange(file, 'first')"
            >
              <div class="icon-upload"></div>
              <div class="text">{{$t('whitelabel0005')}}</div>
            </el-upload>
            <div class="img-operation" v-else>
              <el-upload
                class="upload-bnt-wrapper"
                :auto-upload="false"
                action="#"
                :multiple="false"
                :show-file-list="false"
                :accept="'.png,.svg,.jpg'"
                :on-change="(file) => handleFileChange(file, 'first')"
              >
                <div class="upload-btn">
                  <div class="icon-upload"></div>
                  <div class="text">{{$t('whitelabel0015')}}</div>
                </div>
              </el-upload>
              <div class="delete-text" @click="handleDelFile('first')">{{$t('delete')}}</div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">
            {{$t('whitelabel0006')}}
          </div>
          <div class="desc">
            {{$t('whitelabel0007')}}
          </div>
          <div class="upload-img__container">
            <img v-if="secondImgUrl"
                 :src="secondImgUrl"
                 style="height: 50px"
                 alt="" />
            <el-upload
              v-if="!secondImgUrl"
              class="upload-img"
              drag
              :auto-upload="false"
              action="#"
              :multiple="false"
              :show-file-list="false"
              :accept="'.png,.svg,.jpg'"
              :on-change="(file) => handleFileChange(file, 'second')"
            >
              <div class="icon-upload"></div>
              <div class="text">{{$t('whitelabel0008')}}</div>
            </el-upload>
            <div class="img-operation" v-else>
              <el-upload
                class="upload-bnt-wrapper"
                :auto-upload="false"
                action="#"
                :multiple="false"
                :show-file-list="false"
                :accept="'.png,.svg,.jpg'"
                :on-change="(file) => handleFileChange(file, 'second')"
              >
                <div class="upload-btn">
                  <div class="icon-upload"></div>
                  <div class="text">{{$t('whitelabel0015')}}</div>
                </div>
              </el-upload>
              <div class="delete-text" @click="handleDelFile('second')">{{$t('delete')}}</div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">
            {{$t('whitelabel0009')}}
          </div>
          <div class="color-select-group">
            <div class="color-select-item">
              <div class="desc">
                {{$t('whitelabel0010')}}
              </div>
              <div class="color-select">
                <el-color-picker v-model="tempPrimaryColor" popper-class="color-picker-selector"></el-color-picker>
                <el-input v-model="tempPrimaryColor" :placeholder="$t('whitelabel0021')"></el-input>
              </div>
            </div>
            <div class="color-select-item">
              <div class="desc">
                {{$t('whitelabel0011')}}
              </div>
              <div class="color-select">
                <el-color-picker v-model="tempSecondaryColor" popper-class="color-picker-selector"></el-color-picker>
                <el-input v-model="tempSecondaryColor" :placeholder="$t('whitelabel0021')"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="example-list">
          <div class="header">
            <div class="arrow-btn" :class="{disabled: currentExample === 0}" @click="changeExample('prev')">
              <div class="arrow-icon iconfont ps-a-Insights-ico-leftarrow"></div>
            </div>
            <div class="title">
              {{exampleList[currentExample].label}}
            </div>
            <div class="arrow-btn" :class="{disabled: currentExample === exampleList.length - 1}" @click="changeExample('next')">
              <div class="arrow-icon iconfont ps-a-Insights-ico-leftarrow" style="transform: rotate(180deg)"></div>
            </div>
          </div>
          <div class="month" v-if="currentExample === 0">
            <div class="month-header">
              <div class="month-title">2026</div>
              <div class="month-btn-group">
                <div class="arrow-icon iconfont ps-a-Insights-ico-leftarrow" style="color: #325BF2"></div>
                <div class="arrow-icon iconfont ps-a-Insights-ico-leftarrow" style="transform: rotate(180deg)"></div>
              </div>
            </div>
            <div class="month-content">
              <div class="month-item">Jan</div>
              <div class="month-item">Feb</div>
              <div class="month-item">Mar</div>
              <div class="month-item">Apr</div>
              <div class="month-item" :style="{color: tempPrimaryColor ? tempPrimaryColor : '#325BF2'}">May</div>
              <div class="month-item">Jun</div>
              <div class="month-item">Jul</div>
              <div class="month-item" style="color: #fff">
                <div class="active" :style="{background: tempPrimaryColor ? tempPrimaryColor : '#325BF2'}">Aug</div>
              </div>
            </div>
            <div class="month-btn">
              <CancelButton
                :text="$t('cancel')"
                :width="128"
                :height="35"
                :style="{background: tempSecondaryColor ? tempSecondaryColor : '#FFFFFF'}"
              >
              </CancelButton>
            </div>
          </div>
          <div class="logo-example" v-if="currentExample === 1">
            <div class="pc-logo" v-if="firstImgUrl">
              <img class="logo-display"
                   :src="firstImgUrl"
                   style="height: 40px"
                   alt="" />
              <img src="@/assets/imgs/powered-by-pontosense-logo.png" style="width:130px;height: 20px" alt="" />
            </div>
            <div class="pc-logo" style="top: 30px" v-else>
              <img src="@/assets/imgs/logo_pontosense.png" style="width: 140px;height: 32px" alt="" />
            </div>
            <img src="@/assets/imgs/logo-example.png" style="width:438px;height: 209px" alt="" />
          </div>
          <div class="logo-example" v-if="currentExample === 2">
            <div class="app-logo" v-if="firstImgUrl">
              <img src="@/assets/imgs/img_ps_logo_short.png" style="height: 25px" alt="" />
              <img class="logo-display"
                   :src="firstImgUrl"
                   style="height: 25px"
                   alt="" />
            </div>
            <div class="app-logo" v-else>
              <img src="@/assets/imgs/img_ps_logo_color.png" style="height: 25px" alt="" />
            </div>
            <img src="@/assets/imgs/app-example.png" style="width:438px;height: 209px" alt="" />
          </div>
          <div class="form-example" v-if="currentExample === 3">
            <div class="form-title">Type here</div>
            <div class="example-form-item"
                 :style="{border: tempPrimaryColor ? `2px solid ${tempPrimaryColor}` : '2px solid #000'}">12345677777</div>
            <div class="example-btn-group">
              <CancelButton
                :text="$t('cancel')"
                style="width: 100%"
                :height="50"
                :style="{border: tempPrimaryColor ? `1px solid ${tempPrimaryColor}` : '1px solid #000'}"
              >
              </CancelButton>
              <ConfirmButton
                :text="$t('confirm')"
                style="width: 100%"
                :height="50"
                :style="{background: tempPrimaryColor ? tempPrimaryColor : '#000'}"
              >
              </ConfirmButton>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group">
        <div class="btn-reset" @click="reset">{{$t('whitelabel0014')}}</div>
        <div class="btn-enable">
          <CancelButton
            :text="$t('cancel')"
            :width="128"
            :height="35"
            @click.native="closePopup"
          >
          </CancelButton>

          <ConfirmButton
            :text="$t('whitelabel0013')"
            :width="128"
            :height="35"
            @click.native="editWhiteLabel"
          >
          </ConfirmButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'handleWhitelabel',
  props: {
    currentClient: [Object]
  },
  data() {
    return {
      firstLogoUrl: null,
      secondLogoUrl: null,
      primaryColor: '',
      secondaryColor: '',
      tempFirstLogoFile: null,
      tempSecondLogoFile: null,
      tempPrimaryColor: '',
      tempSecondaryColor: '',
      currentExample: 0,
      exampleList: [
        {
          key: 'example',
          label: this.$t('whitelabel0012')
        },
        {
          key: 'logoExample',
          label: this.$t('whitelabel0016')
        },
        {
          key: 'appExample',
          label: this.$t('whitelabel0017')
        },
        {
          key: 'appFormExample',
          label: this.$t('whitelabel0017')
        }
      ]
    };
  },
  computed: {
    firstImgUrl() {
      if (!this.tempFirstLogoFile) {
        return '';
      }
      if (typeof this.tempFirstLogoFile === 'string') {
        return this.tempFirstLogoFile;
      }
      return URL.createObjectURL(this.tempFirstLogoFile);
    },
    secondImgUrl() {
      if (!this.tempSecondLogoFile) {
        return '';
      }
      if (typeof this.tempSecondLogoFile === 'string') {
        return this.tempSecondLogoFile;
      }
      return URL.createObjectURL(this.tempSecondLogoFile);
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.$psPageLoading().show();
      this.$http.getWhiteLabel(this.currentClient.id)
        .then((res) => {
          this.firstLogoUrl = this.tempFirstLogoFile = res.firstLogoUrl;
          this.secondLogoUrl = this.tempSecondLogoFile = res.secondLogoUrl;
          this.primaryColor = this.tempPrimaryColor = res.primaryColor || '';
          this.secondaryColor = this.tempSecondaryColor = res.secondaryColor || '';
        }).finally(() => {
          this.$psPageLoading().hide();
        });
    },
    handleFileChange(file, type) {
      const fileName = file.name;

      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex === -1) {
        return { name: fileName, ext: '' }; // 没有扩展名
      }

      const ext = fileName.slice(lastDotIndex + 1).toLowerCase();

      if (ext !== 'png' && ext !== 'svg' && ext !== 'jpg') {
        this.$psNotifyMessage().info(this.$t('whitelabel0019'));
        return;
      }

      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 5) {
        this.$psNotifyMessage().info(this.$t('invalidFileSize'));
        return;
      }
      if (type === 'first') {
        URL.revokeObjectURL(this.firstImgUrl);
        this.tempFirstLogoFile = file.raw;
      } else {
        URL.revokeObjectURL(this.secondImgUrl);
        this.tempSecondLogoFile = file.raw;
      }
    },
    handleDelFile(type) {
      if (type === 'first') {
        URL.revokeObjectURL(this.firstImgUrl);
        this.tempFirstLogoFile = null;
      } else {
        URL.revokeObjectURL(this.secondImgUrl);
        this.tempSecondLogoFile = null;
      }
    },
    isValidHexColor(color) {
      if (!color) {
        return true;
      }
      const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      return reg.test(color);
    },
    editWhiteLabel() {
      if (!this.isValidHexColor(this.tempPrimaryColor) || !this.isValidHexColor(this.tempSecondaryColor)) {
        this.$psNotifyMessage().info(this.$t('whitelabel0020'));
        return;
      }
      const formData = new FormData();
      if (!this.tempFirstLogoFile) {
        formData.append('firstLogoFile', null);
        formData.append('firstLogoUrl', '');
      } else if (typeof this.tempFirstLogoFile === 'string') {
        formData.append('firstLogoFile', null);
        formData.append('firstLogoUrl', this.firstLogoUrl);
      } else {
        formData.append('firstLogoFile', this.tempFirstLogoFile);
        formData.append('firstLogoUrl', '');
      }

      if (!this.tempSecondLogoFile) {
        formData.append('secondLogoFile', null);
        formData.append('secondLogoUrl', '');
      } else if (typeof this.tempSecondLogoFile === 'string') {
        formData.append('secondLogoFile', null);
        formData.append('secondLogoUrl', this.secondLogoUrl);
      } else {
        formData.append('secondLogoFile', this.tempSecondLogoFile);
        formData.append('secondLogoUrl', '');
      }
      formData.append('primaryColor', this.tempPrimaryColor);
      formData.append('secondaryColor', this.tempSecondaryColor);
      this.$psPageLoading().show();
      this.$http.editWhiteLabel(this.currentClient.id, formData)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.$emit('closeIt');
        }).finally(() => {
          this.$psPageLoading().hide();
        });
    },
    reset() {
      this.tempFirstLogoFile = null;
      this.tempSecondLogoFile = null;
      this.tempPrimaryColor = '';
      this.tempSecondaryColor = '';
    },
    changeExample(type) {
      if (type === 'prev') {
        if (this.currentExample === 0) {
          return;
        }
        this.currentExample = this.currentExample - 1;
      }
      if (type === 'next') {
        if (this.currentExample === this.exampleList.length - 1) {
          return;
        }
        this.currentExample = this.currentExample + 1;
      }
    },
    closePopup() {
      this.$emit('closeIt');
    }
  }
};
</script>

<style scoped lang="scss">
.handle-white-label {
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
    width: 510px;
    background: #f3f4f7;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    .desc {
      color: #666F99;
      font-size: 14px;
      font-weight: 400;
    }
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #D6DBEB;
      .title {
        font-weight: 600;
        font-size: 16px;
        color: #222e61;
      }
    }
    .content {
      max-height: 600px;
      overflow-y: auto;
      .form-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 12px;

        .label {
          font-weight: 500;
          font-size: 14px;
          color: #222e61;
          line-height: 16px;
          display: flex;
        }
        .upload-img__container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          margin-top: 16px;

          .upload-img {
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
                  width: 260px;
                  font-size: 12px;
                  color: #325bf2;
                  margin-top: 6px;
                }
              }
            }
          }
          .img-operation {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-top: 16px;
            .upload-bnt-wrapper {
              width: 100%;
              display: flex;
              align-items: center;
              ::v-deep .el-upload {
                width: 100%;
                .upload-btn {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  .icon-upload {
                    width: 18px;
                    height: 18px;
                    background: url("@/assets/icons/ic_upload.svg") no-repeat
                    center;
                    background-size: contain;
                  }
                  .text {
                    color: #325bf2;
                    font-size: 14px;
                    font-weight: 400;
                    border-bottom: 2px dotted #325bf2;
                  }
                }
              }
            }
            .delete-text {
              color: #FF3B30;
              font-size: 14px;
              font-weight: 400;
              border-bottom: 2px dotted #FF3B30;
              cursor: pointer;
            }
          }
        }
        .color-select-group {
          display: flex;
          align-items: center;
          gap: 8px;
          .color-select-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 8px 0;
            .color-select {
              display: flex;
              align-items: center;
              position: relative;
              .el-color-picker {
                height: 18px;
                position: absolute;
                z-index: 2;
                left: 12px;
                ::v-deep .el-color-picker__trigger {
                  height: 18px;
                  width: 18px;
                  padding: unset;
                  border: unset;
                  border-radius: 2px;
                  .el-color-picker__color {
                    border: unset;
                    .el-color-picker__color-inner {
                      border-radius: 2px;
                      border: 1px solid #B5BDCC;
                    }
                  }
                  .el-color-picker__icon {
                    display: none;
                  }
                }
              }
              ::v-deep .el-input {
                height: 36px;
                .el-input__inner {
                  border-radius: 10px;
                  height: 100%;
                  padding: 0 15px 0 40px;
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
            }
          }
        }
      }
      .example-list {
        border-radius: 8px;
        border: 1px solid #DBE1EC;
        background: #FFF;
        padding: 16px 16px 20px 16px;
        .logo-display {
          width: auto;
          max-width: 180px;
          object-fit: contain;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #DBE1EC;
          margin-bottom: 12px;
          .arrow-icon {
            font-size: 14px;
            color: #5B6063;
          }
          .arrow-btn:hover {
            background: rgba(0, 0, 0, 0.02);
          }
          .arrow-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            background: rgba(0, 0, 0, 0.04);
            padding: 5px;
            cursor: pointer;
          }
          .disabled {
            cursor: not-allowed !important;
          }
          .title {
            color: #000;
            font-size: 18px;
            font-weight: 510;
          }
        }
        .month {
          .month-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            .month-title {
              color: #000;
              font-size: 24px;
              font-weight: 510;
            }
            .month-btn-group {
              display: flex;
              align-items: center;
              gap: 18px;
              .arrow-icon {
                font-size: 16px;
                color: #B5BDCC;
              }
            }
          }
          .month-content {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            .month-item {
              color: #000;
              text-align: center;
              font-size: 16px;
              font-weight: 510;
              height: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              .active {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                border-radius: 30px;
              }
            }
          }
          .month-btn {
            width: 100%;
            display: flex;
            justify-content: end;
            margin-top: 15px;
          }
        }
        .logo-example {
          position: relative;
          border-radius: 10px;
          .pc-logo {
            position: absolute;
            top: 20px;
            left: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .app-logo {
            position: absolute;
            top: 65px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
          }
        }
        .form-example {
          display: flex;
          padding: 18px 16px;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          border-radius: 10px;
          border: 1px solid #DBE1EC;
          .form-title {
            color: #0D0D15;
            font-size: 20px;
            font-weight: 510;
          }
          .example-form-item {
            width: 100%;
            align-items: center;
            display: flex;
            height: 52px;
            padding: 14px;
            border-radius: 10px;
            background: #F7F8FB;
            color: #000;
            font-size: 20px;
            font-weight: 510;
          }
          .example-btn-group {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 16px;
          }
        }
      }
    }
    .btn-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      .btn-reset {
        color: #7A8497;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
      }
      .btn-enable {
        display: flex;
        align-items: center;
        gap: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.color-picker-selector.el-color-picker__panel {
  .el-color-dropdown__btns {
    .el-color-dropdown__link-btn.el-button--text {
      display: none;
    }
  }
}
</style>
