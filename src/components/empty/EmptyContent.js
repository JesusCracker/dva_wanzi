import React, { useEffect, useState } from 'react'
import { servicesImagePath } from "@/global";
import { Button, ImageUploader } from "antd-mobile";

const EmptyContent = (props) => {
  const { beforeUpload, isPreview, setFileList, uploadFile } = props;
  return (
    <>
      <div className={'tips'}>
        <img src={servicesImagePath + '/images/xzwdgs.png'} alt="" className={'bg-image'}/>
        <div className={'title'}>支持上传 <span className={"color"}> Word 、PPT、PDF</span> 格式文件</div>
        <div className={"btn"}>
          <ImageUploader
            // multiple
            accept={'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf'}
            preview={isPreview}
            beforeUpload={beforeUpload}
            onChange={setFileList}
            upload={uploadFile}
          >
            <Button className={"choose"} block shape='rounded'
                    color='linear-gradient(143deg, #F7CC75, #F8B54F)'>

              选择本地文件
            </Button>
          </ImageUploader>
        </div>
      </div>
    </>
  );
};

EmptyContent.propTypes = {};

export default EmptyContent;
