const trimObjItemValue = (obj) => {
  let newObj = obj instanceof Array ? [] : {};
  if (typeof obj === 'object') {
    return obj;
  } else {
    Object.keys(obj).forEach((key) => {
      if (obj[key] instanceof Array) {
        newObj[key] = trimObjItemValue(obj[key]);
      } else if (typeof obj[key] === 'string') {
        newObj[key] = obj[key].trim();
      } else {
        newObj[key] = obj[key];
      }
    });
  }
  return newObj;
};

const getEmailSendLeftTime = (userId) => {
  const currentResendMap = clearEmailSendTime();
  const resendTime = currentResendMap.get(userId);
  if (resendTime) {
    const now = Date.now();
    const timeDifference = now - resendTime;
    return 30 - Math.ceil(timeDifference / 1000);
  }
  return 0;
};

const updateEmailSendTime = (userId) => {
  const currentResendMap = clearEmailSendTime();
  currentResendMap.set(userId, Date.now());
  saveMapToLocalStorage('emailSendTime', currentResendMap);
};

const clearEmailSendTime = () => {
  let filteredMap = new Map();
  const allInvitation = loadMapFromLocalStorage('emailSendTime');
  if (allInvitation.size > 0) {
    filteredMap = new Map([...allInvitation].filter(([key, value]) => {
      const now = Date.now();
      const timeDifference = now - value;
      const secondsDifference = timeDifference / 1000;
      return secondsDifference < 31;
    }));
    saveMapToLocalStorage('emailSendTime', filteredMap);
  }
  return filteredMap;
};

// 存储Map到localStorage
function saveMapToLocalStorage(key, map) {
  const mapAsJson = JSON.stringify(Array.from(map.entries()));
  localStorage.setItem(key, mapAsJson);
}

// 从localStorage读取Map
function loadMapFromLocalStorage(key) {
  const json = localStorage.getItem(key);
  if (json === null) {
    return new Map();
  }
  return new Map(JSON.parse(json));
}

function blobUtil(blob, fileName, isHtml) {
  if (isHtml) {
    const blobData = new Blob([blob], {
      type: 'text/html'
    });
    const href = URL.createObjectURL(blobData);
    window.open(href);
    URL.revokeObjectURL(href);
  } else {
    const href = URL.createObjectURL(blob);
    const downloadElement = document.createElement('a');
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    URL.revokeObjectURL(href);
  }
}

export { trimObjItemValue, updateEmailSendTime, getEmailSendLeftTime, blobUtil };
