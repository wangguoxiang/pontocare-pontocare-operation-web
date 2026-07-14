import axios from './api';
import { trimObjItemValue } from '@/utils/util'; // 去除空格
import store from '@/store';
import { PsNotifyMessage } from '@ps/pontosense-ui';
import i18n from '@/locales/i18n';
import Vue from 'vue';

// 编码
function buildUrlWithEncodedParams(paramsObject) {
  if (paramsObject) {
    return paramsObject;
  }
  return {};
}

// 请求方法
const Methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch'
};

const appendTimezone = (params = {}) => ({
  ...params,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

const request = (options) => {
  const psTranslateErrorCode = Vue.prototype.$psTranslateErrorCode;
  options.method = options.method || Methods.get; // 默认为get请求
  const isGet = options.method === Methods.get;
  const isDelete = options.method === Methods.delete;
  // 允许显式指定走 JSON Body（DELETE 也可发 body）
  const useJsonBody = options.useJsonBody === true || options.data !== undefined;

  let key = 'data';
  if ((isGet || isDelete) && !useJsonBody) {
    key = 'params';
    options.params = buildUrlWithEncodedParams(options.params); // 格式化url
    // avoid cache in ie.    ie浏览器中发送相同的请求，可能会缓存之前的结果 不会重新请求
    options.params = options.params || {};
    options.params.t = Date.now();
  }

  let params;
  if (key === 'params') {
    if (options.params instanceof FormData) {
      params = options.params;
    } else if (options.params) {
      params = trimObjItemValue(options.params);
    }
  }

  const config = {
    url: options.url,
    method: options.method,
    headers: options.headers
  };

  if (key === 'params') {
    config.params = params;
  } else {
    // data 优先级：显式传入的 data > params
    let dataToSend = options.data !== undefined ? options.data : options.params;
    if (dataToSend instanceof FormData) {
      config.data = dataToSend;
    } else if (dataToSend !== undefined) {
      config.data = trimObjItemValue(dataToSend);
      config.headers = { ...(config.headers || {}), 'Content-Type': 'application/json' };
    }
  }
  if (options.url.indexOf('/download') > -1 || options.url.indexOf('sensors/actions/batchcreate') > -1 ||
      (options.url.indexOf('/whitelabel') > -1 && options.method === Methods.post)) {
    config.responseType = 'blob';
  }
  return axios(config)
    .then((response) => {
      const { data } = response;
      return data;
    })
    .catch(async (error) => {
      const response = error.response;
      if (response) {
        if (response.data) {
          let { data } = response;
          if (data instanceof Blob) {
            data = JSON.parse(await data.text());
          }
          if (data.code) {
            if (data.code === 100101) { // session过期
              if (window.location.href.indexOf('/login') === -1) {
                // 如果没有在登录页，则显示session过期弹窗
                store.commit('system/SET_SHOW_SESSION_EXPIRED', true);
              }
              return Promise.reject(new Error(data.code));
            } else if (data.code === 100106) { // 人机校验失败
              store.commit('system/SET_SHOW_CAPTCHA_VERIFY_FAIL', true);
              return Promise.reject(new Error(data.code));
            } else {
              if (data.code === 130220 ||
                    data.code === 100113) {
                return Promise.reject(new Error(data.code));
              }
              PsNotifyMessage().fail(psTranslateErrorCode(i18n.locale, data.code));
              return Promise.reject(new Error(data.code));
            }
          }
        }
      }
      if (error.code === 'ECONNABORTED' && error.message === 'Request aborted') { // 按ESC中断的请求不用报错
        return Promise.reject(new Error(error));
      }
      PsNotifyMessage().fail(i18n.t('failed'), i18n.t('internalServerError'));
      return Promise.reject(new Error(error));
    });
};

const Http = {
  // login page
  checkMachine(params) { // 人机校验
    return request({
      url: `/actions/siteVerify`,
      method: Methods.post,
      params
    });
  },
  login(params) {
    return request({
      url: `/login`,
      method: Methods.post,
      params
    });
  },
  getServerList() {
    return request({
      url: `/deployments`,
      method: Methods.get
    });
  },
  // clients page
  getClientList(params) {
    return request({
      url: `/tenants`,
      method: Methods.get,
      params
    });
  },
  exportClientList(params) {
    return request({
      url: `/tenants/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  getAllRegisteredClientList() {
    const params = {
      pageNo: 1,
      pageSize: -1,
      registerState: 10
    };
    return request({
      url: `/tenants`,
      method: Methods.get,
      params
    });
  },
  editUserInfo(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}`,
      method: Methods.put,
      params
    });
  },
  deleteClient(tenantId) {
    return request({
      url: `/tenants/${tenantId}`,
      method: Methods.delete
    });
  },
  setIntegrator(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}/integration`,
      method: Methods.put,
      params
    });
  },
  addNewClient(params) {
    return request({
      url: '/tenants',
      method: Methods.post,
      params
    });
  },
  getFirmwareList(params) {
    return request({
      url: `/firmware`,
      method: Methods.get,
      params
    });
  },
  exportFirmwareList(params) {
    return request({
      url: `/firmware/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  uploadFirmware(params) {
    return request({
      url: `/firmware`,
      method: Methods.post,
      params
    });
  },
  deployFirmware(model) {
    return request({
      url: `/firmware/actions/publish?model=${model}`,
      method: Methods.put
    });
  },
  resendInvitation(tenantId) {
    return request({
      url: `/tenants/${tenantId}/actions/resendVerificationEmail`,
      method: Methods.post
    });
  },

  // account page
  getUserInfo(userId) {
    return request({
      url: `/users/${userId}`,
      method: Methods.get
    });
  },
  logout() {
    return request({
      url: '/logout',
      method: Methods.post
    });
  },
  checkPassword(params) {
    return request({
      url: `/users/password/actions/verify`,
      method: Methods.post,
      params
    });
  },
  changePassword(userId, params) {
    return request({
      url: `/users/${userId}/password`,
      method: Methods.put,
      params
    });
  },
  sendEmail(params) {
    return request({
      url: '/users/captcha',
      method: Methods.post,
      params
    });
  },
  checkEmail(email) {
    const params = {
      email: email
    };
    return request({
      url: `/users/email/actions/checkAvailability`,
      method: Methods.get,
      params
    });
  },
  resetPassword(params) {
    return request({
      url: '/users/password/actions/reset',
      method: Methods.put,
      params
    });
  },

  getPriceList(pageNo, pageSize, order, sort, tenantName) {
    const params = {
      pageNo: pageNo,
      pageSize: pageSize,
      order: order,
      sort: sort,
      tenantName: tenantName
    };
    return request({
      url: `/prices`,
      method: Methods.get,
      params
    });
  },
  editPrice(params) {
    return request({
      url: '/prices',
      method: Methods.put,
      params
    });
  },
  getAuditLogList(pageNo, pageSize, order, sort, logType, invoiceId, tenantName, operator) {
    const params = {
      pageNo: pageNo,
      pageSize: pageSize,
      order: order,
      sort: sort,
      logType: logType,
      invoiceId: invoiceId,
      tenantName: tenantName,
      operator: operator
    };
    return request({
      url: `/auditLogs`,
      method: Methods.get,
      params
    });
  },
  getInvoiceList(pageNo, pageSize, order, sort, invoiceId, tenantName, date, status, overdue, isAnnual) {
    const params = {
      pageNo: pageNo,
      pageSize: pageSize,
      order: order,
      sort: sort,
      invoiceId: invoiceId,
      tenantName: tenantName,
      date: date,
      status: status,
      overdue: overdue,
      isAnnual: isAnnual
    };
    return request({
      url: `/invoices`,
      method: Methods.get,
      params
    });
  },
  downloadInvoice(params) {
    return request({
      url: '/invoices/actions/download',
      method: Methods.post,
      params
    });
  },
  editInvoiceStatus(invoiceId, params) {
    return request({
      url: `/invoices/${invoiceId}/status`,
      method: Methods.put,
      params
    });
  },
  getInvoicesStatistics() {
    return request({
      url: '/statistics/invoices',
      method: Methods.get
    });
  },
  getCustomerList(params) {
    return request({
      url: `/users/silvies`,
      method: Methods.get,
      params
    });
  },
  exportCustomerList(params) {
    return request({
      url: `/users/silvies/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  getMemberList(params) {
    return request({
      url: `/users`,
      method: Methods.get,
      params
    });
  },
  exportMemberList(params) {
    return request({
      url: `/users/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  getHomeList(params) {
    return request({
      url: `/homes`,
      method: Methods.get,
      params
    });
  },
  exportHomeList(params) {
    return request({
      url: `/homes/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  getMemberDetail(userId) {
    const params = {
      pageNo: 1,
      pageSize: 1,
      userId
    };
    return request({
      url: `/users`,
      method: Methods.get,
      params
    });
  },
  getRoomDetail(roomId) {
    return request({
      url: `/rooms/${roomId}`,
      method: Methods.get
    });
  },
  getRoomList(params) {
    return request({
      url: `/rooms`,
      method: Methods.get,
      params
    });
  },
  exportRoomList(params) {
    return request({
      url: `/rooms/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  getAllRoomListByHome(homeId) {
    const params = {
      pageNo: 1,
      pageSize: -1,
      homeId
    };
    return request({
      url: `/homes`,
      method: Methods.get,
      params
    });
  },
  getStatisticsData(homeId, roomId, startTime, endTime, cycle) {
    const params = {
      homeId,
      roomId,
      startTime,
      endTime,
      cycle
    };
    return request({
      url: `/homes/trends`,
      method: Methods.get,
      params
    });
  },
  getDeviceList(params) {
    return request({
      url: `/sensors`,
      method: Methods.get,
      params
    });
  },
  exportDeviceList(params) {
    return request({
      url: `/sensors/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  editStrategy(sensorId, params) {
    return request({
      url: `/sensors/${sensorId}/cdc/policy`,
      method: Methods.put,
      params
    });
  },
  getHomeDetail(homeId) {
    return request({
      url: `/homes/${homeId}`,
      method: Methods.get
    });
  },
  setDistributor(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}/actions/setAsDistributor`,
      method: Methods.put,
      params
    });
  },
  addTenant(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}/actions/addTenant`,
      method: Methods.post,
      params
    });
  },
  fixTenant(params) {
    return request({
      url: `/tenants/actions/fixTenant`,
      method: Methods.post,
      params
    });
  },
  getTenantList(params) {
    return request({
      url: `/tenants/getTenant`,
      method: Methods.get,
      params
    });
  },
  // 获取可迁移所有组织
  getTenantListByDistributorId(organizationId, type) {
    return request({
      url: `/tenants/${organizationId}/migratable?type=${type}`,
      method: Methods.get
    });
  },
  addNewTenant(params) {
    return request({
      url: `/tenants/migration`,
      method: Methods.post,
      params
    });
  },
  changeHome(params) {
    return request({
      url: `/tenants/changeHome`,
      method: Methods.post,
      params
    });
  },
  changeUser(params) {
    return request({
      url: `/tenants/changeUser`,
      method: Methods.post,
      params
    });
  },
  upgradeUser(userId) {
    return request({
      url: `/users/${userId}/upgradeUser`,
      method: Methods.post
    });
  },
  reassignOwner(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}/actions/switchRoot`,
      method: Methods.put,
      params
    });
  },
  getHomeListByTenantId() {
    const params = {
      pageNo: 1,
      pageSize: -1
    };
    return request({
      url: `/homes`,
      method: Methods.get,
      params
    });
  },
  getMemberListByTenantId(tenantId) {
    const params = {
      pageNo: 1,
      pageSize: -1,
      tenantId
    };
    return request({
      url: `/users`,
      method: Methods.get,
      params
    });
  },
  getFallAlertList(params) {
    return request({
      url: `/events/fall`,
      method: Methods.get,
      params
    });
  },
  exportFallAlertList(params) {
    return request({
      url: `/events/fall/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  getLicenseList(params) {
    return request({
      url: `/licenses`,
      method: Methods.get,
      params
    });
  },
  exportLicenseList(params) {
    return request({
      url: `/licenses/download`,
      method: Methods.get,
      params: appendTimezone(params)
    });
  },
  exportInvoice(params) {
    return request({
      url: `/billing/actions/download`,
      method: Methods.get,
      params
    });
  },
  // reseller
  getResellerList() {
    return request({
      url: `/resellers`,
      method: Methods.get
    });
  },
  exportResellerList() {
    return request({
      url: `/resellers/download`,
      method: Methods.get,
      params: appendTimezone()
    });
  },
  editResellerInfo(resellerId, params) {
    return request({
      url: `/resellers/${resellerId}`,
      method: Methods.put,
      params
    });
  },
  getResellerSensorList(resellerId, params) {
    return request({
      url: `/resellers/${resellerId}/sensors`,
      method: Methods.get,
      params
    });
  },
  delResellerSensor(resellerId, params) {
    return request({
      url: `/resellers/${resellerId}/sensors`,
      method: Methods.delete,
      useJsonBody: true,
      params
    });
  },
  addReseller(params) {
    return request({
      url: `/resellers`,
      method: Methods.post,
      params
    });
  },
  // 新增零售商和设备绑定信息
  addResellerSensor(resellerId, params) {
    return request({
      url: `/resellers/${resellerId}/sensors`,
      method: Methods.post,
      params
    });
  },
  // 批量导入零售商设备
  importResellerSensors(resellerId, params) {
    return request({
      url: `/resellers/${resellerId}/sensors/actions/batchcreate`,
      method: Methods.post,
      params
    });
  },
  migrate(params) {
    return request({
      url: `/tenants/migration`,
      method: Methods.put,
      params
    });
  },
  getWhiteLabel(tenantId) {
    return request({
      url: `/tenants/${tenantId}/whitelabel`,
      method: Methods.get
    });
  },
  editWhiteLabel(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}/whitelabel`,
      method: Methods.post,
      params
    });
  },
  createRequestAccess(tenantId, params) {
    return request({
      url: `/tenants/${tenantId}/supportAccessRequests`,
      method: Methods.post,
      params
    });
  },
  revokeRequestAccess(tenantId, requestId, params) {
    return request({
      url: `/tenants/${tenantId}/supportAccessRequests/${requestId}/actions/revoke`,
      method: Methods.put,
      params
    });
  },
  getRequestAccessToken(tenantId, requestId) {
    return request({
      url: `/tenants/${tenantId}/supportAccessRequests/${requestId}/sessions`,
      method: Methods.post
    });
  },
  endRequestSession(tenantId, requestId) {
    return request({
      url: `/tenants/${tenantId}/supportAccessRequests/${requestId}/actions/endSession`,
      method: Methods.put
    });
  }
};
Http.install = function (_Vue) {
  _Vue.prototype.$http = Http;
};
export default Http;
