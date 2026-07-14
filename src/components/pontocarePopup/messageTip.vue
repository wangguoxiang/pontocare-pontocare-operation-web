<template>
  <div class="message-tip__wrap">
    <div class="popup">
      <img :src="img" alt="" class="img" />
      <div class="title">{{title}}</div>
      <div class="des">{{description}}</div>
      <div class="btn" @click="onConfirm">{{confirmText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'messageTip',
  props: {
    img: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'OK'
    }
  },
  mounted() {
    this.$elWrapper = document.createElement('div'); // 创建一个新的 div
    this.$elWrapper.classList.add('message-tip__wrap-container');
    document.body.appendChild(this.$elWrapper);
    this.$elWrapper.appendChild(this.$el); // 把当前组件的根元素插入
  },
  beforeDestroy() {
    if (this.$elWrapper) {
      document.body.removeChild(this.$elWrapper); // 确保销毁时移除
    }
  },
  methods: {
    onConfirm() {
      this.$emit('onConfirm');
    }
  }
};
</script>

<style lang="scss" scoped>
.message-tip__wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  .popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 360px;
    background: #ffffff;
    border-radius: 10px;
    padding: 30px 20px 20px 20px;

    .img {
      width: 100px;
      height: 100px;
    }

    .title {
      font-weight: 600;
      font-size: 17px;
      color: #222e61;
      margin-top: 10px;
    }

    .des {
      font-weight: 400;
      font-size: 15px;
      color: #222e61;
      text-align: center;
      margin-top: 10px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      border-radius: 24px;
      background: #325BF2;
      font-weight: 400;
      font-size: 15px;
      color: #ffffff;
      margin-top: 30px;
      cursor: pointer;
    }

    .btn:hover{
      background: #5779f4;
      box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
    }
    .btn:active{
      background: #0f3ff0;
      box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
    }
  }
}
</style>
