import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'dva';
import { OSSFilePath, OSSService, servicesImagePath } from "@/global";
import { Toast, ProgressBar, Dialog, PullToRefresh } from "antd-mobile";
import axios from "axios";
import { routerRedux } from "dva/router";
import { CloseCircleOutline } from 'antd-mobile-icons'
import './indexPage.less';
import EmptyContent from "@/components/empty/EmptyContent";
import UploadFooter from "@/components/uploadFooter";

const IndexPage = (props) => {
  let {
    ossParams = {},
    fileList: list,
    limit,
  } = useSelector(({ fileUpload }) => (fileUpload));
  const { userInfo: { unionId } } = useSelector(({ global }) => (global));
  const [fileList, setFileList] = useState([]);
  let [page, setPage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchOSSInfos();
    fetchPrintList();
    setFileList([...list]);
  }, [])
  // console.log('flleList---', fileList);
  useEffect(() => {
    setFileList([...list])

  }, [list])

  //选择文件
  const chooseFiles = () => {
    dispatch(
      routerRedux.push(
        {
          pathname: `/fileList`,
        },
      )
    );

  }
  const beforeUpload = (file) => {
    let newfilename = file.name + '';
    let _newFileName = newfilename.toLowerCase();
    if (_newFileName.indexOf('.pdf') === -1 && _newFileName.indexOf('.docx') === -1 && _newFileName.indexOf('.doc') === -1 && _newFileName.indexOf('.ppt') === -1 && _newFileName.indexOf('.pptx') === -1) {
      // 限制了文件的大小和具体文件类型
      Toast.show('仅支持PDF、Word、PPT文件');
      return false;
    } else if (file.size > 1024 * 1024 * 10) {
      Toast.show('请选择小于 10M 的文件')
      return false;
    } else {
      return file
    }
  }

  //获取oss信息
  const fetchOSSInfos = () => {
    dispatch({
      type: 'fileUpload/fetchOSSInfo',
      payload: {
        id: 1
      }
    })
  }

  //获取打印列表
  const fetchPrintList = () => {
    return dispatch({
      type: 'fileUpload/fetchPrintFileList',
      payload: {
        unionId,
        page,
        limit,
      }
    })
  }

  //上传文件记录
  const recordFile = (fileObj) => {
    // paperType-纸型 默认A4,colorType-色彩 默认黑白,singleOrDouble-单双 默认双面
    // pageCount-页数 目前前端暂时获取不了，先写死值4。
    let { name: fileName, paperType = 'A4', colorType = '黑白', singleOrDouble = '双面', pageCount = 4 } = fileObj;
    const type = fileName.substring(fileName.lastIndexOf('.') + 1);//：word;pdf;ppt
    let typeStr = '';
    if (type === 'doc' || type === 'docx') {
      typeStr = 'word';
    } else if (type === 'ppt' || type === 'pptx') {
      typeStr = 'ppt';
    } else if (type === 'pdf') {
      typeStr = 'pdf';
    }
    dispatch({
      type: 'fileUpload/recordFile',
      payload: {
        unionId,
        fileName,
        fileType: typeStr,
        paperType,
        colorType,
        singleOrDouble,
        pageCount,
        filePath: OSSFilePath + 'printFile/' + fileName
      }
    }).then(res => {
      // console.log('fileList====', fileList);
      const fileObj = res.data;
      //更新列表数据
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].name === fileObj.fileName && fileList[i].id === undefined && fileObj.id) {
          fileList[i] = fileObj;
        }
      }
      setFileList([...fileList]);

    }).catch(err => console.log(err));

  }


  //上传文件
  const uploadFile = (file) => {
    let itemObj = {};
    itemObj.name = file.name;
    itemObj.timeStamp = new Date().getTime();
    fileList.unshift(itemObj)
    //创建上传 from 开始
    let ossData = new FormData()
    ossData.append('name', file.name);
    ossData.append('key', OSSFilePath + 'printFile/' + file.name);
    ossData.append('policy', ossParams.policy);
    ossData.append('OSSAccessKeyId', ossParams.accessid)
    // ossData.append('success_action_status', 201)
    ossData.append('signature', ossParams.signature)
    ossData.append('file', file, file.name)
    try {
      // eslint-disable-next-line no-undef
      axios({
        url: OSSService,
        method: 'post',
        onUploadProgress: progressEvent => { //progressEvent中包含上传信息
          itemObj.percent = progressFunction(progressEvent.event);
          itemObj.onErrorStatus = false;
          for (let i = 0; i < fileList.lengh; i++) {
            if (fileList[i].name === file.name) {
              fileList[i] = JSON.parse(JSON.stringify(itemObj));
            }
          }
          setFileList(JSON.parse(JSON.stringify(fileList)));
        },
        data: ossData,

      }).then(res => {
        recordFile(file)
      }).catch(err => {
        Toast.show({
          icon: 'fail',
          content: '文件上传失败，请重新上传',
        })
        itemObj.onErrorStatus = true;
        for (let i = 0; i < fileList.lengh; i++) {
          if (fileList[i].name === file.name) {
            fileList[i] = JSON.parse(JSON.stringify(itemObj));
          }
        }
        setFileList(JSON.parse(JSON.stringify(fileList)));
      })
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        // percent:JSON.parse(JSON.stringify(itemObj))
      }

    } catch (error) {
      console.log(error)
    }


  }

  const progressFunction = (event) => {
    // 设置进度显示
    if (event.lengthComputable) {
      let percent = Math.floor(event.loaded / event.total * 100)
      if (percent > 100) {
        percent = 100
      }
      return percent;
      // this.uploadPercent = percent
    }
  };

  //文件格式图标
  const fetchFileIcon = (fileName) => {
    //'doc', 'docx', 'pdf', 'ppt', 'pptx'
    var type = '', str = '';
    if (fileName) {
      type = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (type === 'doc' || type === 'docx') {
        str = 'word.png';
      } else if (type === 'ppt' || type === 'pptx') {
        str = 'ppt.png';
      } else if (type === 'pdf') {
        str = 'pdf.png';
      }
    }
    return str
  }

  //文件名称缩进
  const colName = (fileName) => {
    if (fileName && fileName.length > 12) {
      let type = fileName.substring(fileName.lastIndexOf('.') + 1);
      //截取字符串中间用省略号显示
      let subStr1 = fileName.slice(0, fileName.lastIndexOf('.')).slice(0, 12);
      // var subStr2 = fileName.substr(fileName.length-5,5);
      let subStr = subStr1 + "..." + type;
      return subStr;
    } else {
      return fileName
    }
  }

  //删除已上传列表
  const deleteItem = (item) => {
    const { id, fileName } = item;
    Dialog.confirm({
      content: `是否删除${fileName}?`,
      onConfirm: async () => {
        const newFileList = fileList.filter((item, fileListIndex, array) => item.id !== id);
        setFileList(newFileList);
        dispatch({
          type: 'fileUpload/deletePrintFile',
          payload: {
            unionId,
            deleteIds: id,
          }
        }).then(res => {
          Toast.show({
            icon: 'success',
            content: '删除成功',
            position: 'bottom',
          })

        }).catch(err => {

        })

      },
      onCancel: () => {
      }
    })
  }


  const statusRecord = {
    pulling: '用力拉',
    canRelease: '松开吧',
    refreshing: '玩命加载中...',
    complete: '好啦',
  }

  const contentProps = {
    isPreview: false,
    beforeUpload,
    setFileList,
    uploadFile
  }


  return (
    <div className={'pageContent'}>
      {Array.isArray(fileList) && fileList.length === 0 && <EmptyContent {...contentProps}/>}
      <PullToRefresh
        onRefresh={async () => {
          fetchPrintList()
        }}
        renderText={status => {
          return <div>{statusRecord[status]}</div>
        }}
      >
        {Array.isArray(fileList) && fileList.length > 0 && fileList.map((item, index) => {
          if (item.percent < 100) {
            return <div className={"item"} key={index}>
              {/*<div className={'close'}><CloseCircleOutline fontSize={16}/></div>*/}
              <div className={"itemBlock"}>
                <div className={"itemIndex"}>{index}</div>
                <div className={"fileIcon"}>
                  <img src={servicesImagePath + '/images/' + fetchFileIcon(item.name || item.filePath)} alt=""
                       className={"iconImage"}/>
                </div>
                <div className={"fileName"}>
                  <div className={"name"}>{colName(item.name || item.fileName)}</div>
                  <div className={"progress"}>
                    {item?.onErrorStatus && <ProgressBar percent={item.percent}
                                                         text
                                                         style={{
                                                           '--fill-color': '#ee4433',
                                                         }}/> ||
                      <ProgressBar percent={item.percent}
                                   text
                                   style={{
                                     '--fill-color': '#FFAB51',
                                   }}/>
                    }

                  </div>
                  {item?.onErrorStatus && <div className={"error"}>上传失败</div>}
                </div>

              </div>

            </div>
          } else {
            return <div className={"item"} key={index}>
              {!item?.onErrorStatus && <div className={"close"} onClick={() => {
                deleteItem(item)
              }}>
                <CloseCircleOutline fontSize={16}/></div>
              }

              <div className={"itemBlock"}>
                <div className={"itemIndex"}>{index}</div>
                <div className={"fileIcon"}>
                  <img src={servicesImagePath + '/images/' + fetchFileIcon(item.name || item.filePath)} alt=""
                       className={"iconImage"}/>
                </div>
                <div className={"fileName"}>
                  <div className={"name"}>{colName(item.name || item.fileName)}</div>
                  {item?.onErrorStatus && <div className={"error"}>上传失败</div> ||
                    <div className={"pageNumber"}>{item.pageCount&&'共'+item.pageCount+'页'||'解析中...'}</div>}
                </div>
              </div>

            </div>
          }
        })}

      </PullToRefresh>
      {Array.isArray(fileList) && fileList.length > 0 && <UploadFooter {...contentProps}/>}
    </div>
  );
}

  IndexPage.propTypes = {};

  export default IndexPage;
