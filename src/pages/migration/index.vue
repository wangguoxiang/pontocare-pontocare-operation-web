<template>
  <div class="migration__wrapper">
    <div class="search__container">
      <div class="left">
        <div class="register-status-selector">
          <el-select
            v-model="organizationId"
            placeholder=""
            :loading-text="$t('loading')"
            :no-data-text="$t('noData')"
            :clearable="true"
            filterable
            remote
            :reserve-keyword="true"
            :remote-method="remoteSearchOrg"
            :loading="orgLoading"
            :class="{ 'input-not-empty': organizationId !== '' }"
            popper-class="mark-selector"
            @change="handleChangeOrg"
            @focus="getOrgList"
            @clear="handleClearOrg"
          >
            <el-option
              v-for="item in organizationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
            <span slot="prefix" class="prefix-register-status">{{
              $t("organization")
            }}</span>
          </el-select>
        </div>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('refresh')"
          placement="bottom-end"
        >
          <div class="btn-refresh" @click="handleRefresh"></div>
        </el-tooltip>
        <div
          class="btn-migration"
          :class="{ 'btn-disabled': migrateDisabled }"
          @click="handleMigrate"
        >
          {{ $t('reseller0019') }}
        </div>
      </div>
      <div class="right">
        <div class="tab__wrappper">
          <div class="tab">
            <div
              class="tab-item"
              :class="{ 'current-item': currentTab == 0 }"
              @click="handleTabChange(0)"
            >
              {{ $t('reseller0020') }}
            </div>
            <div
              class="tab-item"
              :class="{ 'current-item': currentTab == 1 }"
              @click="handleTabChange(1)"
            >
              {{ $t('reseller0021') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content__container">
      <div class="left">
        <div class="home-card">
          <div class="checked__container">
            <span style="font-size: 14px; font-weight: 600; color: #222e61;display: flex;flex-shrink: 0;"
            >{{ $t('homes') }}:</span
            >
            <div class="home-label" ref="checkedContainer">
              <div
                class="label"
                v-for="(label, index) in homeVisibleList"
                :key="index"
              >
                <ps-tool-tip :content="label"></ps-tool-tip>
              </div>
              <el-tooltip
                placement="top"
                v-if="homeOverflow"
                effect="light"
                popper-class="label-tool-tip"
                :visible-arrow="false"
              >
                <div slot="content">
                  <div class="home-label-list">
                    <div
                      class="label-item"
                      v-for="(home, index) in homeSelectionList"
                      :key="index"
                    >
                      {{ home.name }}
                    </div>
                  </div>
                </div>
                <div class="label">
                  +{{ homeSelectionList.length - homeVisibleList.length }}
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="table__container" v-if="!homeLoading">
            <el-table
              :data="homeList"
              row-key="id"
              height="100%"
              border
              @selection-change="homeSelectionChange"
            >
              <template slot="empty">
                <img src="@/assets/icons/ic_empty.svg" alt="" />
                <div style="margin-top: 20px">{{ $t("noData") }}</div>
              </template>
              <el-table-column type="selection" width="50"> </el-table-column>

              <el-table-column prop="name">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("home") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.name"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>
              <el-table-column prop="date">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("addedDate") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div>{{ formatTableTime(scope.row.date) }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="id">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("homeID") }}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-loading" v-else>
            <div v-loading="true"></div>
          </div>
        </div>
        <div class="member-card">
          <div class="checked__container">
            <span style="font-size: 14px; font-weight: 600; color: #222e61;display: flex;flex-shrink: 0;"
            >{{$t('users')}}:</span
            >
            <div class="home-label" ref="memberCheckedContainer">
              <div
                class="label"
                v-for="(label, index) in memberVisibleList"
                :key="index"
              >
                <ps-tool-tip :content="label"></ps-tool-tip>
              </div>
              <el-tooltip
                placement="top"
                v-if="memberOverflow"
                effect="light"
                popper-class="label-tool-tip"
                :visible-arrow="false"
              >
                <div slot="content">
                  <div class="home-label-list">
                    <div
                      class="label-item"
                      v-for="(member, index) in memberSelectionList"
                      :key="index"
                    >
                      {{ member.name }}
                    </div>
                  </div>
                </div>
                <div class="label">
                  +{{ memberSelectionList.length - memberVisibleList.length }}
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="table__container" v-if="!memberLoading">
            <el-table
              v-if="currentTab == 0"
              key="table-radio"
              :data="memberList"
              row-key="id"
              height="100%"
              border
            >
              <template slot="empty">
                <img src="@/assets/icons/ic_empty.svg" alt="" />
                <div style="margin-top: 20px">{{ $t("noData") }}</div>
              </template>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedMemberId"
                    :label="scope.row.id"
                    @change="handleMemberSelect(scope.row)"
                  >
                  </el-radio>
                </template>
              </el-table-column>

              <el-table-column prop="name">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("user") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.name"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>

              <el-table-column prop="id">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("homeID") }}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="email" min-width="120">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("userEmail") }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.email"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>
              <el-table-column prop="type" min-width="120">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t('reseller0022') }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.type"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>
              <el-table-column prop="groups" min-width="120">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("associatedHomes") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div
                    class="amountNumber"
                    v-if="scope.row.groups && scope.row.groups.length > 0"
                  >
                    {{
                      scope.row.groups.map((item) => item.groupName).join(", ")
                    }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime">
                <template slot="header" slot-scope="scope">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("addedDate") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div>{{ formatTableTime(scope.row.createTime) }}</div>
                </template>
              </el-table-column>
            </el-table>

            <el-table
              v-if="currentTab == 1"
              key="table-checkbox"
              :data="memberList"
              row-key="id"
              height="100%"
              border
              @selection-change="memberSelectionChange"
            >
              <template slot="empty">
                <img src="@/assets/icons/ic_empty.svg" alt="" />
                <div style="margin-top: 20px">{{ $t("noData") }}</div>
              </template>
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column prop="name">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("user") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.name"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>

              <el-table-column prop="id">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("homeID") }}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="email" min-width="120">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("userEmail") }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.email"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>
              <el-table-column prop="type" min-width="120">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t('reseller0022') }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.type"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>
              <el-table-column prop="groups" min-width="120">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("associatedHomes") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div
                    class="amountNumber"
                    v-if="scope.row.groups && scope.row.groups.length > 0"
                  >
                    {{
                      scope.row.groups.map((item) => item.groupName).join(", ")
                    }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime">
                <template slot="header" slot-scope="scope">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("addedDate") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div>{{ formatTableTime(scope.row.createTime) }}</div>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("actions") }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <img
                    src="@/assets/icons/ic_upgrade.svg"
                    alt=""
                    style="cursor: pointer"
                    @click="upgrade(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-loading" v-else>
            <div v-loading="true"></div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="tenant-card">
          <div class="checked__container">
            <span style="font-size: 14px; font-weight: 600; color: #222e61;display: flex;flex-shrink: 0;"
            >{{ $t('clients') }}:</span
            >
            <div class="home-label">
              <div class="label" v-if="currentTenant">
                <ps-tool-tip :content="currentTenant?.name"></ps-tool-tip>
              </div>
            </div>
            <div
              class="btn-create"
              v-if="organizationId"
              @click="handleCreateTenant"
            >
              {{ $t('reseller0024') }}
            </div>
          </div>
          <div class="table__container" v-if="!tenantLoading">
            <el-table :data="tenantList"
                      row-key="id"
                      height="100%"
                      border>
              <template slot="empty">
                <img src="@/assets/icons/ic_empty.svg" alt="" />
                <div style="margin-top: 20px">{{ $t("noData") }}</div>
              </template>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedTenantId"
                    :label="scope.row.id"
                    @change="handleTenantSelect(scope.row)"
                  >
                  </el-radio>
                </template>
              </el-table-column>

              <el-table-column prop="name" min-width="90">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("organization") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.name"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>

              <el-table-column prop="email" min-width="150">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("tenantEmail") }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <ps-tool-tip
                    :content="scope.row.email"
                    :lines="5"
                  ></ps-tool-tip>
                </template>
              </el-table-column>

              <el-table-column prop="users" min-width="150">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t('associatedUsers') }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div v-if="scope.row.users && scope.row.users.length > 0">
                    {{ scope.row.users.length }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>

              <el-table-column prop="homes" min-width="116">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">
                      {{ $t("associatedHomes") }}
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div v-if="scope.row.homes && scope.row.homes.length > 0">
                    {{ scope.row.homes.length }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>

              <el-table-column prop="createTime" min-width="116">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("addedDate") }}</div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div>{{ formatTableTime(scope.row.createTime) }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="id" min-width="116">
                <template slot="header">
                  <div class="table-header-sort">
                    <div class="table-header-text">{{ $t("tenantID") }}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-loading" v-else>
            <div v-loading="true"></div>
          </div>
        </div>
      </div>
    </div>

    <AddTenant
      v-if="showAddTenant"
      @closeAddTenant="closeAddTenant"
      :tenantId="organizationId"
      :type="currentTab === 0 ? 1 : 0"
    />
  </div>
</template>

<script>
import { formatTableTime, formatYMDTime, secondsToHours } from '@/utils';
import AddTenant from './addTenant.vue';

export default {
  components: {
    AddTenant
  },
  data() {
    return {
      currentTab: 0,
      organizationFocus: false,
      organizationId: '',
      organizationList: [],
      orgLoading: false,
      orgSearchTimer: null,

      // home card
      homeList: [],
      homeVisibleList: [],
      homeOverflow: false,
      homeSelectionList: [],
      homeLoading: false,

      // member card
      memberList: [],
      memberVisibleList: [],
      memberOverflow: false,
      memberSelectionList: [],
      selectedMemberId: null,
      memberLoading: false,

      // tenant card
      tenantList: [],
      currentTenant: null,
      selectedTenantId: null,
      tenantLoading: false,

      // add tenant
      showAddTenant: false
    };
  },
  mounted() {
    this.getOrgList().then(() => {
      this.loadParamsFromQuery();
    });
  },
  beforeDestroy() {
    if (this.orgSearchTimer) {
      clearTimeout(this.orgSearchTimer);
      this.orgSearchTimer = null;
    }
  },
  computed: {
    migrateDisabled() {
      if (!this.organizationId) {
        return true;
      } else if (this.currentTab === 0) {
        // 个人
        return (
          this.homeSelectionList.length === 0 ||
          this.memberSelectionList.length !== 1 ||
          !this.selectedTenantId
        );
      } else if (this.currentTab === 1) {
        // 组织
        return (
          this.homeSelectionList.length === 0 ||
          this.memberSelectionList.length === 0 ||
          !this.selectedTenantId
        );
      } else {
        return true;
      }
    }
  },
  methods: {
    formatTableTime,
    secondsToHours,
    formatYMDTime,
    remoteSearchOrg(query) {
      const keyword = (query || '').trim();
      if (this.orgSearchTimer) {
        clearTimeout(this.orgSearchTimer);
        this.orgSearchTimer = null;
      }
      // 防抖
      this.orgSearchTimer = setTimeout(() => {
        this.orgLoading = true;
        const params = { name: keyword };
        this.$http
          .getTenantList(params)
          .then((res) => {
            this.organizationList = res || [];
          })
          .finally(() => {
            this.orgLoading = false;
          });
      }, 500);
    },
    // 组织下拉列表
    getOrgList() {
      const params = {
        name: ''
      };
      return this.$http
        .getTenantList(params)
        .then((res) => {
          this.organizationList = res || [];
        });
    },
    getHomeList() {
      this.homeLoading = true;
      this.$http.getHomeListByTenantId()
        .then((res) => {
          const tenantName = this.organizationList.find(
            (item) => item.id === this.organizationId
          ).name;
          this.homeList = res.records.filter(
            (item) => item.tenantName === tenantName
          );
        })
        .finally(() => {
          this.homeLoading = false;
        });
    },
    getMemberList() {
      this.memberLoading = true;
      this.$http.getMemberListByTenantId()
        .then((res) => {
          this.memberList = res.records.filter(
            (item) => item.tenantId === this.organizationId
          );
        })
        .finally(() => {
          this.memberLoading = false;
        });
    },
    getTenantList() {
      this.tenantLoading = true;
      const type = this.currentTab === 0 ? 1 : 0;
      this.$http
        .getTenantListByDistributorId(this.organizationId, type)
        .then((res) => {
          this.tenantList = res || [];
        })
        .finally(() => {
          this.tenantLoading = false;
        });
    },
    handleChangeOrg() {
      if (!this.organizationId) return;
      this.updateQueryParams();
      this.getHomeList();
      this.getMemberList();
      this.getTenantList();
      this.homeSelectionList = [];
      this.memberSelectionList = [];
      this.selectedMemberId = null;
      this.selectedTenantId = null;
      this.selectedTenantId = null;
      this.homeVisibleList = [];
      this.homeOverflow = false;
      this.memberVisibleList = [];
      this.memberOverflow = false;
      this.currentTenant = null;
    },
    handleRefresh() {
      if (!this.organizationId) return;
      this.homeSelectionList = [];
      this.homeList = [];
      this.memberSelectionList = [];
      this.memberList = [];
      this.selectedMemberId = null;
      this.selectedTenantId = null;
      this.tenantList = [];
      this.homeVisibleList = [];
      this.homeOverflow = false;
      this.memberVisibleList = [];
      this.memberOverflow = false;
      this.currentTenant = null;
      this.getHomeList();
      this.getMemberList();
      this.getTenantList();
    },
    calculateHomeLabels() {
      this.homeVisibleList = [];
      this.homeOverflow = false;
      const checkedContainer = this.$refs.checkedContainer;
      if (!checkedContainer) return;
      let homeVisibleLabels = [];
      let homeHasOverflow = false;
      if (this.homeSelectionList && this.homeSelectionList.length > 0) {
        let totalWidth = 0;
        const tempDiv = document.createElement('div');
        tempDiv.className = 'temp-label';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '-9999px'; // 完全脱离布局，避免干扰,获取不到真实宽度
        document.body.appendChild(tempDiv);

        for (let i = 0; i < this.homeSelectionList.length; i++) {
          tempDiv.innerText = this.homeSelectionList[i].name;
          tempDiv.offsetWidth;
          const tempDivWidth = tempDiv.getBoundingClientRect().width;
          const tagWidth = tempDivWidth > 150 ? 150 : tempDivWidth + 16; // 16px是padding(2px*2) + gap(5px) + 其他间距

          if (totalWidth + tagWidth <= checkedContainer.offsetWidth - 30) {
            // 预留空间：标签文字宽度 + 省略号宽度 + 安全边距
            homeVisibleLabels.push(this.homeSelectionList[i].name);
            totalWidth += tagWidth;
          } else {
            homeHasOverflow = true;
            break;
          }
        }
        document.body.removeChild(tempDiv); // 清理临时元素
      }
      this.homeVisibleList = homeVisibleLabels;
      this.homeOverflow = homeHasOverflow;
    },
    homeSelectionChange(value) {
      this.homeSelectionList = value;
      this.$nextTick(() => {
        this.calculateHomeLabels();
      });
    },
    calculateMemberLabels() {
      this.memberVisibleList = [];
      this.memberOverflow = false;
      const checkedContainer = this.$refs.memberCheckedContainer;
      if (!checkedContainer) return;
      let memberVisibleList = [];
      let memberOverflow = false;
      if (this.memberSelectionList && this.memberSelectionList.length > 0) {
        let totalWidth = 0;
        const tempDiv = document.createElement('div');
        tempDiv.className = 'temp-label';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '-9999px';
        document.body.appendChild(tempDiv);

        for (let i = 0; i < this.memberSelectionList.length; i++) {
          tempDiv.innerText = this.memberSelectionList[i].name;
          tempDiv.offsetWidth;
          const tempDivWidth = tempDiv.getBoundingClientRect().width;
          const tagWidth = tempDivWidth > 150 ? 150 : tempDivWidth + 16; // padding(2px*2) + gap(5px) + 其他间距

          if (totalWidth + tagWidth <= checkedContainer.offsetWidth - 30) {
            memberVisibleList.push(this.memberSelectionList[i].name);
            totalWidth += tagWidth;
          } else {
            memberOverflow = true;
            break;
          }
        }
        document.body.removeChild(tempDiv); // 清理临时元素
      }
      this.memberVisibleList = memberVisibleList;
      this.memberOverflow = memberOverflow;
    },
    memberSelectionChange(value) {
      this.memberSelectionList = value;
      this.$nextTick(() => {
        this.calculateMemberLabels();
      });
    },
    handleMemberSelect(member) {
      this.memberSelectionList = [member];
      this.$nextTick(() => {
        this.calculateMemberLabels();
      });
    },
    handleTabChange(tabIndex) {
      this.currentTab = tabIndex;
      // 清空选择状态
      this.organizationId = '';
      this.homeSelectionList = [];
      this.homeList = [];
      this.memberSelectionList = [];
      this.memberList = [];
      this.selectedMemberId = null;
      this.selectedTenantId = null;
      this.tenantList = [];
      this.homeVisibleList = [];
      this.homeOverflow = false;
      this.memberVisibleList = [];
      this.memberOverflow = false;
      this.currentTenant = null;
    },
    handleTenantSelect(tenant) {
      this.currentTenant = tenant;
      this.selectedTenantId = tenant.id;
    },
    handleCreateTenant() {
      this.showAddTenant = true;
    },
    closeAddTenant(refresh) {
      this.showAddTenant = false;
      if (refresh) {
        this.getTenantList();
      }
    },
    upgrade(userId) {
      this.$http.upgradeUser(userId).then(() => {
        this.getMemberList();
      });
    },
    handleMigrate() {
      if (this.migrateDisabled) return;
      const params = {
        homeIds: this.homeSelectionList.map((item) => item.id),
        userIds: this.memberSelectionList.map((item) => item.id),
        fromTenantId: this.organizationId,
        toTenantId: this.selectedTenantId
      };
      this.$http.migrate(params).then(() => {
        this.handleChangeOrg();
      });
    },
    handleClearOrg() {
      this.organizationId = '';
      this.homeSelectionList = [];
      this.homeList = [];
      this.memberSelectionList = [];
      this.memberList = [];
      this.selectedMemberId = null;
      this.selectedTenantId = null;
      this.tenantList = [];
      this.homeVisibleList = [];
      this.homeOverflow = false;
      this.memberVisibleList = [];
      this.memberOverflow = false;
      this.currentTenant = null;
    },
    loadParamsFromQuery() {
      const query = this.$route.query || {};
      if (query.organizationId && query.organizationId !== '') {
        this.organizationId = +query.organizationId;
        this.handleChangeOrg();
      }
    },
    updateQueryParams() {
      const query = {};
      if (this.organizationId && this.organizationId !== '') {
        query.organizationId = this.organizationId;
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.migration__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;

  .search__container {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      gap: 6px;
      ::v-deep .el-input__inner {
        height: 36px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #e2e3e9;
        font-weight: 500;
        font-size: 14px;
        color: #222e61;
        line-height: 16px;
      }
      ::v-deep .el-input__inner:hover {
        border: 2px solid #325bf2;
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
        .prefix-filter {
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
      .btn-search,
      .btn-refresh,
      .btn-clear {
        min-width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
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
      .btn-refresh {
        background: url("@/assets/icons/ic_refresh.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
      .register-status-selector {
        max-width: 170px;
        min-width: 170px;
        height: 36px;
        ::v-deep .el-select {
          width: 100%;
          height: 100%;
          .el-input {
            height: 100%;

            .el-input__inner {
              height: 100%;
              background: #ffffff;
              border-radius: 10px;
              border: 1px solid #e2e3e9;
              font-weight: 500;
              font-size: 14px;
              color: #222e61;
              line-height: 16px;
            }
            .el-input__inner:hover {
              border: 1px solid #325bf2;
            }
            .el-input__prefix {
              left: 10px;
              .prefix-register-status {
                font-weight: 400;
                font-size: 11px;
                color: #7982a6;
                line-height: 12px;
                text-align: left;
              }
            }

            .el-input__inner::placeholder {
              position: absolute;
              top: calc(50% + 8px);
              left: 10px;
              font-weight: 400;
              font-size: 14px;
              color: #7982a6;
              line-height: 16px;
              text-align: left;
            }
            .el-input__suffix {
              .el-input__suffix-inner {
                .el-icon-arrow-up::before {
                  content: "";
                }
                .el-select__caret {
                  background: url("@/assets/icons/ic_inputbox_dropdown.svg")
                    no-repeat center;
                  background-size: 18px 18px;
                  transform: rotate(0deg);
                }

                .el-select__caret.is-reverse {
                  transform: rotate(180deg);
                }

                .el-icon-circle-close {
                  display: block !important;
                  background: url("@/assets/icons/ic_clean.svg") no-repeat
                    center;
                }
                .el-icon-circle-close:before {
                  content: ""; /* 使用 Unicode 字符表示向下的实心三角箭头 */
                }
              }
            }
          }
        }
      }

      .btn-migration {
        height: 36px;
        line-height: 36px;
        background: #325bf2;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        font-size: 14px;
        color: #ffffff;
        border-radius: 15px;
        padding: 0px 20px;
        cursor: pointer;
      }
      .btn-migration:hover {
        background: #5779f4;
      }
      .btn-disabled {
        background: rgba(50, 91, 242, 0.3);
        cursor: not-allowed;
      }
    }
    .right {
      height: 100%;
      .tab__wrappper {
        height: 100%;
        .tab {
          display: inline-flex;
          align-items: center;
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
            padding: 0 20px;
            cursor: pointer;
            background: #fff;
          }
          .tab-item:hover{
            background: rgba(187, 197, 232, 0.5);
          }
          .current-item {
            background: #325bf2;
            color: #fff;
          }
          .current-item:hover{
            background: #5779F4;
            box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
          }
        }
      }
    }
  }
  .content__container {
    flex: 1;
    min-height: 0;
    width: 100%;
    margin-top: 16px;
    display: flex;
    gap: 10px;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 0;
      .home-card,
      .member-card {
        background: #fff;
        border-radius: 20px;
        flex: 1; // 平分高度
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        min-height: 0;

        .checked__container {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          overflow: hidden;

          .home-label {
            flex: 1;
            display: flex;
            margin-left: 10px;
            gap: 5px;
            overflow: hidden;

            .label {
              height: 20px;
              max-width: 150px;
              font-size: 13px;
              color: #7982a6;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 2px 8px;
              border-radius: 20px;
              background: rgba(92, 118, 214, 0.15);
            }
          }
        }
        .table__container {
          width: 100%;
          flex: 1;
          min-height: 0;
          margin-top: 5px;
          ::v-deep .el-table {
            width: 100%;
            height: 100%;

            .el-table__fixed-right {
              z-index: 1;
              background-color: #FFFFFF;
              .el-table__fixed-header-wrapper {
                .el-table__header {
                  thead {
                    tr {
                      height: 100%;
                      th.el-table__cell {
                        height: 100%;
                        padding: 0;
                        .cell {
                          height: 100%;
                          padding: 0;
                        }
                      }
                    }
                  }
                }
              }
              .el-table__fixed-body-wrapper {
                .el-table__body {
                  tbody {
                    tr {
                      .el-table__cell {
                        padding: 12px 16px;
                        .cell {
                          padding: 0;
                          font-weight: 400;
                          font-size: 14px;
                          color: #666f99;
                          line-height: 20px;
                          div {
                            word-wrap: break-word;
                            word-break: normal;
                          }

                          //action 下拉菜单
                          .el-dropdown {
                            .icon-action {
                              width: 24px;
                              height: 24px;
                              border-radius: 5px;
                              background: url("@/assets/icons/ic_action.svg")
                                no-repeat center;
                              background-size: 18px 18px;
                              cursor: pointer;
                            }

                            .icon-action:hover {
                              background-color: rgba(102, 124, 204, 0.1);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            // 表头
            .el-table__header-wrapper {
              // height: 30px;
              .el-table__header {
                height: 100%;
                thead {
                  height: 100%;
                  tr {
                    height: 100%;

                    th.el-table__cell {
                      height: 100%;
                      padding: 0;
                      .cell {
                        height: 100%;
                        padding: 0;
                      }
                    }
                    th.el-table__cell::after {
                      content: "";
                      border: 1px solid #f0f0f4;
                      right: 2px;
                      position: absolute;
                      height: 15px;
                      top: 50%;
                      transform: translateY(-50%);
                    }
                    th.el-table__cell.el-table-column--selection {
                      .cell {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }
                    }
                    th.gutter::after {
                      border: 0 !important;
                    }
                  }
                }
              }
            }

            // 表体
            .el-table__body-wrapper {
              width: 100%;
              height: calc(100% - 30px);
              overflow-y: auto; // 在正确的容器上设置滚动

              .el-table__body {
                width: 100%;

                tbody {
                  width: 100%;

                  tr {
                    .el-table__cell {
                      padding: 12px 16px;
                      .cell {
                        padding: 0;
                        font-weight: 400;
                        font-size: 14px;
                        color: #666f99;
                        line-height: 20px;
                        div {
                          word-wrap: break-word;
                          word-break: normal;
                        }

                        .registration-status {
                          width: 100%;
                          height: 23px;
                          border-radius: 6px;
                          font-weight: 500;
                          font-size: 13px;
                          line-height: 23px;
                          text-align: center;
                        }
                        .evaluationStatus-selector {
                          height: 36px;
                          .high {
                            .el-input {
                              .el-input__inner {
                                color: #e81c1c !important;
                              }
                            }
                          }
                          .mid {
                            .el-input {
                              .el-input__inner {
                                color: #ee913c !important;
                              }
                            }
                          }
                          .el-select {
                            width: 100%;
                            height: 100%;
                            .el-input {
                              height: 100%;
                              .el-input__inner {
                                height: 100%;
                                background: #ffffff;
                                border-radius: 26px;
                                border: 1px solid #e2e3e9;
                                font-weight: 500;
                                font-size: 14px;
                                color: #7982a6;
                              }
                              .el-input__inner:hover {
                                border: 2px solid #325bf2;
                              }
                              .el-input__suffix {
                                .el-input__suffix-inner {
                                  .el-icon-arrow-up::before {
                                    content: "";
                                  }
                                  .el-select__caret {
                                    background: url("@/assets/icons/ic_inputbox_dropdown.svg")
                                      no-repeat center;
                                    background-size: 18px 18px;
                                    transform: rotate(0deg);
                                  }
                                  .el-select__caret.is-reverse {
                                    transform: rotate(180deg);
                                  }
                                }
                              }
                            }
                          }
                        }
                        .registered {
                          background: rgba(172, 255, 195, 0.5);
                          color: #009a07;
                        }

                        .invited {
                          background: rgba(153, 152, 152, 0.1);
                          color: #acb2c8;
                        }

                        //action 下拉菜单
                        .el-dropdown {
                          .icon-action {
                            width: 24px;
                            height: 24px;
                            border-radius: 5px;
                            background: url("@/assets/icons/ic_action.svg")
                              no-repeat center;
                            background-size: 18px 18px;
                            cursor: pointer;
                          }

                          .icon-action:hover {
                            background-color: rgba(102, 124, 204, 0.1);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .table-header-sort {
          display: flex;
          align-items: center;
          height: 100%;
          padding-left: 16px;
          padding-right: 3px;
          .table-header-text {
            font-weight: 500;
            font-size: 13px;
            color: #222e61;
            text-align: left;
            word-break: break-word;
          }
        }
        .table-loading{
          width: 100%;
          flex: 1;
          min-height: 0;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .right {
      flex: 1.2;
      width: 100%;
      min-width: 0;
      .tenant-card {
        background: #fff;
        border-radius: 20px;
        width: 100%;
        height: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        .checked__container {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          overflow: hidden;

          .home-label {
            flex: 1;
            display: flex;
            margin-left: 10px;
            gap: 5px;
            overflow: hidden;

            .label {
              height: 20px;
              max-width: 150px;
              font-size: 13px;
              color: #7982a6;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 2px 8px;
              border-radius: 20px;
              background: rgba(92, 118, 214, 0.15);
            }
          }

          .btn-create {
            height: 100%;
            background: #325bf2;
            box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
            color: #fff;
            font-size: 14px;
            color: #ffffff;
            border-radius: 24px;
            padding:0 10px;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
        }
        .table__container {
          width: 100%;
          flex: 1;
          min-height: 0;
          margin-top: 5px;
          ::v-deep .el-table {
            width: 100%;
            height: 100%;

            .el-table__fixed-right {
              z-index: 1;
              background-color: #FFFFFF;
              .el-table__fixed-header-wrapper {
                .el-table__header {
                  thead {
                    tr {
                      height: 100%;
                      th.el-table__cell {
                        height: 100%;
                        padding: 0;
                        .cell {
                          height: 100%;
                          padding: 0;
                        }
                      }
                    }
                  }
                }
              }
              .el-table__fixed-body-wrapper {
                .el-table__body {
                  tbody {
                    tr {
                      .el-table__cell {
                        padding: 12px 16px;
                        .cell {
                          padding: 0;
                          font-weight: 400;
                          font-size: 14px;
                          color: #666f99;
                          line-height: 20px;
                          div {
                            word-wrap: break-word;
                            word-break: normal;
                          }

                          //action 下拉菜单
                          .el-dropdown {
                            .icon-action {
                              width: 24px;
                              height: 24px;
                              border-radius: 5px;
                              background: url("@/assets/icons/ic_action.svg")
                                no-repeat center;
                              background-size: 18px 18px;
                              cursor: pointer;
                            }

                            .icon-action:hover {
                              background-color: rgba(102, 124, 204, 0.1);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            // 表头
            .el-table__header-wrapper {
              .el-table__header {
                height: 100%;
                thead {
                  height: 100%;
                  tr {
                    height: 100%;

                    th.el-table__cell {
                      height: 100%;
                      padding: 0;
                      .cell {
                        height: 100%;
                        padding: 0;
                      }
                    }
                    th.el-table__cell::after {
                      content: "";
                      border: 1px solid #f0f0f4;
                      right: 2px;
                      position: absolute;
                      height: 15px;
                      top: 50%;
                      transform: translateY(-50%);
                    }
                    th.el-table__cell.el-table-column--selection {
                      .cell {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }
                    }
                    th.gutter::after {
                      border: 0 !important;
                    }
                  }
                }
              }
            }

            // 表体
            .el-table__body-wrapper {
              width: 100%;
              height: calc(100% - 30px);
              overflow-y: auto; // 在正确的容器上设置滚动

              .el-table__body {
                width: 100%;

                tbody {
                  width: 100%;

                  tr {
                    .el-table__cell {
                      padding: 12px 16px;
                      .cell {
                        padding: 0;
                        font-weight: 400;
                        font-size: 14px;
                        color: #666f99;
                        line-height: 20px;
                        div {
                          word-wrap: break-word;
                          word-break: normal;
                        }

                        .registration-status {
                          width: 100%;
                          height: 23px;
                          border-radius: 6px;
                          font-weight: 500;
                          font-size: 13px;
                          line-height: 23px;
                          text-align: center;
                        }
                        .evaluationStatus-selector {
                          height: 36px;
                          .high {
                            .el-input {
                              .el-input__inner {
                                color: #e81c1c !important;
                              }
                            }
                          }
                          .mid {
                            .el-input {
                              .el-input__inner {
                                color: #ee913c !important;
                              }
                            }
                          }
                          .el-select {
                            width: 100%;
                            height: 100%;
                            .el-input {
                              height: 100%;
                              .el-input__inner {
                                height: 100%;
                                background: #ffffff;
                                border-radius: 26px;
                                border: 1px solid #e2e3e9;
                                font-weight: 500;
                                font-size: 14px;
                                color: #7982a6;
                              }
                              .el-input__inner:hover {
                                border: 2px solid #325bf2;
                              }
                              .el-input__suffix {
                                .el-input__suffix-inner {
                                  .el-icon-arrow-up::before {
                                    content: "";
                                  }
                                  .el-select__caret {
                                    background: url("@/assets/icons/ic_inputbox_dropdown.svg")
                                      no-repeat center;
                                    background-size: 18px 18px;
                                    transform: rotate(0deg);
                                  }
                                  .el-select__caret.is-reverse {
                                    transform: rotate(180deg);
                                  }
                                }
                              }
                            }
                          }
                        }
                        .registered {
                          background: rgba(172, 255, 195, 0.5);
                          color: #009a07;
                        }

                        .invited {
                          background: rgba(153, 152, 152, 0.1);
                          color: #acb2c8;
                        }

                        //action 下拉菜单
                        .el-dropdown {
                          .icon-action {
                            width: 24px;
                            height: 24px;
                            border-radius: 5px;
                            background: url("@/assets/icons/ic_action.svg")
                              no-repeat center;
                            background-size: 18px 18px;
                            cursor: pointer;
                          }

                          .icon-action:hover {
                            background-color: rgba(102, 124, 204, 0.1);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .table-loading{
          width: 100%;
          flex: 1;
          min-height: 0;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .table-header-sort {
          display: flex;
          align-items: center;
          height: 100%;
          padding-left: 16px;
          padding-right: 3px;
          .table-header-text {
            font-weight: 500;
            font-size: 13px;
            color: #222e61;
            text-align: left;
            word-break: break-word;
          }
        }
      }
    }
  }
}
</style>
