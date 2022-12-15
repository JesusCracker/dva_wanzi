import qs from 'query-string';
import { Toast } from 'antd-mobile'

export default {

  namespace: 'global',

  state: {
    userInfo: {
      unionId: '',
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/') {
          if (!qs.parse(window.location.search)?.unionId) {
            Toast.show({
              content: '参数却少unionId',
            })
            return;
          }
          localStorage.setItem('userInfo', JSON.stringify(qs.parse(window.location.search)));
          dispatch({
            type: 'global/fetchUserInfo',
            payload: { ...qs.parse(window.location.search) }
          })
        }
      });

    },
  },

  effects: {
    * fetchUserInfo({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'saveUserInfo', payload: { ...payload } });
    },
  },

  reducers: {
    saveUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: { ...payload }
      };

    },
  },

};
