import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { message, Spin, Input, UploadFile, Image } from "antd";
import type { RcFile } from "antd/lib/upload/interface";

import PasteUpload, { PasteUploadProps } from "./PasteUpload";

// TODO: [基于tesseract.js的vue应用离线版](https://juejin.cn/post/6953532703547490318)

// 读取文件并转换为 base64 编码的字符串
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
interface IOcrUploaderProps {
  // 如果需要，这里可以定义组件的属性
}

const OcrUploader: React.FC<IOcrUploaderProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<string>();

  const handleUploadSuccess: PasteUploadProps["onUploadSuccess"] = async (
    file: RcFile
  ) => {
    setLoading(true);
    setText("");
    readFileAsBase64(file)
      .then((base64Url) => {
        setImg(base64Url);
      })
      .catch((error: Error) => {
        console.error(error, " 图片在线预览失败");
      });

    // 1. 识别简体中文+繁体中文+英文("eng+chi_sim+chi_tra")，但是目前识别简体中文很多识别不准
    // 2. 设置离线加载本地语言包及tesseract库
    const worker = await createWorker("eng+chi_sim", 1, {
      workerPath: "/tesseract/tesseract.js/worker.min.js",
      langPath: "/tesseract/tesseract.js/lang-data",
      corePath: "/tesseract/tesseract.js-core",
      logger: (m) => console.log(m),
    });

    worker
      .recognize(file)
      .then(({ data: { text } }) => {
        setText(text);
      })
      .catch((error: Error) => {
        console.error(error);
        message.error(
          "OCR failed to recognize the text. Please try another image."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onRemove = (file: UploadFile) => {
    console.log(file);
    setText("");
    setImg("");
  };

  return (
    <div>
      <Spin spinning={loading}>
        <PasteUpload
          onUploadSuccess={handleUploadSuccess}
          onRemove={onRemove}
        />
        {!!img && <Image style={{maxWidth: '100%'}} src={img} />}
        <Input.TextArea
          rows={10}
          value={text}
          placeholder="Recognized text will be displayed here..."
          readOnly
        />
      </Spin>
    </div>
  );
};

export default OcrUploader;
