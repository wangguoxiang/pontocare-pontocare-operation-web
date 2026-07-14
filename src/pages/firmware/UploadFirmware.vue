<template>
  <div class="upload-firmware__wrapper">
    <div class="popup">
      <div class="title">{{ $t("firmware0003") }}</div>
      <div class="version__container">
        <div class="label">{{ $t("firmware0004") }}</div>
        <div
          class="input"
          :class="{
            'border-error': !versionInit && versionError,
            'border-focus': versionFocus,
          }"
        >
          <el-input
            v-model="version"
            :placeholder="$t('pleaseEnter')"
            @focus="handleVersionFocus"
            @blur="handleVersionBlur"
          >
          </el-input>
        </div>
        <div class="error-text" v-if="!versionInit && versionError">
          {{ versionErrorText }}
        </div>
      </div>
      <div class="file__container">
        <div class="label">{{ $t("firmware0006") }}</div>
        <div
          class="upload__container"
          :class="{ 'border-error': uploadError }"
          v-if="fileList.length === 0"
        >
          <el-upload
            class="upload-demo"
            ref="fileUpload"
            :file-list="fileList"
            v-model="file"
            name="radarFile"
            action="#"
            :auto-upload="false"
            :accept="'.bin'"
            :limit="2"
            :on-change="handleFileChange"
            :before-remove="handleFileMove"
          >
            <div class="upload-btn__container">
              <div class="icon"></div>
              <div class="des">{{ $t("firmware0007") }}</div>
            </div>
          </el-upload>
          <div class="error-text">{{ uploadErrorText }}</div>
        </div>
        <div class="checked-file__container" v-if="fileList.length !== 0">
          <div class="left">
            <div class="file-icon"></div>
            <div class="file-name">{{ fileName }}</div>
          </div>
          <div class="right" @click="handleFileMove"></div>
        </div>
      </div>

      <div class="notes__container">
        <div class="label">{{ $t("firmware0008") }}</div>
        <el-input
          type="textarea"
          :placeholder="$t('pleaseEnter')"
          v-model="notes"
          resize="none"
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
          :text="$t('confirm')"
          :class="{ 'btn-confirm-disabled': !btnEnable }"
          :width="175"
          :height="36"
          @click.native="handleUpload"
        >
        </ConfirmButton>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UploadFirmware',
  props: {
    model: {
      type: [String, Number]
    }
  },
  data() {
    return {
      version: '',
      versionInit: true,
      versionFocus: false,
      versionError: false,
      versionErrorText: '',
      file: '',
      fileList: [],
      fileName: '',
      uploadError: false,
      uploadErrorText: '',
      notes: '',
      mainVersion: '',
      rcVersion: ''
    };
  },
  computed: {
    btnEnable() {
      return this.version && !this.versionError && this.fileList.length > 0 && this.notes;
    }
  },
  methods: {
    // version校验
    handleVersionFocus() {
      this.versionFocus = true;
      this.versionError = false;
      this.versionInit = false;
    },
    async handleVersionBlur() {
      this.versionFocus = false;
      await this.checkVersion();
      if (!this.versionError && this.version.includes('rc')) {
        // version校验通过 且包含rc
        const versionList = this.version.split('-');
        this.mainVersion = versionList[0];
        this.rcVersion = versionList[1];
      }
    },
    checkVersion() {
      if (!this.version) {
        this.versionError = true;
        this.versionErrorText = this.$t('firmware0005');
        return;
      }

      const testReg = /^\d+\.\d+\.\d+-rc\.\d+$/; // 测试版本
      const prodReg = /^\d+\.\d+\.\d+$/; // 正式版本
      let result = testReg.test(this.version) || prodReg.test(this.version);
      this.versionError = !result;
      this.versionErrorText = this.$t('firmware0014');
    },
    // 文件上传
    handleFileChange(file, fileList) {
      const currentEnv = process.env.VUE_APP_APPENV === 'uat' ? 'UAT' : process.env.VUE_APP_APPENV;
      let checkResult = '';
      if (file) {
        if (this.rcVersion) {
          // 开发/测试/UAT 校验rc
          checkResult = this.validateTestFilename(
            this.model,
            currentEnv,
            file.name
          );
        } else {
          // PROD 不校验rc
          checkResult = this.validateProdFilename(this.model, file.name);
        }

        if (!checkResult) {
          this.$refs.fileUpload.uploadFiles.pop();
          this.uploadError = true;
          this.uploadErrorText = this.$t('firmware0015');
        } else {
          if (fileList.length > 0) {
            this.fileList = [fileList[fileList.length - 1]];
          }
          this.uploadError = false;
          this.uploadErrorText = '';
          this.fileName = file.name;
        }
      }
    },
    validateTestFilename(model, currentEnv, fileName) {
      const name = fileName.replace('.bin', '');
      if (model === '5') { // P5的固件文件名是A1开头的，特殊处理
        let p5Reg = `^A1_Firmware_${currentEnv}_v${this.mainVersion}+-${this.rcVersion}`;
        const patternA = new RegExp(p5Reg, 'i');
        return patternA.test(name);
      } else {
        let otherReg = `^P${model}_Firmware_${currentEnv}_v${this.mainVersion}+-${this.rcVersion}`;
        const pattern = new RegExp(otherReg, 'i');
        return pattern.test(name);
      }
    },
    validateProdFilename(model, fileName) {
      const name = fileName.replace('.bin', '');
      if (model === '5') { // P5的固件文件名是A1开头的，特殊处理
        let p5Reg = `^A1_Firmware_v${this.version}`;
        const pattern = new RegExp(p5Reg, 'i');
        return pattern.test(name);
      } else {
        let otherReg = `^P${model}_Firmware_v${this.version}`;
        const pattern = new RegExp(otherReg, 'i');
        return pattern.test(name);
      }
    },
    checkFile() {
      const fileName = this.fileList[0].name;

      const currentEnv = process.env.VUE_APP_APPENV === 'uat' ? 'UAT' : process.env.VUE_APP_APPENV;
      let checkResult = '';
      // 再次获取rcVersion
      const versionList = this.version.split('-');
      this.mainVersion = versionList[0];
      this.rcVersion = versionList[1];
      if (this.rcVersion) {
        checkResult = this.validateTestFilename(
          this.model,
          currentEnv,
          fileName
        );
      } else {
        checkResult = this.validateProdFilename(this.model, fileName);
      }

      if (!checkResult) {
        this.fileList = [];
        this.uploadError = true;
        this.uploadErrorText = this.$t('firmware0015');
        return false;
      } else {
        return true;
      }
    },
    // 删除文件
    handleFileMove() {
      this.fileList = [];
    },
    handleUpload() {
      if (!this.btnEnable) return;
      const result = this.checkFile();
      if (!result) return;
      this.$psPageLoading().show();
      const formData = new FormData();

      this.fileList.forEach((file) => {
        formData.append('firmwareFile', file.raw);
      });
      formData.append('model', this.model);
      formData.append('version', this.version);
      formData.append('changelog', this.notes);
      this.$http
        .uploadFirmware(formData)
        .then((res) => {
          this.$emit('uploadSuccess');
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    handleCancel() {
      this.$emit('uploadCancel');
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-firmware__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;

  .popup {
    display: flex;
    flex-direction: column;
    width: 460px;
    padding: 20px;
    background: #f3f4f7;
    border-radius: 10px;

    .title {
      font-weight: bold;
      font-size: 16px;
      color: #000000;
      line-height: 19px;
    }

    .version__container {
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      .label {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 16px;
        margin-bottom: 4px;
      }

      .input {
        width: 100%;
        border-radius: 20px;
        border: 1px solid unset;
        overflow: hidden;

        ::v-deep .el-input {
          height: 100%;
          display: flex;

          .el-input__inner {
            height: 40px;
            line-height: 40px;
            display: flex;
            align-items: center;
            border: 1px solid transparent;
          }
          .el-input__inner:hover {
            border: 1px solid transparent;
          }
          .el-input__inner:focus {
            border: 1px solid transparent;
          }
        }
      }

      .border-error {
        border: 2px solid #f53d3d;
      }

      .border-focus {
        border: 2px solid #325bf2;
      }
      .error-text {
        font-weight: 400;
        font-size: 13px;
        color: #f53d3d;
        line-height: 15px;
      }
    }

    .file__container {
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      .label {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 16px;
        margin-bottom: 4px;
      }

      .upload__container {
        height: 100px;
        border-radius: 6px;
        border: 1px solid #e2e3e9;
        background: #fff;

        .upload-demo {
          width: 100%;
          height: 100%;

          ::v-deep .el-upload {
            width: 100%;
            height: 100%;
          }
        }

        .upload-btn__container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .icon {
            width: 24px;
            height: 24px;
            background: url("@/assets/icons/ic_add_blue.svg") no-repeat center;
            background-size: contain;
          }
          .des {
            font-weight: 400;
            font-size: 14px;
            color: #000000;
            line-height: 16px;
            margin-top: 8px;
          }
        }
      }

      .border-error {
        border: 2px solid #f53d3d;
      }

      .error-text {
        font-weight: 400;
        font-size: 13px;
        color: #f53d3d;
        margin-top: 4px;
      }

      .checked-file__container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background: #f2f2f2;
        border-radius: 6px;
        padding: 12px 10px;

        .left {
          display: flex;
          align-items: center;
          .file-icon {
            width: 24px;
            height: 24px;
            background: url("@/assets/icons/ic_file.svg") no-repeat center;
            background-size: contain;
          }
          .file-name {
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            line-height: 16px;
            margin-left: 10px;
          }
        }

        .right {
          width: 24px;
          height: 24px;
          background: url("@/assets/icons/ic_del.svg") no-repeat center;
          background-size: contain;
          cursor: pointer;
        }
      }
    }

    .notes__container {
      display: flex;
      flex-direction: column;
      margin-top: 30px;
      .label {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 16px;
        margin-bottom: 4px;
      }

      ::v-deep .el-textarea {
        textarea {
          height: 136px;
          border-radius: 6px;
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          line-height: 16px;
          padding: 12px;
        }
        .el-textarea__inner {
          border: 1px solid transparent;
        }

        textarea:hover {
          border: 2px solid #325bf2;
        }

        textarea:focus {
          border: 2px solid #325bf2;
        }
      }
    }

    .btn-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;

      .btn-confirm-disabled {
        opacity: 0.25;
        cursor: not-allowed;
      }
    }
  }
}
</style>
