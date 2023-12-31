import { useState } from "react";
import { Input, Button } from "antd";

const { TextArea } = Input;

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = (props: ChatInputProps) => {
  const [message, setMessage] = useState<string>("");

  const send = () => {
    props.onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="chat-input" style={{ display: "flex" }}>
      <TextArea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onPressEnter={send}
        placeholder="Type your message here..."
      />
      <Button type="primary" onClick={send} style={{ marginLeft: "10px" }}>
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
