import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { message, Spin, Input, UploadFile } from 'antd';
import type { RcFile } from 'antd/lib/upload/interface';

import PasteUpload, {PasteUploadProps} from './PasteUpload'


interface IOcrUploaderProps {
  // 如果需要，这里可以定义组件的属性
}

const OcrUploader: React.FC<IOcrUploaderProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const handleUploadSuccess: PasteUploadProps['onUploadSuccess'] = (file: RcFile) => {
    setLoading(true);

    Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error(error);
        setLoading(false);
        message.error('OCR failed to recognize the text. Please try another image.');
      });
  };

  const onRemove = (file: UploadFile) => {
    console.log(file);
    setText('')
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