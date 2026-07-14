import moment from 'moment';

// 防抖
export function debounce(fn, delay = 300) {
  let timeout;
  return function (...args) {
    const context = this; // 保存函数调用上下文
    clearTimeout(timeout); // 清除之前的计时器

    // 设置新的计时器，在 delay 毫秒后执行函数
    timeout = setTimeout(function () {
      fn.apply(context, args); // 使用保存的上下文和传入的参数执行原始函数
    }, delay);
  };
}

export function getCurrentLanguage() {
  const lang = localStorage.getItem('language');
  const supportLangs = ['en', 'zh', 'ja'];
  return supportLangs.includes(lang) ? lang : 'en';
}

// 将时间戳转换为用户当前时区的时间点
export function formatTableTime(timestamp) {
  let userTimezone = new Date(timestamp).getTimezoneOffset(); // 时区偏移量
  // 获取当前language
  const language = getCurrentLanguage();
  if (language === 'zh') {
    return moment(timestamp).utcOffset(-userTimezone).format('YYYY-M-D HH:mm');
  }
  if (language === 'en') {
    return moment(timestamp).utcOffset(-userTimezone).format('h:mm A, MMM D, YYYY');
  }
  if (language === 'ja') {
    return moment(timestamp).utcOffset(-userTimezone).format('YYYY/M/D HH:mm');
  }
  if (language === 'fi') {
    return moment(timestamp).utcOffset(-userTimezone).format('D.M.YYYY HH:mm');
  }
}

export function formatYMDTime(timestamp) {
  let userTimezone = new Date(timestamp).getTimezoneOffset(); // 时区偏移量
  // 获取当前language
  const language = getCurrentLanguage();
  if (language === 'zh') {
    return moment(timestamp).utcOffset(-userTimezone).format('YYYY-M-D');
  }
  if (language === 'en') {
    return moment(timestamp).utcOffset(-userTimezone).format('MMM D, YYYY');
  }
  if (language === 'ja') {
    return moment(timestamp).utcOffset(-userTimezone).format('YYYY/M/D');
  }
  if (language === 'fi') {
    return moment(timestamp).utcOffset(-userTimezone).format('D.M.YYYY');
  }
}

export function formatYMTime(timestamp) {
  let userTimezone = new Date(timestamp).getTimezoneOffset(); // 时区偏移量
  // 获取当前language
  const language = getCurrentLanguage();
  if (language === 'zh') {
    return moment(timestamp).utcOffset(-userTimezone).format('YYYY-M');
  }
  if (language === 'en') {
    return moment(timestamp).utcOffset(-userTimezone).format('MMM, YYYY');
  }
  if (language === 'ja' || language === 'fi') {
    return moment(timestamp).utcOffset(-userTimezone).format('M/YYYY');
  }
}

export function formatYMTimeUtc0(timestamp) {
  // 获取当前language
  const language = getCurrentLanguage();
  if (language === 'zh') {
    return moment(timestamp).format('YYYY-M');
  }
  if (language === 'en') {
    return moment(timestamp).format('MMM, YYYY');
  }
  if (language === 'ja' || language === 'fi') {
    return moment(timestamp).format('M/YYYY');
  }
}

export const downloadFile = async (url) => {
  try {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    // 使用 fetch 获取文件
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    const blob = await response.blob();

    // 创建一个新的 Blob 对象
    // const newBlob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // 创建链接下载
    const link = document.createElement('a');
    const href = window.URL.createObjectURL(blob);
    link.href = href;
    link.download = filename; // 设置下载文件的名称
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(href);
  } catch (error) {
    console.error('下载失败:', error);
  }
};

export function convertTimestampToTimezone(timestamp, userTimezone) {
  return moment(timestamp)
    .utcOffset(-userTimezone)
    .format('HH:mm:ss YYYY-MM-DD');
}

export function DatePickerTitle(timestamp) {
  let userTimezone = new Date(timestamp).getTimezoneOffset(); // 时区偏移量
  // 获取当前language
  const language = getCurrentLanguage();
  if (language === 'zh') {
    return moment(timestamp).utcOffset(-userTimezone).format('YYYY-M');
  }
  if (language === 'en') {
    return moment(timestamp).utcOffset(-userTimezone).format('MMM, YYYY');
  }
  if (language === 'ja' || language === 'fi') {
    return moment(timestamp).utcOffset(-userTimezone).format('M/YYYY');
  }
}
export function formatAlertDuration(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const dayUnit = this.$t('dashboardd');
  const hourUnit = this.$t('dashboardh');
  const minUnit = this.$t('dashboardm');
  const secUnit = this.$t('dashboards');

  let result = '';

  if (days > 0) {
    result += days + dayUnit;
  }

  if (hours > 0) {
    result += ' ' + hours + hourUnit;
  }

  if (minutes > 0) {
    result += ' ' + minutes + minUnit;
  }

  if (remainingSeconds > 0) {
    result += ' ' + remainingSeconds + secUnit;
  }

  if (result === '') {
    result = '0 ' + secUnit;
  }

  return result.trim();
}
export function isJsonString(str) {
  if (typeof str !== 'string') return false;
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return false;
  }
}
export function secondsToHours(seconds) {
  if (seconds === 0 || seconds === null || seconds < 180) {
    return '0';
  }
  const hours = seconds / 3600;
  return hours.toFixed(1);
}
