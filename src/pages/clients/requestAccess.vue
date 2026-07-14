<template>
  <div class="request-access__wrapper">
    <div class="popup">
      <div class="title">{{ $t("altLogin0019") }}</div>
      <div class="description">{{ $t('altLogin0020') }}</div>
      <div class="item__container">
        <div class="label">{{ $t("altLogin0010") }} *</div>
        <div class="language-selector">
          <el-select
            v-model="duration"
            popper-class="language-selector-popper"
          >
            <el-option
              style="margin-right: 20px"
              v-for="language in durationList"
              :key="language.value"
              :label="language.label"
              :value="language.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item__container">
        <div class="label">{{ $t("altLogin0011") }} *</div>
        <div class="language-selector">
          <el-select
            v-model="reason"
            popper-class="language-selector-popper"
          >
            <el-option
              style="margin-right: 20px"
              v-for="language in reasonList"
              :key="language.value"
              :label="language.label"
              :value="language.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="notes__container">
        <div class="label">{{ $t("altLogin0022") }} *</div>
        <el-input
          type="textarea"
          :placeholder="$t('altLogin0021')"
          :class="{
            'border-error': notesError,
          }"
          @focus="notesError = false"
          v-model="notes"
          resize="none"
        >
        </el-input>
        <div class="error-text" v-if="notesError">
          {{ notesErrorText }}
        </div>
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
          :text="$t('altLogin0023')"
          :width="175"
          :height="36"
          @click.native="confirm"
        >
        </ConfirmButton>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RequestAccess',
  props: {
    currentTenant: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      duration: 24,
      durationList: [
        {
          value: 24,
          label: '24 ' + this.$t('altLogin0012')
        },
        {
          value: 168,
          label: '7 ' + this.$t('altLogin0013')
        },
        {
          value: 336,
          label: '14 ' + this.$t('altLogin0013')
        },
        {
          value: 720,
          label: '30 ' + this.$t('altLogin0013')
        },
        {
          value: 1440,
          label: '60 ' + this.$t('altLogin0013')
        }
      ],
      reason: 1,
      reasonList: [
        {
          value: 1,
          label: this.$t('altLogin0014')
        },
        {
          value: 2,
          label: this.$t('altLogin0015')
        },
        {
          value: 3,
          label: this.$t('altLogin0016')
        },
        {
          value: 4,
          label: this.$t('altLogin0017')
        },
        {
          value: 5,
          label: this.$t('altLogin0018')
        }
      ],
      notes: '',
      notesError: false,
      notesErrorText: ''
    };
  },
  methods: {
    confirm() {
      if (this.notes.trim().length === 0 || this.notes.trim().length < 20) {
        this.notesError = true;
        this.notesErrorText = this.$t('lengthMin', { length: 20 });
        return;
      }
      const payload = {
        reason: this.reason,
        durationHours: this.duration,
        additionalContext: this.notes
      };
      this.$psPageLoading().show();
      this.$http
        .createRequestAccess(this.currentTenant.id, payload)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.$emit('closeIt', true);
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    handleCancel() {
      this.$emit('closeIt');
    }
  }
};
</script>

<style lang="scss" scoped>
.request-access__wrapper {
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
    }

    .description {
      font-size: 14px;
      font-weight: 400;
      color: #666F99;
      padding-bottom: 10px;
      padding-top: 3px;
      border-bottom: 1px solid #D6DBEB;
    }

    .item__container {
      display: flex;
      flex-direction: column;
      margin-top: 12px;

      .label {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 16px;
        margin-bottom: 4px;
      }
    }

    .notes__container {
      display: flex;
      flex-direction: column;
      margin-top: 12px;
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
      .border-error {
        ::v-deep textarea {
          border: 2px solid #f53d3d !important;
        }
      }
      .error-text {
        font-weight: 400;
        font-size: 13px;
        color: #f53d3d;
        line-height: 15px;
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
