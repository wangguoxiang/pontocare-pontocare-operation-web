import i18n from '@/locales/i18n';
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      layout: 'default',
      title: i18n.t('login') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: () => import('@/pages/forgotPassword/index.vue'),
    meta: {
      layout: 'default',
      title: i18n.t('login') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: () => import('@/pages/maintenance/index.vue'),
    meta: {
      layout: 'default',
      title: 'Maintenance | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('@/pages/clients/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('clients') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/reseller',
    name: 'reseller',
    component: () => import('@/pages/reseller/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('reseller0001') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/license',
    name: 'license',
    component: () => import('@/pages/license/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('license0001') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/homes',
    name: 'homes',
    component: () => import('@/pages/homes/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('homes') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: () => import('@/pages/rooms/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('rooms') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/devices',
    name: 'devices',
    component: () => import('@/pages/devices/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('devices') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/users/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('users') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/firmware',
    name: 'firmware',
    component: () => import('@/pages/firmware/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('firmware') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/fallAlerts',
    name: 'fallAlerts',
    component: () => import('@/pages/fallAlerts/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('fallAlerts') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/account/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('myAccount') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/ops',
    name: 'ops',
    component: () => import('@/pages/ops/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('myAccount') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '/migration',
    name: 'migration',
    component: () => import('@/pages/migration/index.vue'),
    meta: {
      layout: 'primary',
      title: i18n.t('reseller0018') + ' | ' + i18n.t('pcOperationsBackend')
    }
  },
  {
    path: '*', // 通配符，处理未匹配的路由
    redirect: '/'
  }
];

export default routes;
