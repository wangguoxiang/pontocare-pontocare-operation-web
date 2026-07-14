<template>
  <div class="name-list-dialog__wrapper">
    <div class="popup">
      <div class="title">
        {{title}}
        <i class="el-icon-close" style="float: right;cursor: pointer;font-size: 22px" @click="closePopup"></i>
      </div>
      <div class="tool">
        <el-input
          class="input-name"
          :class="{'input-not-empty': name !== ''}"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          :placeholder="nameFocus ? '' : placeholderName"
          v-model="name"
        >
          <span v-if="nameFocus || name"
                slot="prefix"
                class="prefix-name"
          >{{ placeholderName }}</span
          >
          <span
            v-if="name"
            slot="suffix"
            class="icon-clean"
            @click="name = ''"
          ></span>
        </el-input>
        <el-tooltip effect="light"
                    :visible-arrow="false"
                    :content="$t('search')"
                    placement="bottom-end">
          <div class="btn-search" @click="searchList"></div>
        </el-tooltip>
        <el-tooltip effect="light"
                    :visible-arrow="false"
                    :content="$t('clear')"
                    placement="bottom-end">
          <div class="btn-clear" @click="clearList"></div>
        </el-tooltip>
      </div>
      <div class="list">
        <div v-for="(item, index) in chunkedItems" :key="index">
          <div class="nameRow">
            <div v-for="(subItem, subIndex) in item" :key="subIndex" class="name">
              <el-popover
                placement="left-end"
                width="400"
                trigger="hover"
                :open-delay="500"
                @show="getDetail(subItem)"
                @hide="detail = {}"
                :visible-arrow="false"
                popper-class="members-home-access-popover"
              >
                <div class="home-access-detail" v-if="type === 'home'">
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('home') }}</div>
                    <div class="content">{{ detail.name }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('users') }}</div>
                    <div class="content" v-if="detail.users && detail.users.length > 0">
                      <span
                        class="home-access-list"
                        v-for="(member, index) in detail.users"
                        :key="index"
                      >{{ member.userName }}
                        {{
                          index != detail.users.length - 1 ? ", " : ""
                        }}</span>
                    </div>
                    <div class="content" v-else>-</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('associatedDevices') }}</div>
                    <div class="content">{{ detail.deviceCount }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('addedDate') }}</div>
                    <div class="content">
                      {{
                        formatTableTime(detail.createTime)
                      }}
                    </div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('homeID') }}</div>
                    <div class="content">{{ detail.id }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="action">
                      <div class="btn-review" @click="gotoHome(subItem)">
                        <div class="btn-review-icon"></div>
                        <span>{{ $t('viewInHomes') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="home-access-detail" v-if="type === 'member'">
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('user') }}</div>
                    <div class="content">{{ detail.name }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('userEmail') }}</div>
                    <div class="content">{{ detail.email }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('registrationStatus') }}</div>
                    <div class="content">{{ detail.state === 0
                      ? $t('invited')
                      : detail.state === 10
                        ? $t('registered')
                        : "" }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('homes') }}</div>
                    <div class="content">
                      <span
                        class="home-access-list"
                        v-for="(item, index) in detail.groups"
                        :key="index"
                      >{{ item.groupName
                      }}{{
                        index !== detail.groups.length - 1 ? ", " : ""
                      }}</span
                      >
                    </div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('addedDate') }}</div>
                    <div class="content">{{
                      formatTableTime(detail.createTime)
                    }}
                    </div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('userID') }}</div>
                    <div class="content">{{ detail.id }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="action">
                      <div class="btn-review" @click="gotoMember(subItem)">
                        <div class="btn-review-icon"></div>
                        <span>{{ $t('viewInUsers') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="home-access-detail" v-if="type === 'room'">
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('room') }}</div>
                    <div class="content">{{ detail.roomName }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('serialNumber') }}</div>
                    <div class="content">{{ detail.sn ? detail.sn : "-" }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('home') }}</div>
                    <div class="content">{{ detail.homeName }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('addedDate') }}</div>
                    <div class="content">{{ formatTableTime(detail.createTime) }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="label">{{ $t('roomID') }}</div>
                    <div class="content">{{ detail.roomId }}</div>
                  </div>
                  <div class="home-access-detail-item">
                    <div class="action">
                      <div class="btn-review" @click="gotoRoom(subItem)">
                        <div class="btn-review-icon"></div>
                        <span>{{ $t('viewInRooms') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div slot="reference">
                  {{ type === 'home' ? subItem?.groupName : type === 'member' ? subItem?.userName : subItem?.roomName }}
                </div>
              </el-popover>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTableTime } from '@/utils';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      name: '',
      nameFocus: false,
      dataResult: [],
      detail: {}
    };
  },
  computed: {
    chunkedItems() {
      return _.chunk(this.dataResult, 3);
    },
    placeholderName() {
      return this.type === 'home' ? this.$t('homeName') : (this.type === 'member' ? this.$t('userName') : this.$t('roomName'));
    }
  },
  mounted() {
    this.dataResult = this.data;
  },
  methods: {
    formatTableTime,
    searchList() {
      this.dataResult = this.data.filter((item) => {
        if (this.type === 'home') {
          return item?.groupName.toLowerCase().includes(this.name.trim().toLowerCase());
        }
        if (this.type === 'member') {
          return item?.userName.toLowerCase().includes(this.name.trim().toLowerCase());
        }
        if (this.type === 'room') {
          return item?.roomName.toLowerCase().includes(this.name.trim().toLowerCase());
        }
      });
    },
    clearList() {
      this.name = '';
      this.dataResult = this.data;
    },
    closePopup() {
      this.$emit('closePopup');
    },
    gotoHome(item) {
      this.$router.push({
        name: 'homes',
        params: {
          id: item?.groupId
        }
      });
    },
    gotoMember(item) {
      this.$router.push({
        name: 'users',
        params: {
          id: item?.userId
        }
      });
    },
    gotoRoom(item) {
      this.$router.push({
        name: 'rooms',
        params: {
          id: item?.roomId
        }
      });
    },
    getDetail(item) {
      if (this.type === 'home') {
        this.$http.getHomeDetail(item?.groupId).then((res) => {
          this.detail = res;
        });
      } else if (this.type === 'member') {
        this.$http.getMemberDetail(item?.userId).then((res) => {
          this.detail = res.records[0];
        });
      } else if (this.type === 'room') {
        this.$http.getRoomDetail(item?.roomId).then((res) => {
          this.detail = res;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.name-list-dialog__wrapper {
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
    width: 600px;
    background: #F3F4F7;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;

    .title {
      font-weight: 650;
      font-size: 16px;
      color: #222e61;
      line-height: 19px;
    }
    .tool {
      display: flex;
      margin: 20px 0 12px 0;
      .input-name{
        width: 180px;
        height: 36px;

        ::v-deep .el-input__inner {
          height: 36px;
          border-radius: 20px;
          border: 1px solid transparent;
          font-weight: 500;
          font-size: 14px;
          color: #222e61;
          line-height: 16px;
        }
        ::v-deep .el-input__inner:hover {
          border: 1px solid #325bf2;
        }
        ::v-deep .el-input__inner:focus {
          border: 2px solid #325bf2;
          padding: 16px 25px 4px 10px;
        }
        ::v-deep .el-input__inner::placeholder {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          font-weight: 400;
          font-size: 14px;
          color: #7982a6;
          line-height: 16px;
          text-align: left;
        }

        ::v-deep .el-input__prefix {
          left: 10px;
          height: 50%;
          .prefix-name,
          .prefix-email,
          .prefix-id {
            font-weight: 400;
            font-size: 11px;
            color: #7982a6;
            line-height: 12px;
            text-align: left;
          }
        }

        ::v-deep .el-input__suffix {
          width: 18px;
          right: 7px;

          .el-input__suffix-inner {
            display: flex;
            align-items: flex-end;
            width: 100%;
            height: 100%;
            padding-bottom: 4px;

            .icon-clean {
              width: 16px;
              height: 16px;
              background: url("@/assets/icons/ic_clean.svg") no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
          }
        }
      }
      .btn-search:hover,
      .btn-clear:hover {
        background-color: rgba(187, 197, 232, 0.6);
      }
      .btn-search,
      .btn-clear {
        width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        margin-left: 6px;
        cursor: pointer;
      }

      .btn-search {
        background: url("@/assets/icons/ic_search.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }

      .btn-clear {
        background: url("@/assets/icons/ic_clear.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
    }
    .list {
      border-radius: 10px;
      border: 1px solid rgba(22,35,71,0.06);
      overflow: auto;
      max-height: 400px;
      min-height: 200px;
      .nameRow {
        display: flex;
        padding: 16px;
        .name {
          flex: 0 0 33.33%;
          box-sizing: border-box;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 400;
          font-size: 14px;
          color: #666F99;
          overflow-wrap: break-word;
          width: 33.33%;
          padding-right: 15px;
        }
        .name:hover {
          color: #325BF2;
        }
      }
      ::v-deep .el-divider--horizontal {
        margin: 0;
      }
    }
  }
}
</style>
