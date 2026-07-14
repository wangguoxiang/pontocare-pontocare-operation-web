import i18n from '@/locales/i18n';

export const METHOD = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch'
};

export const LanguageList = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'zh',
    label: '中文'
  },
  /* {
        value: "fi",
        label: "Suomen kieli",
    }, */
  {
    value: 'ja',
    label: '日本語'
  }
];

export const FirmwareUpgradeStatusConst = {
  UpToDate: 0,
  NewFirmwareAvailable: 10,
  Upgrading: 20,
  UpgradeFailed: 30
};

export const SensorStatusConst = {
  NotActive: 0,
  Online: 10,
  Offline: 20
};

export const CaptchaType = {
  register: 1,
  forget: 2,
  modify: 3
};

export const FirmwareDeployStatus = {
  Unreleased: 0,
  WhitelistRelease: 1,
  FullRelease: 2
};

export const AuditLogType = {
  InvoiceStatus: 0,
  Price: 1
};

export const InvoiceStatus = {
  Unpaid: 0,
  Paid: 1,
  Cancelled: 2
};

export const InvoiceStatusMap = {
  0: i18n.t('unpaid'),
  1: i18n.t('paid'),
  2: i18n.t('cancelled')
};

export const InvoiceStatusList = [
  {
    value: 0,
    label: i18n.t('unpaid')
  },
  {
    value: 1,
    label: i18n.t('paid')
  },
  {
    value: 2,
    label: i18n.t('cancelled')
  }
];

export const InvoiceOverDue = {
  OnPeriod: 0,
  Overdue: 1,
  Done: 2
};

export const InvoiceOverDueMap = {
  0: i18n.t('onPeriod'),
  1: i18n.t('overdue'),
  2: i18n.t('done')
};

export const CurrencyList = [
  {
    label: i18n.t('price0003'),
    value: 'cad'
  },
  {
    label: i18n.t('price0004'),
    value: 'usd'
  },
  {
    label: i18n.t('price0005'),
    value: 'eur'
  }
];

export const DeviceStatusConst = {
  radarException: 21,
  alignmentIncorrect: 22,
  radarRebootException: 23
};
export const MarkFallType = {
  noTp: 0,
  isTp: 1,
  notSure: 2
};
export const UserType = {
  endUser: 210,
  tenantAdmin: 200,
  subAdmin: 201,
  distributor: 150,
  developer: 220
};

export const ExportRecordsLimit = 50000;

export const RequestAccessProcess = {
  requested: 0,
  approved: 1,
  denied: 2,
  revoked: 3
};
