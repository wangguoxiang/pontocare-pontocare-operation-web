<template>
  <div class="client__wrapper">
    <div class="search__container">
      <div class="left">
        <el-input
          class="input-name"
          :class="{'input-not-empty': name !== ''}"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          :placeholder="nameFocus ? '' : $t('organization')"
          v-model="name"
        >
          <span v-if="nameFocus || name" slot="prefix" class="prefix-name">{{
            $t("organization")
          }}</span>
          <span
            v-if="name"
            slot="suffix"
            class="icon-clean"
            @click="name = ''"
          ></span>
        </el-input>

        <el-input
          class="input-email"
          :class="{'input-not-empty': email !== ''}"
          @focus="emailFocus = true"
          @blur="emailFocus = false"
          :placeholder="emailFocus ? '' : $t('tenantEmail')"
          v-model="email"
        >
          <span v-if="emailFocus || email" slot="prefix" class="prefix-email">{{
            $t("tenantEmail")
          }}</span>
          <span
            v-if="email"
            slot="suffix"
            class="icon-clean"
            @click="email = ''"
          ></span>
        </el-input>
        <div class="register-status-selector">
          <el-select
            v-model="role"
            :placeholder="$t('role')"
            :clearable="true"
            :class="{'input-not-empty': role !== ''}"
            popper-class="mark-selector"
          >
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
            <span
              slot="prefix"
              v-if="role !== ''"
              class="prefix-register-status"
            >{{ $t("role") }}</span
            >
          </el-select>
        </div>
        <div class="register-status-selector">
          <el-select
            v-model="activeStatus"
            :placeholder="$t('registrationStatus')"
            :clearable="true"
            :class="{'input-not-empty': activeStatus !== ''}"
            popper-class="mark-selector"
          >
            <el-option
              v-for="item in registerStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
            <span
              slot="prefix"
              v-if="activeStatus !== ''"
              class="prefix-register-status"
            >{{ $t("registrationStatus") }}</span
            >
          </el-select>
        </div>
        <div class="register-status-selector">
          <el-select
            v-model="evaluationStatus"
            :placeholder="$t('evaluationStatus')"
            :clearable="true"
            :class="{'input-not-empty': evaluationStatus !== ''}"
            popper-class="mark-selector"
          >
            <el-option
              v-for="item in evaluationStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
            <span
              slot="prefix"
              v-if="evaluationStatus !== ''"
              class="prefix-register-status"
            >{{ $t("evaluationStatus") }}</span
            >
          </el-select>
        </div>
        <el-input
          class="input-id"
          :class="{'input-not-empty': userId !== ''}"
          @focus="idFocus = true"
          @blur="idFocus = false"
          :placeholder="idFocus ? '' : $t('tenantID')"
          v-model="userId"
        >
          <span v-if="idFocus || userId" slot="prefix" class="prefix-id">{{
            $t("tenantID")
          }}</span>
          <span
            v-if="userId"
            slot="suffix"
            class="icon-clean"
            @click="userId = ''"
          ></span>
        </el-input>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('search')"
          placement="bottom-end"
        >
          <div class="btn-search" @click="searchList"></div>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('clear')"
          placement="bottom-end"
        >
          <div class="btn-clear" @click="clearList"></div>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          :content="$t('refresh')"
          placement="bottom-end"
        >
          <div class="btn-refresh" @click="getClientList()"></div>
        </el-tooltip>
      </div>
      <div class="right">
        <div class="btn-add-member" @click="fixTenant">
          Fix Tenant
        </div>
      </div>
    </div>
    <div class="table__container">
      <el-table
        :data="memberList"
        ref="table"
        row-key="id"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
        :row-style="{ height: '65px' }"
        @header-dragend="handleHeaderDragEnd"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column
          :selectable="selectable"
          type="selection">
        </el-table-column>
        <el-table-column prop="name" width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort === 'name' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'name')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected': sort === 'name' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'name')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'name' }"
              >
                {{ $t("organization") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.name" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          :label="$t('tenantEmail')"
          width="230"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("tenantEmail") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.email" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column
          prop="role"
          width="130"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("role") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <span>{{
              scope.row.roles ? parseRoles(scope.row.roles) : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="distributor"
          width="130"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("distributor") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <span>{{
              scope.row.distributorName ? ((scope.row.roles || []).includes(UserType.distributor) ? "-" : scope.row.distributorName) : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stripeCustomerId"
          width="130"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("stripeCustomerId") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <span>{{
              scope.row.stripeCustomerId ? scope.row.stripeCustomerId : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountExecutive"
          width="163"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("accountExecutive") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.accountExecutive ? scope.row.accountExecutive : '-'" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="status" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">
                {{ $t("registrationStatus") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div
              class="registration-status"
              :class="{
                registered: scope.row.registrationState === 10,
                invited: scope.row.registrationState === 0,
              }"
            >
              {{
                scope.row.registrationState === 0
                  ? $t("invited")
                  : scope.row.registrationState === 10
                    ? $t("registered")
                    : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="healthScore" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("evaluationStatus") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="evaluationStatus-selector">
              <el-select
                v-model="scope.row.healthScore"
                popper-class="language-selector-popper"
                @focus="tempEvaluationStatus = scope.row.healthScore"
                @change="changeEvaluationStatus($event, scope.row)"
                style="width: 95px"
                :class="
                  evaluationStatusList.find(
                    (item) => item.value === scope.row.healthScore
                  )?.class
                "
              >
                <el-option
                  style="margin-right: 20px"
                  v-for="item in evaluationStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="evaluationStartTime" min-width="180">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'evaluationStartTime' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'evaluationStartTime')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'evaluationStartTime' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'evaluationStartTime')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{
                  'current-sort-header': sort === 'evaluationStartTime',
                }"
              >
                {{ $t("evaluationStartDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <span
              class="underline"
              @click="updateEvaluationDate($event, scope.row, 'start')"
            >{{
              scope.row.evaluationStartTime
                ? formatYMDTime(scope.row.evaluationStartTime)
                : $t("add")
            }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="evaluationEndTime" min-width="180">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected':
                      sort === 'evaluationEndTime' && order === 'asc',
                  }"
                  @click="changeSort('asc', 'evaluationEndTime')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'evaluationEndTime' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'evaluationEndTime')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'evaluationEndTime' }"
              >
                {{ $t("evaluationEndDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <span
              class="underline"
              @click="updateEvaluationDate($event, scope.row, 'end')"
            >{{
              scope.row.evaluationEndTime
                ? formatYMDTime(scope.row.evaluationEndTime)
                : $t("add")
            }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="homes" min-width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("associatedHomes") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div
              class="underline"
              @click="openHomeList(scope.row.homes)"
              v-if="scope.row.homes && scope.row.homes.length > 0"
            >
              {{ scope.row.homes.length }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" width="200">
          <template slot="header" slot-scope="scope">
            <div class="table-header-sort">
              <div class="icon-sort">
                <div
                  class="sort-asc"
                  :class="{
                    'sort-asc-selected': sort == 'createTime' && order == 'asc',
                  }"
                  @click="changeSort('asc', 'createTime')"
                ></div>
                <div
                  class="sort-des"
                  :class="{
                    'sort-des-selected':
                      sort === 'createTime' && order === 'desc',
                  }"
                  @click="changeSort('desc', 'createTime')"
                ></div>
              </div>
              <div
                class="table-header-text"
                :class="{ 'current-sort-header': sort === 'createTime' }"
              >
                {{ $t("addedDate") }}
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div>{{ formatTableTime(scope.row.createTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="id" width="163">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("tenantID") }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="82" fixed="right">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("actions") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <div
                class="icon-action"
              ></div>
              <el-dropdown-menu slot="dropdown" class="members-action-dropdown">
                <el-dropdown-item :disabled="(scope.row.roles || []).includes(UserType.distributor)"
                                  :style="{ color: (scope.row.roles || []).includes(UserType.distributor) ? '#ACB2C8' : '' }"
                                  @click.native="handleEditClient(scope.row)">Set Distributor</el-dropdown-item>
                <el-dropdown-item :disabled="!(scope.row.roles || []).includes(UserType.distributor)"
                                  :style="{ color: !(scope.row.roles || []).includes(UserType.distributor) ? '#ACB2C8' : '' }"
                                  @click.native="addTenant(scope.row)">Add Tenant</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="page__container">
        <div class="page-total">{{ pageTotal }} {{ $t("inTotal") }}</div>
        <el-pagination
          layout="prev, pager, next"
          :total="pageTotal"
          :current-page="pageNo"
          :page-size="pageSize"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>

    <HandleClient
      v-if="showHandleClient"
      :currentClient="currentHandleClient"
      @closeHandleClient="closeHandleClient"
      @confirmHandleClientSuccess="confirmHandleClientSuccess"
    />
    <AddTenant
      v-if="showAddTenantDialog"
      :currentClient="currentHandleClient"
      @closeHandleClient="showAddTenantDialog = false"
      @confirmAddTenantSuccess="confirmAddTenantSuccess"
    />
    <PsHandleResult
      v-if="showHandleResult"
      :title="handleResultTitle"
      :description="handleResultDescription"
      :img="require('@/assets/icons/img_email_big.svg')"
      @onConfirm="closeHandleResult"
    />
    <NameListDialog
      v-if="showNameListDialog"
      :data="currentHomeList"
      :title="$t('associatedHomes') + ' (' + currentHomeList.length + ')'"
      type="home"
      @closePopup="showNameListDialog = false"
    />
    <DatePicker
      v-if="showDatePicker"
      :clickX="clickX"
      :clickY="clickY"
      :selectedTimestamp="selectedTimestamp"
      @selectedDate="selectedDate"
      @closeDatePicker="closeDatePicker"
    />
    <PsConfirm
      v-if="showConfirm"
      :confirmInfo="confirmInfo"
      @close="showConfirm = false"
      @confirm="confirmFix"
    />
  </div>
</template>

<script>
import { formatTableTime, formatYMDTime } from '@/utils';
import HandleClient from './HandleClient.vue';
import AddTenant from './AddTenant.vue';
import NameListDialog from '@/components/NameListDialog';
import DatePicker from '@/components/pontocarePopup/datePicker.vue';
import { UserType } from '@/utils/constant';
export default {
  components: {
    HandleClient,
    NameListDialog,
    DatePicker,
    AddTenant
  },
  data() {
    return {
      UserType,
      name: '',
      nameFocus: false,
      email: '',
      emailFocus: false,
      role: '',
      roleList: [
        {
          label: this.$t('tenant'),
          value: UserType.tenantAdmin
        },
        {
          label: this.$t('distributor'),
          value: UserType.distributor
        }
      ],
      activeStatus: '',
      registerStateList: [
        {
          label: this.$t('registered'),
          value: 10
        },
        {
          label: this.$t('invited'),
          value: 0
        }
      ],
      evaluationStatus: '',
      evaluationStatusList: [
        {
          label: this.$t('high'),
          value: 2,
          class: 'high'
        },
        {
          label: this.$t('mid'),
          value: 1,
          class: 'mid'
        },
        {
          label: this.$t('low'),
          value: 0,
          class: 'low'
        },
        {
          label: this.$t('closed'),
          value: 3,
          class: 'closed'
        }
      ],
      userId: '',
      idFocus: false,
      memberList: [],
      sort: '',
      order: '',
      pageNo: 1,
      pageSize: 30,
      pageTotal: 0,
      homeDetail: {},
      tempEvaluationStatus: '',
      // popup
      showHandleClient: false,
      showHandleResult: false,
      handleResultTitle: '',
      handleResultDescription: '',
      currentHandleClient: null,
      timer: null,
      currentHomeList: [],
      showNameListDialog: false,
      showDatePicker: false,
      clickX: 0, // 点击的 X 坐标
      clickY: 0,
      selectedTimestamp: '',

      showAddTenantDialog: false,
      multipleSelection: [],
      showConfirm: false,
      confirmInfo: {}
    };
  },
  created() {
    this.loadParamsFromQuery();
    this.getClientList();
  },
  methods: {
    formatTableTime,
    formatYMDTime,
    changeSort(sort, name) {
      if (this.sort === name && this.order === sort) {
        this.order = '';
        this.sort = '';
      } else {
        this.sort = name;
        this.order = sort;
      }
      this.getClientList();
    },
    handlePageChange(pageNo) {
      this.pageNo = pageNo;
      this.getClientList();
    },
    handleHeaderDragEnd() {
      this.$refs.table.doLayout();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectable(row) {
      const roles = row.roles || [];
      return Array.isArray(roles) && roles.includes(UserType.tenantAdmin) && row.stripeCustomerId === null;
    },
    fixTenant() {
      this.showConfirm = true;
      this.confirmInfo = {
        title: 'Fix Tenant',
        content: 'This will fix tenant.',
        description: this.$t('doContinue')
      };
    },
    confirmFix() {
      this.$psPageLoading().show();
      this.$http.fixTenant(this.multipleSelection.map(item => item.id))
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.getClientList();
        }).finally(() => {
          this.showConfirm = false;
          this.$psPageLoading().hide();
        });
    },
    getClientList() {
      this.$psPageLoading().show();
      this.updateQueryParams();
      this.$http
        .getClientList(
          this.pageNo,
          this.pageSize,
          this.email,
          this.order,
          this.sort,
          this.userId,
          this.name,
          this.activeStatus,
          this.evaluationStatus,
          this.role
        )
        .then((res) => {
          this.memberList = res.records;
          this.pageTotal = res.total;
          setTimeout(() => {
            this.$refs.table.doLayout();
          }, 0);
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    loadParamsFromQuery() {
      const query = this.$route.query;
      if (query.name) {
        this.name = query.name;
      }
      if (query.email) {
        this.email = query.email;
      }
      if (query.activeStatus && query.activeStatus !== '') {
        this.activeStatus = +query.activeStatus;
      }
      if (query.role !== undefined && query.role !== null && query.role !== '') {
        this.role = Number(query.role);
      }
      if (query.evaluationStatus && query.evaluationStatus !== '') {
        this.evaluationStatus = +query.evaluationStatus;
      }
      if (query.userId) {
        this.userId = query.userId;
      }
    },
    updateQueryParams() {
      const query = {};
      if (this.name && this.name.trim()) {
        query.name = this.name.trim();
      }
      if (this.email && this.email.trim()) {
        query.email = this.email.trim();
      }
      if (this.activeStatus !== '') {
        query.activeStatus = this.activeStatus;
      }
      if (this.role !== '') {
        query.role = this.role;
      }
      if (this.evaluationStatus !== '') {
        query.evaluationStatus = this.evaluationStatus;
      }
      if (this.userId && this.userId.trim()) {
        query.userId = this.userId.trim();
      }
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    searchList() {
      this.pageNo = 1;
      this.getClientList();
    },
    clearList() {
      this.name = '';
      this.email = '';
      this.activeStatus = '';
      this.role = '';
      this.evaluationStatus = '';
      this.userId = '';
      this.pageNo = 1;
      this.getClientList();
    },
    handleEditClient(client) {
      this.currentHandleClient = client;
      this.showHandleClient = true;
    },
    addTenant(client) {
      this.currentHandleClient = client;
      this.showAddTenantDialog = true;
    },
    handleAddNewClient() {
      this.currentHandleClient = null;
      this.showHandleClient = true;
    },
    closeHandleClient() {
      this.showHandleClient = false;
    },
    confirmHandleClientSuccess() {
      this.showHandleClient = false;
      this.getClientList();
      if (this.currentHandleClient) {
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      } else {
        this.showHandleResult = true;
        this.handleResultTitle = this.$t('clientAddedSuccessfully');
        this.handleResultDescription = this.$t('clientAddedSuccessfullyTip');
      }
    },
    confirmAddTenantSuccess() {
      this.showAddTenantDialog = false;
      this.getClientList();
      this.$psNotifyMessage().success(this.$t('operationSuccessful'));
    },
    closeHandleResult() {
      this.showHandleResult = false;
    },
    changeEvaluationStatus(event, client) {
      if (this.tempEvaluationStatus === event) {
        return;
      }
      client.healthScore = this.tempEvaluationStatus; // 暂时显示旧值，后端修改成功后，再更新显示的值
      const payload = {
        healthScore: event
      };
      this.$psPageLoading().show();
      this.$http
        .editUserInfo(client.id, payload)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.getClientList();
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    updateEvaluationDate(event, client, type) {
      this.clickX = event.clientX - 380;
      this.clickY = event.clientY;
      if (type === 'start') {
        this.selectedTimestamp = new Date(
          client.evaluationStartTime ? client.evaluationStartTime : new Date()
        ).getTime();
      } else {
        this.selectedTimestamp = new Date(
          client.evaluationEndTime ? client.evaluationEndTime : new Date()
        ).getTime();
      }
      client.handleType = type;
      this.currentHandleClient = client;
      setTimeout(() => {
        this.showDatePicker = true; // 由于DatePicker组件内有监听click事件，点击非DatePicker组件时，需要隐藏组件，为了避免冲突，这里延迟显示
      }, 0);
    },
    openHomeList(homeList) {
      this.showNameListDialog = true;
      this.currentHomeList = homeList;
    },
    selectedDate(date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const timestamp = dateObj.getTime();
      let payload = {};
      if (this.currentHandleClient.handleType === 'start') {
        if (this.currentHandleClient.evaluationEndTime) {
          const endTimeObj = new Date(
            this.currentHandleClient.evaluationEndTime
          );
          endTimeObj.setHours(0, 0, 0, 0);
          const endTimestamp = endTimeObj.getTime();
          if (timestamp > endTimestamp) {
            this.$psNotifyMessage().fail(this.$t('startDateEndDateTip'));
            return;
          }
        }
        payload = {
          evaluationStartTime: timestamp
        };
      } else {
        if (this.currentHandleClient.evaluationStartTime) {
          const startTimeObj = new Date(
            this.currentHandleClient.evaluationStartTime
          );
          startTimeObj.setHours(0, 0, 0, 0);
          const startTimestamp = startTimeObj.getTime();
          if (timestamp < startTimestamp) {
            this.$psNotifyMessage().fail(this.$t('startDateEndDateTip'));
            return;
          }
        }
        payload = {
          evaluationEndTime: timestamp
        };
      }
      this.$psPageLoading().show();
      this.$http
        .editUserInfo(this.currentHandleClient.id, payload)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.showDatePicker = false;
          this.getClientList();
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    closeDatePicker() {
      this.showDatePicker = false;
    },
    parseRoles(roles) {
      const rolesList = [];
      if (roles.includes(UserType.distributor)) {
        rolesList.push(this.$t('distributor'));
      }
      if (roles.includes(UserType.tenantAdmin)) {
        rolesList.push(this.$t('tenant'));
      }
      return rolesList.join(',');
    }
  }
};
</script>

<style lang="scss" scoped>
.client__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8fc;
  padding: 20px;

  .search__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 36px;

    .left {
      display: flex;
      .input-name,
      .input-email,
      .input-id {
        width: 180px;
        height: 36px;
        margin-left: 6px;

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

      .input-name {
        margin-left: 0;
      }

      .register-status-selector {
        width: 170px;
        height: 36px;
        margin-left: 6px;

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
              border: 2px solid #325bf2;
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
              top: 50%;
              left: 10px;
              transform: translateY(-50%);
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

      .btn-search,
      .btn-refresh,
      .btn-clear {
        width: 36px;
        height: 36px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
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
      .btn-refresh {
        background: url("@/assets/icons/ic_refresh.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
    }

    .right {
      display: flex;
      .btn-add-member {
        width: 150px;
        height: 36px;
        background: linear-gradient(90deg, #1c21e4 0%, #4895ff 100%);
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }

  .table__container {
    width: 100%;
    flex: 1;
    margin-top: 10px;
    background: #ffffff;
    box-shadow: 0px 0px 5px 0px rgba(85, 88, 181, 0.1);
    border-radius: 10px;
    overflow: hidden;

    ::v-deep .el-table {
      width: 100%;
      height: calc(100% - 48px);
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
              th.el-table__cell::after {
                content: "";
                border: 1px solid #f0f0f4;
                right: 2px;
                position: absolute;
                height: 15px;
                top: 7px;
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
                      background: url("@/assets/icons/ic_action.svg") no-repeat
                      center;
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

    .table-header-sort {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 16px;
      padding-right: 3px;
      .icon-sort {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 10px;
        height: 30px;
        margin-right: 10px;
        cursor: pointer;
      }
      .sort-des {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_normal_down.svg") no-repeat top;
        background-size: contain;
      }
      .sort-des-selected {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_selected_down.svg") no-repeat
        top;
        background-size: contain;
      }

      .sort-asc {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_normal_up.svg") no-repeat bottom;
        background-size: contain;
      }
      .sort-asc-selected {
        width: 8px;
        flex: 1;
        background: url("@/assets/icons/ic_sort_selected_up.svg") no-repeat
        bottom;
        background-size: contain;
      }

      .table-header-text {
        font-weight: 500;
        font-size: 13px;
        color: #222e61;
        text-align: left;
      }

      .current-sort-header {
        font-weight: 500;
        font-size: 13px;
        color: #325bf2;
        line-height: 16px;
      }
    }
    .page__container {
      display: flex;
      width: 100%;
      height: 48px;
      align-items: center;
      justify-content: flex-end;
      padding-right: 16px;

      .page-total {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
      }

      ::v-deep .el-pagination {
        display: flex;
        align-items: center;
        .el-pager {
          display: flex;
          align-items: center;
          .number {
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            padding: 3px;
            border-radius: 100%;
            margin-left: 5px;
          }

          .number.active {
            background: #325bf2;
            color: #ffffff;
          }
        }
      }
    }
    .underline {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
