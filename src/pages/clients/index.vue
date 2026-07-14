<template>
  <div class="client__wrapper">
    <div class="tab__container">
      <div class="tab">
        <div
          class="tab-item"
          :class="{ 'current-item': currentTab === 0 }"
          @click="handleTabChange(0)"
        >
          {{ $t('organization') }}
        </div>
        <div
          class="tab-item"
          :class="{ 'current-item': currentTab === 1 }"
          @click="handleTabChange(1)"
        >
          {{ $t('reseller0026') }}
        </div>
        <div
          class="tab-item"
          :class="{ 'current-item': currentTab === 2 }"
          @click="handleTabChange(2)"
        >
          Silvie
        </div>
      </div>
    </div>
    <div class="search__container">
      <div class="left">
        <div class="filter-content" key="organization" v-if="currentTab === 0">
          <el-input
            class="input-name"
            :class="{'input-not-empty': name !== ''}"
            @focus="nameFocus = true"
            @blur="nameFocus = false"
            :placeholder="nameFocus ? '' : $t('organization')"
            v-model="name"
          >
            <span v-if="nameFocus || name" slot="prefix" class="prefix-name">{{
              $t("organization")}}
            </span>
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
            :placeholder="emailFocus ? '' : $t('owner')"
            v-model="email"
          >
            <span v-if="emailFocus || email" slot="prefix" class="prefix-email">{{
              $t("owner")
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
        </div>
        <div class="filter-content" key="individual" v-if="currentTab === 1">
          <el-input
            class="input-name"
            :class="{'input-not-empty': individualName !== ''}"
            @focus="individualNameFocus = true"
            @blur="individualNameFocus = false"
            :placeholder="individualNameFocus ? '' : $t('organization')"
            v-model="individualName"
          >
            <span v-if="individualNameFocus || individualName" slot="prefix" class="prefix-name">{{
              $t("organization")}}
            </span>
            <span
              v-if="individualName"
              slot="suffix"
              class="icon-clean"
              @click="individualName = ''"
            ></span>
          </el-input>
          <el-input
            class="input-id"
            :class="{'input-not-empty': individualId !== ''}"
            @focus="individualIdFocus = true"
            @blur="individualIdFocus = false"
            :placeholder="individualIdFocus ? '' : $t('tenantID')"
            v-model="individualId"
          >
            <span v-if="individualIdFocus || individualId" slot="prefix" class="prefix-id">{{
              $t("tenantID")
            }}</span>
            <span
              v-if="individualId"
              slot="suffix"
              class="icon-clean"
              @click="individualId = ''"
            ></span>
          </el-input>
        </div>
        <div class="filter-content" key="silvie" v-if="currentTab === 2">
          <el-input
            class="input-name"
            :class="{'input-not-empty': silvieName !== ''}"
            @focus="silvieNameFocus = true"
            @blur="silvieNameFocus = false"
            :placeholder="silvieNameFocus ? '' : $t('organization')"
            v-model="silvieName"
          >
            <span v-if="silvieNameFocus || silvieName" slot="prefix" class="prefix-name">{{
              $t("organization")}}
            </span>
            <span
              v-if="silvieName"
              slot="suffix"
              class="icon-clean"
              @click="silvieName = ''"
            ></span>
          </el-input>
          <el-input
            class="input-id"
            :class="{'input-not-empty': silvieId !== ''}"
            @focus="silvieIdFocus = true"
            @blur="silvieIdFocus = false"
            :placeholder="silvieIdFocus ? '' : $t('tenantID')"
            v-model="silvieId"
          >
            <span v-if="silvieIdFocus || silvieId" slot="prefix" class="prefix-id">{{
              $t("tenantID")
            }}</span>
            <span
              v-if="silvieId"
              slot="suffix"
              class="icon-clean"
              @click="silvieId = ''"
            ></span>
          </el-input>
        </div>
        <el-tooltip
          effect="light"
          :visible-arrow="false"
          :content="$t('search')"
          placement="bottom-end"
        >
          <div class="btn-search" @click="searchList"></div>
        </el-tooltip>
        <el-tooltip
          effect="light"
          :visible-arrow="false"
          :content="$t('clear')"
          placement="bottom-end"
        >
          <div class="btn-clear" @click="clearList"></div>
        </el-tooltip>
        <el-tooltip
          effect="light"
          :visible-arrow="false"
          :content="$t('refresh')"
          placement="bottom-end"
        >
          <div class="btn-refresh" @click="refreshList"></div>
        </el-tooltip>
      </div>
      <div class="right">
        <div class="btn-add-member" v-if="currentTab === 0" @click="handleAddNewClient">
          {{ $t("addNewClient") }}
        </div>
      </div>
    </div>
    <div class="table__container">
      <el-table
        v-if="currentTab === 0"
        :data="memberList"
        ref="orgTable"
        row-key="id"
        key="orgTable"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
        :row-style="{ height: '75px' }"
        @header-dragend="handleHeaderDragEnd"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
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
          :label="$t('owner')"
          width="230"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("owner") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <ps-tool-tip :content="scope.row.email" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column prop="admins" min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("admins") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div
              class="underline"
              @click="openAdminList(scope.row.admins)"
              v-if="scope.row.admins && scope.row.admins.length > 0"
            >
              {{ scope.row.admins.length }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="role"
          width="160"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("role") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="role-wrapper">
              <div>{{ scope.row.roles ? parseRoles(scope.row.roles) : "-" }}</div>
              <div v-if="scope.row.isIntegrator" class="role-label">
                {{ $t("integrate0003") }}
              </div>
            </div>
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
            <ps-tool-tip :content="scope.row.distributorName ? (scope.row.roles.includes(UserType.distributor)?'-':scope.row.distributorName):'-'" :lines="5"></ps-tool-tip>
          </template>
        </el-table-column>
        <el-table-column
          prop="stripeCustomerId"
          width="200"
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
        <el-table-column prop="prices" min-width="120">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("reseller0003") }}</div>
            </div>
          </template>
          <template slot-scope="scope">{{ getCurrency(scope.row.prices,20) }} {{ getPrice(scope.row.prices,20) }}</template>
        </el-table-column>
        <el-table-column prop="prices" min-width="130">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("reseller0004") }}</div>
            </div>
          </template>
          <template slot-scope="scope">{{ getCurrency(scope.row.prices,10) }} {{ getPrice(scope.row.prices,10) }}</template>
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
            }}</span>
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
                @click="showDropDown(scope.row.id)"
              ></div>
              <el-dropdown-menu slot="dropdown" class="members-action-dropdown">
                <el-dropdown-item @click.native="handleEditClient(scope.row)">{{
                  $t("edit")
                }}</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleResend(scope.row)"
                  v-if="scope.row.registrationState === 0"
                  :disabled="timeLeft > 0"
                  :style="{ color: timeLeft > 0 ? '#ACB2C8' : '' }"
                >
                  {{ $t("resendInvitation")
                  }}<span v-if="timeLeft > 0">({{ timeLeft }}s)</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.registrationState === 10 && scope.row.roles.includes(UserType.tenantAdmin)"
                  @click.native="reassignOwner(scope.row)">
                  {{ $t("reassignOwner") }}
                </el-dropdown-item>
                <el-tooltip effect="light"
                            :visible-arrow="false"
                            :disabled="scope.row.supportAccess?.creatable || scope.row.supportAccess?.openPortalEnabled"
                            :content="parseAccessDisableContent(scope.row.supportAccess)"
                            placement="left">
                  <el-dropdown-item
                    v-if="scope.row.supportAccess?.creatable || !scope.row.supportAccess?.openPortalEnabled"
                    :class="{'text-btn-disable': !scope.row.supportAccess?.creatable && !scope.row.supportAccess?.openPortalEnabled}"
                    @click.native="requestAccess(scope.row)">
                    {{ $t("altLogin0001") }}
                  </el-dropdown-item>
                </el-tooltip>
                <el-dropdown-item
                  v-if="!scope.row.supportAccess?.creatable && scope.row.supportAccess?.requestedBy === currentUserId"
                  @click.native="revokeAccess(scope.row)">
                  {{ $t("altLogin0002") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!scope.row.supportAccess?.creatable && scope.row.supportAccess?.openPortalEnabled && scope.row.supportAccess?.requestedBy === currentUserId"
                  @click.native="openPortal(scope.row)">
                  {{ $t("altLogin0003") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.supportAccess?.isSessionActive && scope.row.supportAccess?.requestedBy === currentUserId"
                  @click.native="endSession(scope.row)">
                  {{ $t("altLogin0004") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!scope.row.isIntegrator && !(scope.row.distributorId && scope.row.distributorId !== scope.row.id) && scope.row.registrationState === 10"
                  @click.native="handleSetIntegrator(scope.row)">
                  {{ $t("integrate0001") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!(scope.row.distributorId && scope.row.distributorId !== scope.row.id)"
                  @click.native="handleWhitelabel(scope.row)">
                  {{ $t('whitelabel0018') }}
                </el-dropdown-item>
                <el-dropdown-item
                  class="action-del"
                  @click.native="handleDelete(scope.row)"
                >{{ $t("delete") }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-if="currentTab === 1 || currentTab === 2"
        :data="memberList"
        ref="personalTable"
        row-key="id"
        key="personalTable"
        border
        style="width: 100%"
        height="calc(100% - 48px)"
        :row-style="{ height: '65px' }"
        @header-dragend="handleHeaderDragEnd"
      >
        <template slot="empty">
          <img src="@/assets/icons/ic_empty.svg" alt="" />
          <div style="margin-top: 20px">{{ $t("noData") }}</div>
        </template>
        <el-table-column prop="name" min-width="150">
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
          min-width="150"
        >
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("email") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <span>{{
              scope.row.email ? scope.row.email : "-"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="stripeCustomerId"
          min-width="150"
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
        <el-table-column prop="homes" min-width="90">
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
        <el-table-column prop="createTime" min-width="200">
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
        <el-table-column width="82" fixed="right" v-if="currentTab === 1">
          <template slot="header">
            <div class="table-header-sort">
              <div class="table-header-text">{{ $t("actions") }}</div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <div
                class="icon-action"
                @click="showDropDown(scope.row.id)"
              ></div>
              <el-dropdown-menu slot="dropdown" class="members-action-dropdown">
                <el-dropdown-item @click.native="handleEditClient(scope.row)">{{
                  $t("edit")
                }}</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleResend(scope.row)"
                  v-if="scope.row.registrationState === 0"
                  :disabled="timeLeft > 0"
                  :style="{ color: timeLeft > 0 ? '#ACB2C8' : '' }"
                >
                  {{ $t("resendInvitation")
                  }}<span v-if="timeLeft > 0">({{ timeLeft }}s)</span>
                </el-dropdown-item>
                <el-dropdown-item
                  class="action-del"
                  @click.native="handleDelete(scope.row)"
                >{{ $t("delete") }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-bottom">
        <div class="table-bottom-left">
          <div class="export-btn" :class="{'text-btn-disable': pageTotal === 0}" @click="exportCSV">
            <i class="export-ico iconfont ps-inbox-download"></i>
            <div class="export-text">{{ $t('export0001') }}</div>
          </div>
        </div>
        <div class="page__container" v-if="pageTotal > 0">
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
    </div>

    <HandleClient
      v-if="showHandleClient"
      :currentClient="currentHandleClient"
      :type="currentTab"
      @closeHandleClient="closeHandleClient"
      @confirmHandleClientSuccess="confirmHandleClientSuccess"
    />
    <PsHandleResult
      v-if="showHandleResult"
      :title="handleResultTitle"
      :description="handleResultDescription"
      :img="require('@/assets/icons/img_email_big.svg')"
      @onConfirm="closeHandleResult"
    />
    <PsConfirm
      v-if="showConfirm"
      :confirmInfo="confirmInfo"
      @close="showConfirm = false"
      @confirm="confirmOperation"
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
    <HandleWhitelabel
      v-if="showHandleWhitelabel"
      :currentClient="currentHandleClient"
      @closeIt="showHandleWhitelabel = false"
    />
    <RequestAccess v-if="showHandleRequestAccess" :currentTenant="currentHandleClient" @closeIt="closeHandleRequestAccess" />
    <AdminListDrawer :showDrawer.sync="showAdminListDrawer" :adminList="currentAdminList" />
    <ReassignOwnerDrawer :showDrawer.sync="showReassignOwnerDrawer"
                         :currentTenant="currentHandleClient"
                         @refresh="getClientList" />
  </div>
</template>

<script>
import { formatTableTime, formatYMDTime } from '@/utils';
import moment from 'moment';
import HandleClient from './HandleClient.vue';
import HandleWhitelabel from './HandleWhitelabel.vue';
import NameListDialog from '@/components/NameListDialog';
import DatePicker from '@/components/pontocarePopup/datePicker.vue';
import { updateEmailSendTime, getEmailSendLeftTime, blobUtil } from '@/utils/util';
import { CurrencyList, ExportRecordsLimit, UserType, RequestAccessProcess } from '@/utils/constant';
import AdminListDrawer from './adminList.vue';
import ReassignOwnerDrawer from './reassignOwnerDrawer.vue';
import RequestAccess from './requestAccess.vue';
export default {
  components: {
    HandleClient,
    HandleWhitelabel,
    NameListDialog,
    DatePicker,
    AdminListDrawer,
    ReassignOwnerDrawer,
    RequestAccess
  },
  data() {
    return {
      UserType,
      CurrencyList,
      ExportRecordsLimit,
      RequestAccessProcess,
      name: '',
      nameFocus: false,
      individualName: '',
      individualNameFocus: false,
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
      individualId: '',
      individualIdFocus: false,
      silvieName: '',
      silvieNameFocus: false,
      silvieId: '',
      silvieIdFocus: false,
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
      showConfirm: false,
      confirmInfo: {},
      currentHandleClient: null,
      currentOperation: '',
      timeLeft: 0,
      timer: null,
      currentHomeList: [],
      showNameListDialog: false,
      showDatePicker: false,
      clickX: 0, // 点击的 X 坐标
      clickY: 0,
      selectedTimestamp: '',
      showAdminListDrawer: false,
      currentAdminList: [],
      showReassignOwnerDrawer: false,
      showHandleWhitelabel: false,
      showHandleRequestAccess: false,

      currentTab: 0,
      lastFilterSnapshot: null
    };
  },
  computed: {
    currentUserId() {
      return Number(this.$store.state.user.userId);
    }
  },
  created() {
    // 从 URL query 中读取参数
    this.loadParamsFromQuery();
    this.getClientList();
  },
  methods: {
    formatTableTime,
    formatYMDTime,
    blobUtil,
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
      this.currentTab === 0 ? this.$refs.orgTable.doLayout() : this.$refs.personalTable.doLayout();
    },
    getClientList() {
      this.memberList = [];
      this.$psPageLoading().show();
      // 更新 URL query 参数
      this.updateQueryParams();
      const filter = {
        email: this.currentTab === 0 ? this.email.trim() : '',
        tenantId: this.currentTab === 0 ? this.userId.trim() : (this.currentTab === 1 ? this.individualId.trim() : this.silvieId.trim()),
        tenantName: this.currentTab === 0 ? this.name.trim() : (this.currentTab === 1 ? this.individualName.trim() : this.silvieName.trim()),
        registerState: this.currentTab === 0 ? this.activeStatus : '',
        healthScore: this.currentTab === 0 ? this.evaluationStatus : '',
        role: this.currentTab === 0 ? this.role : '',
        type: this.currentTab
      };
      this.lastFilterSnapshot = JSON.parse(JSON.stringify(filter));
      const filterParams = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        order: this.order,
        sort: this.sort,
        ...filter
      };
      this.$http
        .getClientList(filterParams)
        .then((res) => {
          this.memberList = res.records;
          this.pageTotal = res.total;
          setTimeout(() => {
            this.currentTab === 0 ? this.$refs.orgTable.doLayout() : this.$refs.personalTable.doLayout();
          }, 0);
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    searchList() {
      this.pageNo = 1;
      this.getClientList();
    },
    clearList() {
      if (this.currentTab === 0) {
        this.name = '';
        this.email = '';
        this.activeStatus = '';
        this.role = '';
        this.evaluationStatus = '';
        this.userId = '';
      } else if (this.currentTab === 1) {
        this.individualName = '';
        this.individualId = '';
      } else {
        this.silvieName = '';
        this.silvieId = '';
      }
      this.pageNo = 1;
      this.sort = '';
      this.order = '';
      this.getClientList();
    },
    refreshList() {
      this.getClientList();
    },
    getPrice(prices, resourceId) {
      if (!prices) return '-';
      const tartgetPrice = prices.find(item => item.resourceId === resourceId);
      if (tartgetPrice) {
        return (tartgetPrice.amount / 100).toFixed(2);
      } else {
        return '-';
      }
    },
    getCurrency(prices, resourceId) {
      if (!prices) return '';
      const tartgetPrice = prices.find(item => item.resourceId === resourceId);
      if (tartgetPrice) {
        return this.CurrencyList.find(item => item.value === tartgetPrice.currency)?.label;
      } else {
        return '';
      }
    },
    handleEditClient(client) {
      this.currentHandleClient = client;
      this.showHandleClient = true;
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
    closeHandleResult() {
      this.showHandleResult = false;
    },
    reassignOwner(member) {
      this.currentHandleClient = member;
      this.showReassignOwnerDrawer = true;
    },
    handleWhitelabel(member) {
      this.currentHandleClient = member;
      this.showHandleWhitelabel = true;
    },
    handleSetIntegrator(member) {
      this.currentOperation = 'setIntegrator';
      this.currentHandleClient = member;
      this.showConfirm = true;
      this.confirmInfo = {
        title: this.$t('integrate0001'),
        content: this.$t('integrate0002'),
        description: this.$t('doContinue')
      };
    },
    handleDelete(member) {
      this.currentOperation = 'delete';
      this.currentHandleClient = member;
      this.showConfirm = true;
      this.confirmInfo = {
        title: this.$t('delete'),
        content: this.$t('deleteTip'),
        description: this.$t('doContinue')
      };
    },
    confirmOperation() {
      if (this.currentOperation === 'delete') {
        this.confirmDelete();
      } else if (this.currentOperation === 'setIntegrator') {
        this.confirmSetIntegrator();
      } else if (this.currentOperation === 'export') {
        this.confirmExport();
      } else if (this.currentOperation === 'revokeAccess') {
        this.confirmRevokeAccess();
      } else if (this.currentOperation === 'endSession') {
        this.confirmEndSession();
      }
    },
    confirmDelete() {
      this.$psPageLoading().show();
      this.$http
        .deleteClient(this.currentHandleClient.id)
        .then(() => {
          this.getClientList();
          this.showConfirm = false;
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    confirmSetIntegrator() {
      const payload = {
        enabled: true
      };
      this.$psPageLoading().show();
      this.$http
        .setIntegrator(this.currentHandleClient.id, payload)
        .then(() => {
          this.getClientList();
          this.showConfirm = false;
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    handleResend(client) {
      this.$psPageLoading().show();
      this.$http
        .resendInvitation(client.id)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          updateEmailSendTime(client.id);
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    showDropDown(userId) {
      clearInterval(this.timer);
      this.timeLeft = getEmailSendLeftTime(userId);
      if (this.timeLeft > 0) {
        this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
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
    },
    openAdminList(admins) {
      this.currentAdminList = admins;
      this.showAdminListDrawer = true;
    },
    handleTabChange(tab) {
      this.currentTab = tab;
      this.searchList();
    },
    // 从 query 中获取参数
    loadParamsFromQuery() {
      const query = this.$route.query;
      if (query.tab && query.tab !== '') {
        this.currentTab = Number(query.tab || 0);
      }

      if (this.currentTab === 0) {
        if (query.name) {
          this.name = query.name;
        }
        if (query.email) {
          this.email = query.email;
        }
        if (query.userId) {
          this.userId = query.userId;
        }
        if (query.activeStatus && query.activeStatus !== '') {
          this.activeStatus = +query.activeStatus;
        }
        if (query.evaluationStatus && query.evaluationStatus !== '') {
          this.evaluationStatus = +query.evaluationStatus;
        }
        if (query.role && query.role !== '') {
          this.role = +query.role;
        }
      } else if (this.currentTab === 1) {
        if (query.individualName) {
          this.individualName = query.individualName;
        }
        if (query.individualId) {
          this.individualId = query.individualId;
        }
      } else {
        if (query.silvieName) {
          this.silvieName = query.silvieName;
        }
        if (query.silvieId) {
          this.silvieId = query.silvieId;
        }
      }
    },
    // 更新 URL query 参数
    updateQueryParams() {
      const query = {};

      if (this.currentTab !== 0) {
        query.tab = this.currentTab;
      }
      if (this.currentTab === 0) {
        if (this.name && this.name.trim()) {
          query.name = this.name.trim();
        }
        if (this.email && this.email.trim()) {
          query.email = this.email.trim();
        }
        if (this.userId && this.userId.trim()) {
          query.userId = this.userId.trim();
        }
        if (this.activeStatus !== '' && this.activeStatus !== null) {
          query.activeStatus = this.activeStatus;
        }
        if (this.evaluationStatus !== '' && this.evaluationStatus !== null) {
          query.evaluationStatus = this.evaluationStatus;
        }
        if (this.role) {
          query.role = this.role;
        }
      } else if (this.currentTab === 1) {
        if (this.individualName && this.individualName.trim()) {
          query.individualName = this.individualName.trim();
        }
        if (this.individualId && this.individualId.trim()) {
          query.individualId = this.individualId.trim();
        }
      } else {
        if (this.silvieName && this.silvieName.trim()) {
          query.silvieName = this.silvieName.trim();
        }
        if (this.silvieId && this.silvieId.trim()) {
          query.silvieId = this.silvieId.trim();
        }
      }

      // 更新 URL，但不触发路由跳转
      this.$router.replace({
        query: Object.keys(query).length > 0 ? query : {}
      }).catch(() => {});
    },
    exportCSV() {
      if (this.pageTotal === 0) {
        return;
      }
      if (this.pageTotal > this.ExportRecordsLimit) {
        this.showConfirm = true;
        this.confirmInfo = {
          title: this.$t('export0002'),
          content: this.$t('export0003')
        };
        this.currentOperation = 'export';
        return;
      }
      this.confirmExport();
    },
    confirmExport() {
      this.$psPageLoading().show();
      this.$http.exportClientList({
        ...(this.lastFilterSnapshot || {}),
        order: this.order,
        sort: this.sort
      }).then((res) => {
        const tableName = this.currentTab === 0 ? 'Organization' : (this.currentTab === 1 ? 'Individual' : 'Silvie');
        this.blobUtil(res, `${tableName}-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
        this.showConfirm = false;
        this.$psNotifyMessage().success(this.$t('operationSuccessful'));
      }).finally(() => {
        this.$psPageLoading().hide();
      });
    },
    requestAccess(member) {
      if (!member.supportAccess?.creatable && !member.supportAccess?.openPortalEnabled) {
        return;
      }
      this.currentHandleClient = member;
      this.showHandleRequestAccess = true;
    },
    parseAccessDisableContent(supportAccess) {
      if (supportAccess.processResult === this.RequestAccessProcess.requested && supportAccess.requestedBy === this.currentUserId) {
        return this.$t('altLogin0005');
      }
      if (supportAccess.processResult === this.RequestAccessProcess.requested && supportAccess.requestedBy !== this.currentUserId) {
        return this.$t('altLogin0006', { userName: supportAccess.requestedByName });
      }
      if (supportAccess.processResult === this.RequestAccessProcess.approved && supportAccess.requestedBy !== this.currentUserId) {
        return this.$t('altLogin0007', { userName: supportAccess.requestedByName });
      }
    },
    revokeAccess(member) {
      this.currentOperation = 'revokeAccess';
      this.currentHandleClient = member;
      this.showConfirm = true;
      this.confirmInfo = {
        title: this.$t('altLogin0002'),
        content: this.$t('altLogin0008'),
        description: ''
      };
    },
    openPortal(member) {
      this.$psPageLoading().show();
      this.$http
        .getRequestAccessToken(member.id, member.supportAccess.requestId)
        .then((res) => {
          if (res.token && res.tenantPortalUrl) {
            let href = '';
            if (member.roles && member.roles.length === 1 && member.roles[0] === this.UserType.distributor) {
              href = res.tenantPortalUrl + '/#/sysops/tenants?token=' + res.token;
            } else {
              href = res.tenantPortalUrl + '/#/monitor?token=' + res.token;
            }
            window.open(href, '_blank');
            this.getClientList();
          }
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    endSession(member) {
      this.currentOperation = 'endSession';
      this.currentHandleClient = member;
      this.showConfirm = true;
      this.confirmInfo = {
        title: this.$t('altLogin0004'),
        content: this.$t('altLogin0009'),
        description: ''
      };
    },
    confirmEndSession() {
      this.$psPageLoading().show();
      this.$http
        .endRequestSession(this.currentHandleClient.id, this.currentHandleClient.supportAccess.requestId)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.showConfirm = false;
          this.getClientList();
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    confirmRevokeAccess() {
      const payload = {};
      this.$psPageLoading().show();
      this.$http
        .revokeRequestAccess(this.currentHandleClient.id, this.currentHandleClient.supportAccess.requestId, payload)
        .then(() => {
          this.$psNotifyMessage().success(this.$t('operationSuccessful'));
          this.showConfirm = false;
          this.getClientList();
        })
        .finally(() => {
          this.$psPageLoading().hide();
        });
    },
    closeHandleRequestAccess(isRefresh = false) {
      this.showHandleRequestAccess = false;
      if (isRefresh) {
        this.getClientList();
      }
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

  .tab__container{
    display: flex;
    align-items: center;
    height: 36px;
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

  .search__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 36px;
    margin-top: 10px;

    .left {
      display: flex;
      .filter-content {
        display: flex;
      }
      .input-name,
      .input-email,
      .input-id {
        max-width: 180px;
        height: 36px;
        margin-left: 6px;

        ::v-deep .el-input__inner {
          height: 36px;
          background: #ffffff;
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
          height: 100%;
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
        max-width: 170px;
        min-width: 165px;
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
              border-radius: 20px;
              border: 1px solid transparent;
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
              height: 100%;
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
      .btn-search:hover,
      .btn-refresh:hover,
      .btn-clear:hover {
        background-color: rgba(187, 197, 232, 0.6);
      }
      .btn-search,
      .btn-refresh,
      .btn-clear {
        min-width: 36px;
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
      .btn-refresh {
        background: url("@/assets/icons/ic_refresh.svg") no-repeat center;
        background-size: 17px 17px;
        background-color: #ffffff;
      }
    }

    .right {
      display: flex;
      margin-left: 6px;
      .btn-add-member:hover {
        background: #5779F4;
      }
      .btn-add-member {
        height: 36px;
        padding: 0 15px;
        background: #325bf2;
        box-shadow: 0px 2px 6px 0px rgba(72, 149, 255, 0.2);
        border-radius: 20px;
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
                height:60%;
                top: 50%;
                transform: translateY(-50%);
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
                  .role-wrapper {
                    display: flex;
                    flex-direction: column;
                    .role-label {
                      border: 1px solid rgba(0, 0, 0, 0.1);
                      border-radius: 7px;
                      padding: 2px 5px;
                      width: fit-content;
                    }
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
        .el-table__empty-block {
          width: 100% !important;
          display: flex;
          justify-content: center;
          align-items: center;
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
    .table-bottom {
      height: 48px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .table-bottom-left {
        display: flex;
        align-items: center;
        gap: 10px;
        .export-btn:hover {
          .export-ico {
            color: #0162CB;
          }
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;

          .export-ico {
            font-size: 20px;
            color: #017BFE;
          }

          .export-text {
            color: #000;
            font-size: 12px;
            font-weight: 400;
          }
        }
      }
    }
    .page__container {
      display: flex;
      align-items: center;
      justify-content: flex-end;

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
    .underline:hover {
      color: #325BF2;
    }
    .underline {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
