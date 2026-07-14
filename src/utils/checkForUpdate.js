import axios from 'axios';
import store from '@/store';

let versionTag = null;
let timer = null;

const getVersionTag = async () => {
  let res = await axios.head(__webpack_public_path__);
  if (res.status == 200) {
    if (res.headers && res.headers.etag) {
      return res.headers.etag;
    }
  }
  return '';
};

const checkTag = async () => {
  const newVersionTag = await getVersionTag();
  if (versionTag === null) {
    versionTag = newVersionTag;
  } else if (newVersionTag && versionTag !== newVersionTag) {
    clearInterval(timer);
    store.commit('system/SET_IS_UPDATE_VERSION', true);
  }
};

timer = setInterval(checkTag, 30000);
