import { Button, ImageUploader } from "antd-mobile";
import React from "react";
import wx from "weixin-js-sdk";
import './index.less';
//h5返回到wx
const goWXList = () => {
  //这里还是要注意一下你跳转的页面，如果跳转的页面是首页之类带有tabbar的，你需要使用:
  //   wx.miniProgram.switchTab({url:'/path/to/page'})
  //其他页面你可以使用
  wx.miniProgram.getEnv((res) => {
    wx.miniProgram.postMessage({
      data: {
        closeModal: true,
      }
    });
    if (res.miniprogram) {
      wx.miniProgram.navigateTo({ url: '/path/to/page' })
    }
  })
};
const Index = (props) => {
  const { isPreview, beforeUpload, setFileList, uploadFile } = props;
  return <>
    <div className={'fileListBtns'}>
      <Button className={'upload'} size={"middle"} shape='rounded' fill='outline'>
        <ImageUploader
          // multiple
          accept={'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf'}
          preview={isPreview}
          beforeUpload={beforeUpload}
          onChange={setFileList}
          upload={uploadFile}
        >上传文件</ImageUploader>
      </Button>
      <Button onClick={() => goWXList()} className={"order"} size={"middle"} shape='rounded'>去下单</Button>
    </div>
  </>
}

export default Index;
