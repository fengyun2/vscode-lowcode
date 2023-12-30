import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { message, Spin, Input, UploadFile } from "antd";
import type { RcFile } from "antd/lib/upload/interface";

import PasteUpload, { PasteUploadProps } from "./PasteUpload";

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

    // 识别简体中文+繁体中文+英文，但是目前识别简体中文很多识别不准
    const worker = await createWorker("eng+chi_sim+chi_tra", 1, {
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
