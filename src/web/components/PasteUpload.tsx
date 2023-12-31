import  { useCallback, useState, useEffect } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { RcFile, UploadFile, UploadChangeParam } from "antd/lib/upload/interface";

const { Dragger } = Upload;

export interface PasteUploadProps extends UploadProps {
  onPaste?: (event: ClipboardEvent) => void;
  onUploadSuccess?: (file: RcFile) => void;
}

const PasteUpload = (props: PasteUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePaste = useCallback((event: ClipboardEvent) => {
    // (event: React.ClipboardEvent<HTMLDivElement>) => {
    // const items = (event.clipboardData || event.originalEvent.clipboardData)
    //   .items;
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }
    for (const item of items) {
      // 只处理图片类型
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile() as RcFile;
        // 这里可以创建一个上传任务或直接使用 Upload 组件的方法来上传文件
        // 比如使用 fileList state 来更新并触发上传逻辑
        console.log("Pasted file:", file);
        // Create a unique identifier for the file
        file.uid = `paste-${Date.now()}`;
        // Use the fileList state to update and trigger upload logic
        // setFileList((prevFileList) => [...prevFileList, file as UploadFile]);
        setFileList(() => [file])
        props.onUploadSuccess && props.onUploadSuccess(file as RcFile);
        message.success("Image file pasted!");
      }
    }
  }, []);

  const beforeUpload: UploadProps["beforeUpload"] = useCallback(
    (file: RcFile, fileList: RcFile[]) => {
      // 这里可以添加你需要上传前的处理逻辑，例如检查文件类型、大小等
      console.log("Before upload file:", file, fileList);
      return false; // 阻止自动上传
    },
    []
  );

  const handleRemove: UploadProps["onRemove"] = useCallback(
    (file: UploadFile) => {
      console.log("Remove file:", file);
      setFileList((prevFileList) =>
        prevFileList.filter((item) => item.uid !== file.uid)
      );
      props?.onRemove && props.onRemove(file);
    },
    []
  );

  const handleChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      console.log("Change file:", info.file);
      // let newFileList = [...info.fileList];
      // // 只保留最后一个文件
      // // newFileList = newFileList.slice(-1);
      // newFileList = newFileList.map((file) => {
      //   if (file.response) {
      //     // 上传成功后，将返回文件路径
      //     file.url = file.response.url;
      //   }
      //   if (file.originFileObj) {
      //     return file.originFileObj
      //   }
      //   return file;
      // });
      // console.log(newFileList, 'handleChange =====> ')
      // setFileList(newFileList);
      setFileList([info.file])
      props.onUploadSuccess && props.onUploadSuccess(info.file as RcFile);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return (
    <Dragger
      maxCount={1}
      multiple={false}
      showUploadList={false}
      fileList={fileList}
      beforeUpload={beforeUpload}
      onRemove={handleRemove}
      onChange={handleChange}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">支持单个或批量上传</p>
    </Dragger>
  );
};

export default PasteUpload;
