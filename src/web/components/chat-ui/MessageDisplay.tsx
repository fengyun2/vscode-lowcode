import { List, Avatar } from "antd";
import {UserOutlined, RobotOutlined} from '@ant-design/icons'

export interface Message {
  type: string, // question | answer
  role: string, // 'user' | 'assistant'
  author: string;
  content: string;
}

export interface MessageDisplayProps {
  messages: Message[];
}

const MessageDisplay = ({ messages }: MessageDisplayProps) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(message) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar icon={ message.type === 'question'? <UserOutlined/>: <RobotOutlined />} />}
            title={message.author}
            description={message.content}
          />
        </List.Item>
      )}
    />
  );
};

export default MessageDisplay;
