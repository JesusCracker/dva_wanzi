export default {
  namespace: 'fileUpload',
  state: {
    fileList: [],
    ossParams: {
      accessid: '',
      expire: '',
      host: '',
      policy: '',
      signature: '',
    },
    limit: 999,
  },

  subscriptions: {
    setup({ dispatch, history }) {

    }
  },

  effects: {
    //获取oss信息
    * fetchOSSInfo({ payload }, { call, put }) {
      const response = yield call(
        // eslint-disable-next-line no-undef
        axios.post,
        '/api/order/schoolDelivery/wzMinaimgPolicyAndSignature',
        payload
      );
      yield put({
        type: 'saveOssParams',
        payload: { ...response.data },
      });
      return response;
    },
    //上传文件记录
    * recordFile({ payload }, { call, put }) {
      return yield call(
        // eslint-disable-next-line no-undef
        axios.post,
        '/api/print/mina/printFileUpload',
        payload
      );
    },

    //获取打印列表
    * fetchPrintFileList({ payload }, { call, put }) {
      const response = yield call(
        // eslint-disable-next-line no-undef
        axios.post,
        'api/print/mina/printFileList',
        payload
      );
      yield put({
        type: 'savePrintFileList',
        payload: [...response.data],
      });
      return response;
    },

    //删除打印列表
    * deletePrintFile({ payload }, { call, put }) {
      const response = yield call(
        // eslint-disable-next-line no-undef
        axios.post,
        'api/print/mina/printFileDelete',
        payload
      );
      yield put({
        type: 'savePrintFileList',
        payload: [...response.data],
      });
      return response;
    },

  },

  reducers: {
    savePrintFileList(state, { payload }) {
      return {
        ...state,
        fileList: [...payload]
      };
    },
    saveOssParams(state, { payload }) {
      return {
        ...state,
        ossParams: { ...payload }
      };
    },

  },

};
