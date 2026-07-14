<template>
  <div class="yes-content__wrapper">
    <div class="popup">
      <div class="content">
        <div class="title" v-if="isNotEmpty(yesNote.assistanceNeeded)">
          {{ $t("assistanceNeeded") }}
        </div>
        <div class="radio-select" v-if="isNotEmpty(yesNote.assistanceNeeded)">
          <div class="role-item">
            {{yesNote.assistanceNeeded ? $t('yes') : $t('no')}}
          </div>
        </div>
        <div v-if="yesNote.assistanceNeeded && isNotEmpty(yesNote.assistedBy)" class="desc">
          <div class="desc-title">{{$t('whoHelped')}}</div>
          <div class="role-item">{{yesNote.assistedBy}}</div>
        </div>
        <div class="title" v-if="isNotEmpty(yesNote.residentInjured)" style="margin-top: 20px">
          {{ $t("residentInjured") }}
        </div>
        <div class="radio-select" v-if="isNotEmpty(yesNote.residentInjured)">
          <div class="role-item">
            {{yesNote.residentInjured ? $t('yes') : $t('no')}}
          </div>
        </div>
        <div v-if="yesNote.residentInjured && isNotEmpty(yesNote.injuryType)" class="desc">
          <div class="desc-title">{{$t('bruiseType')}}</div>
          <div class="role-item">{{yesNote.injuryType}}</div>
        </div>
        <div class="title" v-if="isNotEmpty(yesNote.hospitalized)" style="margin-top: 20px">
          {{ $t("residentHospitalized") }}
        </div>
        <div class="radio-select" v-if="isNotEmpty(yesNote.hospitalized)">
          <div class="role-item">
            {{yesNote.hospitalized ? $t('yes') : $t('no')}}
          </div>
        </div>
        <div class="title" v-if="isNotEmpty(yesNote.suspectedCause)" style="margin-top: 20px">
          {{ $t("suspectedCause") }}
        </div>
        <div class="suspectedCause-radio-select" v-if="isNotEmpty(yesNote.suspectedCause)">
          <div class="role-item">
            {{$t(yesNote.suspectedCause)}}
          </div>
          <div class="role-item" v-if="yesNote.suspectedCause==='other' && isNotEmpty(yesNote.otherCause)">{{yesNote.otherCause}}</div>
        </div>
        <div class="title" v-if="isNotEmpty(yesNote.notes)" style="margin-top: 20px">
          {{ $t("notesIfAny") }}
        </div>
        <div class="role-item" v-if="isNotEmpty(yesNote.notes)">{{yesNote.notes}}</div>
      </div>

      <div class="btn-group">
        <CancelButton style="width: 100%" :text="$t('cancel')"  @click.native="$emit('cancel')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'yesContent',
  props: {
    yesNote: Object
  },
  methods: {
    isNotEmpty(val) {
      return val !== null && val !== undefined && val !== '';
    }
  }
};
</script>

<style lang="scss" scoped>
.yes-content__wrapper {
  position: fixed;
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
    display: flex;
    flex-direction: column;
    width: 400px;
    border-radius: 10px;
    background: #F3F4F7;
    padding: 20px 3px 20px 20px;

    .content {
      padding-right: 3px;
      max-height: 600px;
      overflow-y: auto;
      .title {
        font-size: 17px;
        font-weight: 600;
        color: #222e61;
        margin-bottom: 15px;
      }
      .role-item {
        width: 100%;
        min-height: 36px;
        max-height: 72px;
        overflow-y: auto;
        word-break: break-all;
        display: flex;
        padding: 10px 15px;
        border-radius: 18px;
        font-size: 14px;
        font-weight: normal;
        color: rgba(0, 0, 0, 0.3);
        background: rgba(184, 193, 224, 0.3);
        scrollbar-gutter: stable;
        scrollbar-color: #8B8B8B transparent;
        .select-icon {
          margin-right: 7px;
          width: 18px;
          height: 18px;
          background: url("@/assets/icons/ic_radio_selected.svg") no-repeat center;
        }
        .no-select-icon {
          margin-right: 7px;
          width: 18px;
          height: 18px;
          background: url("@/assets/icons/ic_radio_not_selected.svg") no-repeat center;
        }
      }
      .radio-select {
        display: flex;
        justify-content: space-between;
        gap: 6px;
      }
      .suspectedCause-radio-select {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .desc {
        margin-top: 10px;
        .desc-title {
          font-size: 15px;
          font-weight: normal;
          color: #222E61;
          margin-bottom: 10px;
        }
      }
    }

    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-right: 17px;
      .btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        border-radius: 20px;
      }

      .btn-skip,
      .btn-cancel {
        border: 1px solid #d3d5de;
        font-size: 15px;
        color: #222e61;
        cursor: pointer;
        background: #fff;
      }
      .btn-skip:hover,
      .btn-cancel:hover {
        background: #F3F4F7;
      }
      .btn-save:hover {
        background: #5779F4;
      }
      .btn-save {
        font-size: 15px;
        color: #ffffff;
        background: #325bf2;
        box-shadow: 0px 4px 6px 0px rgba(72, 149, 255, 0.2);
        margin-left: 15px;
        cursor: pointer;
      }

      .disable {
        background: #325bf2;
        opacity: 0.25;
      }
    }
  }

  .loading{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
}
</style>
