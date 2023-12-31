import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { message, Spin, Input, UploadFile } from "antd";
import type { RcFile } from "antd/lib/upload/interface";

import PasteUpload, { PasteUploadProps } from "./PasteUpload";

// TODO: [基于tesseract.js的vue应用离线版](https://juejin.cn/post/6953532703547490318)
interface IOcrUploaderProps {
  // 如果需要，这里可以定义组件的属性
}

const OcrUploader: React.FC<IOcrUploaderProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const handleUploadSuccess: PasteUploadProps["onUploadSuccess"] = async (
    file: RcFile
  ) => {
    setLoading(true);
    setText("");

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
  };

  return (
    <div>
      <PasteUpload onUploadSuccess={handleUploadSuccess} onRemove={onRemove} />
      {loading && <Spin />}
      <Input.TextArea
        rows={10}
        value={text}
        placeholder="Recognized text will be displayed here..."
        readOnly
      />
    </div>
  );
};

export default OcrUploader;
