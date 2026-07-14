<template>
  <div class="add-failed">
    <div class="popup">
      <div class="img-failed"></div>
      <div class="title">{{ $t("devicefail001") }}</div>
      <div class="text">
        {{ $t("devicefail002") }}
      </div>
      <div class="file-feedback">
        <div class="icon-file"></div>
        <span>{{ fileName }}</span>
      </div>

      <div class="btn-group">
        <div class="btn-cancel" @click="handleIgnore">{{ $t("ignore") }}</div>
        <div class="btn-add" @click="handleDownload">{{ $t("download") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddFailed',
  props: {
    fileName: String
  },
  methods: {
    handleDownload() {
      this.$emit('downloadFeedback');
    },
    handleIgnore() {
      this.$emit('ignoreFeedback');
    }
  }
};
</script>

  <style lang="scss" scoped>
  .add-failed {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .popup {
      width: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-radius: 20px;
      background: #f3f4f7;

      .img-failed {
        width: 100px;
        height: 100px;
        background: url("@/assets/imgs/img_error.svg") no-repeat center;
        background-size: contain;
      }

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #222e61;
        margin: 10px 0;
      }

      .text {
        width: 100%;
        font-size: 14px;
        color: #222e61;
        text-align: center;
      }

      .file-feedback {
        width: 100%;
        height: 30px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.7);
        margin-top: 20px;
        display: flex;
        align-items: center;
        padding: 0 10px;
      }

      .icon-file {
        width: 18px;
        height: 18px;
        background: url("@/assets/icons/ic_file.svg") no-repeat center;
        background-size: contain;
      }
      span {
        font-size: 14px;
        color: #7982a6;
        margin-left: 6px;
      }

      .btn-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-top: 20px;

        > div {
          flex: 1;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 24px;
          font-size: 14px;
        }

        .btn-add {
          background: #325bf2;
          box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
          color: #ffffff;
        }

        .btn-add:hover {
          background: #5779f4;
          box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        }

        .btn-add:active {
          background: #0f3ff0;
          box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        }

        .btn-cancel {
          border: 1px solid rgba(51, 73, 153, 0.2);
          color: #292d3d;
          background: #fff;
        }

        .btn-cancel:hover {
          background: #f3f4f7;
          border: 1px solid rgba(51, 73, 153, 0.2);
        }
        .btn-cancel:active {
          background: #edeef3;
          border: 1px solid rgba(51, 73, 153, 0.2);
        }
      }
    }
  }
  </style>
