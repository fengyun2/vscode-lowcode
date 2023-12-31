// chat.js

// 访问模型服务
const axios = require("axios");

require("dotenv").config({ path: `.env.local`, override: true });

const APIKey = process.env.VITE_LOWCODE_API_KEY;
const SecretKey = process.env.VITE_LOWCODE_SECRET_KEY;

// TODO: 注意 这里的APIKey和SecretKey是从环境变量中获取的，需要在.env中配置(无法从.env.local获取)

const ACCESS_TOKEN_API = "https://aip.baidubce.com/oauth/2.0/token";
const ERNIEB4 =
  "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro";

class Conversation {
  constructor() {
    // 上下文数据存在这里，文心的调用是需要把所有的历史对话数据全部传过去，所以上下文窗口大小得注意
    this.messages = [];
    this.accessToken = ''; // 缓存access_token
  }

  async getAccessToken() {
    try {
      // grant_type=client_credentials&client_id=${APIKey}client_secret=${SecretKey}
      const params = {
        grant_type: "client_credentials",
        client_id: APIKey,
        client_secret: SecretKey,
      };
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      console.log(params, ' getAccessToken params ===>');
      const res = await axios.post(
        ACCESS_TOKEN_API,
        {},
        {
          params,
          headers,
        }
      );
      const { data } = res;
      // console.log('getAccessToken =====>', res);
      return data.access_token;
    } catch (error) {
      console.log("获取token失败" + error);
      return "";
    }
  }

  async ask(prompt) {
    // 问句push进去
    this.messages.push({ role: "user", content: prompt });
    // console.log("message" + this.messages[0]);
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (!this.accessToken) {
        const accessToken = await this.getAccessToken();
        this.accessToken = accessToken;
      }
      const res = await axios.post(
        ERNIEB4,
        { messages: this.messages },
        { params: { access_token: this.accessToken }, headers }
      );
      const { data } = res;
      // console.log(data);
      // 答案也放进去
      this.messages.push({ role: "assistant", content: data.result });
      return data.result;
    } catch (error) {
      console.log("调用模型失败" + error);
    }
  }
}
// 导出函数
module.exports = Conversation;
