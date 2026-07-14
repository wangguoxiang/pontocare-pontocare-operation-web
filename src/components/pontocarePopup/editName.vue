<template>
  <div class="members-edit-name__wrapper">
    <div class="popup">
      <div class="title">{{ $t('editOrganizationName') }}</div>
      <el-input
        :placeholder="$t('pleaseEnter')"
        v-model="editName"
        @focus="handleNameFocus"
        @blur="handleNameBlur"
        :class="{ 'error-input': editNameError }"
      >
      </el-input>
      <div class="error-text" v-if="editNameError">{{ editNameErrorText }}</div>
      <div class="btn-group">
        <CancelButton :widht="175"
                      :height="36"
                      :text="$t('cancel')"
                      @click.native="closePopup" />
        <ConfirmButton :widht="175"
                       :height="36"
                       :text="$t('save')"
                       @click.native="handleEditName" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentName: [String, Number]
  },
  data() {
    return {
      editName: '',
      editNameError: false,
      editNameErrorText: ''
    };
  },
  created() {
    this.editName = this.currentName;
  },
  methods: {
    handleNameFocus() {
      this.editNameError = false;
    },
    handleNameBlur() {
      this.editName = this.editName.trim();
      this.checkName();
    },
    checkName() {
      if (this.editName.length === 0) {
        this.editNameErrorText = this.$t('nameNotEmpty');
        this.editNameError = true;
        return;
      }
      this.editNameErrorText = '';
      this.editNameError = false;
    },
    closePopup() {
      this.$emit('closeEditNamePopup');
    },
    handleEditName() {
      this.checkName();
      if (this.editNameError) {
        return;
      }
      this.$emit('confirmEditName', this.editName);
    }
  }
};
</script>

<style lang="scss" scoped>
.members-edit-name__wrapper {
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

    ::v-deep .el-input {
      margin-top: 20px;
      height: 36px;
      .el-input__inner {
        height: 36px;
        border-radius: 20px;
        border: 1px solid transparent;
      }
      .el-input__inner:hover,
      .el-input__inner:focus {
        border: 2px solid #325bf2;
      }
    }

    .error-input {
      ::v-deep .el-input__inner {
        border: 2px solid #ff2c50;
      }
    }
    .error-text {
      font-weight: 400;
      font-size: 12px;
      color: #ff2c50;
      line-height: 14px;
      margin-top: 4px;
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
