import Mock from 'mockjs';

Mock.setup({
  timeout: '200-600'
});
Mock.mock(/\/prices\?/, 'get', {
  total: 15,
  records: [{
    'tenantName': 'testTenant',
    'tenantId': '1',
    'monthPrices': [{
      'resourceId': '5',
      'resourceDesc': 'Basic-Lite',
      'price': 10,
      'effectiveDate': 1588230400000,
      'expireDate': 4102415999000
    }, {
      'resourceId': '5',
      'resourceDesc': 'Basic-Lite',
      'price': 12,
      'effectiveDate': 1588130400000,
      'expireDate': 1588270400000
    }, {
      'resourceId': '6',
      'resourceDesc': 'Premium-Lite',
      'price': 17,
      'effectiveDate': 1588230400000,
      'expireDate': 4102415999000
    }, {
      'resourceId': '6',
      'resourceDesc': 'Premium-Lite',
      'price': 19,
      'effectiveDate': 1588130400000,
      'expireDate': 1588270400000
    }, {
      'resourceId': '9',
      'resourceDesc': 'Premium-Plus',
      'price': 26,
      'effectiveDate': 1588130400000,
      'expireDate': 4102415999000
    }]
  }, {
    'tenantName': 'testTenant55',
    'tenantId': '2',
    'monthPrices': [{
      'resourceId': '7',
      'resourceDesc': 'Basic-Lite',
      'price': 12,
      'effectiveDate': 1588230400000,
      'expireDate': 1589230400000
    }, {
      'resourceId': '8',
      'resourceDesc': 'Premium-Lite',
      'price': 18,
      'effectiveDate': 1588130400000,
      'expireDate': 1588270400000
    }]
  }]
});

Mock.mock(/\/prices/, 'put', {});

Mock.mock(/\/auditLogs\?/, 'get', {
  total: 15,
  records: [{
    objectId: 1,
    operator: 'test@qq.com',
    tenantName: 'tenant11',
    operationDate: 1588230400000,
    action: 'update',
    data: '{"modification":"status","before":{"status":0},"after":{"status":1}}'
  }, {
    objectId: 2,
    operator: 'test22@qq.com',
    tenantName: 'tenant22',
    operationDate: 1588231400000,
    action: 'update',
    data: '{"modification":"status","before":{"status":1},"after":{"status":0}}'
  }, {
    objectId: 3,
    operator: 'test33@qq.com',
    tenantName: 'tenant33',
    operationDate: 1588232400000,
    action: 'update',
    data: '{"modification":"status","before":{"status":2},"after":{"status":1}}'
  }, {
    objectId: 4,
    operator: 'test@qq.com',
    tenantName: 'tenant11',
    operationDate: 1588230400000,
    action: 'update',
    data: '{"modification":"price","before":{"price":8745},"after":{"price":4156},"effectiveType":0,"resourceDesc":"Basic-Lite"}'
  }, {
    objectId: 5,
    operator: 'test22@qq.com',
    tenantName: 'tenant22',
    operationDate: 1588231400000,
    action: 'update',
    data: '{"modification":"price","before":{"price":285},"after":{"price":817},"effectiveType":0,"resourceDesc":"Basic-Plus"}'
  }, {
    objectId: 6,
    operator: 'test33@qq.com',
    tenantName: 'tenant33',
    operationDate: 1588232400000,
    action: 'update',
    data: '{"modification":"price","before":{"price":453},"after":{"price":172},"effectiveType":1,"resourceDesc":"Basic-Lite"}'
  }, {
    objectId: 7,
    operator: 'test@qq.com',
    tenantName: 'tenant11',
    operationDate: 1588230400000,
    action: 'update',
    data: '{"modification":"price","before":{"price":645},"after":{"price":517},"effectiveType":0,"resourceDesc":"Basic-Plus"}'
  }, {
    objectId: 8,
    operator: 'test22@qq.com',
    tenantName: 'tenant22',
    operationDate: 1588231400000,
    action: 'update',
    data: '{"modification":"price","before":{"price":487},"after":{"price":147},"effectiveType":1,"resourceDesc":"Parime-Lite"}'
  }, {
    objectId: 9,
    operator: 'test33@qq.com',
    tenantName: 'tenant33',
    operationDate: 1588232400000,
    action: 'update',
    data: '{"modification":"price","before":{"price":312},"after":{"price":127},"effectiveType":0,"resourceDesc":"Parime-Plus"}'
  }]
});

Mock.mock(/\/statistics\/invoices\?/, 'get', {
  unpaid: {
    amount: 7,
    money: 456.55
  },
  overdueUnpaid: {
    amount: 89,
    money: 265
  },
  annualIncome: {
    amount: 12,
    money: 78
  },
  cashflows: [{
    month: 1511310400000,
    money: 15957
  }, {
    month: 1522320400000,
    money: 156
  }, {
    month: 1538330400000,
    money: 2599
  }, {
    month: 1548340400000,
    money: 26
  }, {
    month: 1558350400000,
    money: 9589
  }, {
    month: 1568360400000,
    money: 365
  }, {
    month: 1578370400000,
    money: 3578
  }, {
    month: 1588380400000,
    money: 1599
  }, {
    month: 1598390400000,
    money: 234
  }, {
    month: 1608530400000,
    money: 152
  }, {
    month: 1618630400000,
    money: 0
  }, {
    month: 1628730400000,
    money: 2688
  }]
});

Mock.mock(/\/invoices\?/, 'get', {
  total: 15,
  records: [{
    issueDate: 1588231400000,
    id: 1,
    tenantName: 'tenant11',
    period: 1588731400000,
    totalFee: 56.5,
    status: 0,
    overdue: 0
  }, {
    issueDate: 1588330400000,
    id: 2,
    tenantName: 'tenant22',
    period: 1588735400000,
    totalFee: 156.5,
    status: 1,
    overdue: 1
  }, {
    issueDate: 1588335400000,
    id: 3,
    tenantName: 'tenant33',
    period: 1588735420000,
    totalFee: 1589.5,
    status: 2,
    overdue: 2
  }]
});

Mock.mock(/\/invoices\/\d+\/status/, 'put', {});

export default Mock;
