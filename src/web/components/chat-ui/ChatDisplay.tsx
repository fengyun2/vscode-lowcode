import { useState } from "react";
import { Layout } from "antd";
import axios from "axios";
import ChatInput from "./ChatInput";
import MessageDisplay, { Message } from "./MessageDisplay";

const { Header, Content, Footer } = Layout;

function getAnswer(question: string) {
  const chatURL = 'http://localhost:3000/chat'
  const payload = {
    messages: question
  }
  return axios.post(chatURL, payload, {
    headers: {
      "content-Type": "application/json;charset=UTF-8",
    }
  })
   .then((res) => {
      return res.data.message
    })
   .catch((err) => {
      console.error('调用模型失败: ', err)
    })
}


const ChatDisplay = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (msg: string) => {
    const question = msg.trim()
    if (!question) {
      return;
    }
    // 将消息放进消息队列里
    const newMessage = { type: 'question', role: 'user', author: "win", content: question };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    getAnswer(question).then((res: string) => {
      // 将答案也放进到消息队列里
      const newMessage = { type: 'answer', role: 'assistant', author: "gpt", content: res };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // TODO: 清空输入框
    }).catch((err: Error) => {
      console.error('调用模型失败: ', err)
    })
    // ask(msg).then((res: string) => {
    //   // 将答案也放进到消息队列里
    //   const newMessage = { role: 'assistant', author: "gpt", content: res };
    //   setMessages((prevMessages) => [...prevMessages, newMessage]);
    // }).catch((err: Error) => {
    //   console.error('调用模型失败: ', err)
    // })
  };

  return (
    <Layout>
      <Header>ChatGPT Plus</Header>
      <Content>
        <MessageDisplay messages={messages} />
      </Content>
      <Footer>
        <ChatInput onSendMessage={handleSendMessage} />
      </Footer>
    </Layout>
  );
};

export default ChatDisplay;
