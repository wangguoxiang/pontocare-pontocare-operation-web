<template>
  <el-drawer
    :title="$t('associatedAdmins')"
    :visible.sync="showOutDrawer"
    @close="close"
    :size="567"
  >
    <div class="drawer-content">
      <div class="content">
        <el-input
          v-model="filterParams"
          :placeholder="$t('name')"
          class="filter"
        >
          <div slot="prefix" class="icon-input-search"></div>
        </el-input>
        <div class="item-header">
          <div class="header-item">{{ $t("name") }}</div>
          <div class="header-item">{{ $t("email") }}</div>
        </div>
        <div class="item-list" ref="table">
          <div v-for="user in filterAdminList"
               :key="user.userId"
               class="detail-item">
            <el-popover
              placement="left"
              width="400"
              trigger="hover"
              :open-delay="500"
              @show="getDetail(user)"
              @hide="detail = {}"
              :visible-arrow="false"
              popper-class="members-home-access-popover"
            >
              <div class="home-access-detail">
                <div class="home-access-detail-item">
                  <div class="label">{{ $t("name") }}</div>
                  <div class="content">{{ detail.name }}</div>
                </div>
                <div class="home-access-detail-item">
                  <div class="label">{{ $t("email") }}</div>
                  <div class="content">{{ detail.email }}</div>
                </div>
                <div class="home-access-detail-item">
                  <div class="label">{{ $t("registrationStatus") }}</div>
                  <div class="content">
                    {{
                      detail.state === 0
                        ? $t("invited")
                        : detail.state === 10
                          ? $t("registered")
                          : ""
                    }}
                  </div>
                </div>
                <div class="home-access-detail-item">
                  <div class="label">{{ $t("organization") }}</div>
                  <div class="content">{{ detail.tenantName }}</div>
                </div>
                <div class="home-access-detail-item">
                  <div class="label">{{ $t("addedDate") }}</div>
                  <div class="content">
                    {{ formatTableTime(detail.createTime) }}
                  </div>
                </div>
                <div class="home-access-detail-item">
                  <div class="label">{{ $t("id") }}</div>
                  <div class="content">{{ detail.id }}</div>
                </div>
              </div>
              <div slot="reference">
                <div class="item user-name">{{ user.userName }}</div>
              </div>
            </el-popover>
            <div class="item">
              <ps-tool-tip :content="user.email"></ps-tool-tip>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="btn-group">
          <CancelButton
            :text="$t('cancel')"
            :width="120"
            @click.native="close"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { formatTableTime } from '@/utils';
export default {
  name: 'AdminListDrawer',
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    adminList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      filterParams: '',
      detail: {}
    };
  },
  computed: {
    filterAdminList() {
      return this.adminList.filter(item => item.userName.toLowerCase().includes(this.filterParams.trim().toLowerCase()));
    },
    showOutDrawer: {
      get() {
        return this.showDrawer;
      },
      set(value) {
        this.$emit('update:showDrawer', value);
      }
    }
  },
  methods: {
    formatTableTime,
    getDetail(item) {
      this.$http.getMemberDetail(item?.userId).then((res) => {
        this.detail = res.records[0];
      });
    },
    close() {
      this.showOutDrawer = false;
      this.filterParams = '';
      if (this.$refs.table) {
        this.$refs.table.scrollTop = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .content {
    margin-top: 20px;
    padding: 0 20px;
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    .filter {
      margin-bottom: 12px;
      ::v-deep .el-input__inner {
        height: 36px;
        border-radius: 20px;
        border: 1px solid transparent;
        background-color: #F7F7FA;
      }
      ::v-deep .el-input__inner:hover {
        border: 1px solid #325bf2;
      }
      ::v-deep .el-input__inner:focus {
        border: 2px solid #325bf2;
      }
      ::v-deep .el-input__prefix {
        display: flex;
        align-items: center;
        margin-left: 2px;
        .icon-input-search {
          width: 18px;
          height: 18px;
          background: url("@/assets/icons/ic_search.svg") no-repeat center;
          background-size: contain;
        }
      }
    }
    .item-header {
      height: 39px;
      display: flex;
      padding: 10px 16px;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: #7982a6;
      border-radius: 5px;
      background: #efeff5;
      gap: 20px;
      .header-item {
        width: 250px;
      }
    }
    .item-list {
      overflow-y: auto;
      flex: 1;
      .detail-item {
        display: flex;
        padding: 15px;
        border-bottom: 1px solid rgba(22, 35, 71, 0.06);
        gap: 10px;
        .item {
          width: 250px;
          font-size: 14px;
          font-weight: normal;
          color: #222e61;
        }
        .user-name:hover {
          color: #325bf2;
        }
        .user-name {
          font-size: 14px;
          font-weight: normal;
          color: #222e61;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: pre;
          text-decoration: underline;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: 0;
    .btn-group {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid rgba(51, 73, 153, 0.2);
      padding-right: 16px;
    }
  }
}
</style>
