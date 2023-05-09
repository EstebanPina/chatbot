'use client';
import { Configuration, OpenAIApi } from "openai"
import { useState } from "react";
import { RingLoader } from "react-spinners";
export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const params={
    temperature:0.2,
    max_tokens:256,
    
  }
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


  const handleInput = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    let mynew_messages=[...messages, { user: "me", text: e.target.message.value }];
    await setMessages(mynew_messages);
    setInput("");
    console.log(messages)
    sentMessage(e,mynew_messages)
  }

  const sentMessage = async(e,myMessages) => {
    const endpoint="https://api.openai.com/v1/engines/text-davinci-003/completions";
    const body={...params,prompt:e.target.message.value}

    try {
      const completion = await openai.createCompletion({
        model: "text-ada-001",
        prompt: body.prompt,
      });
      setIsLoading(false)
      let newmessages=[...myMessages, { user: "openai", text: completion.data.choices[0].text }];
      console.log(messages)
      await setMessages(newmessages);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="flex flex-col w-96 h-[740px] justify-start items-center bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold bg-indigo-500 text-white w-full text-center p-4">
          Chatbot
        </h1>
        <div className="flex flex-col gap-2  w-full h-full p-4 overflow-y-scroll">
          {messages.map((message, index) => {
            if (message.user === "me") {
              return (
                <div key={index} className="flex flex-row w-full justify-end">
                  <div className="flex flex-row rounded-lg bg-indigo-500 shadow-md text-white w-1/2 p-2">{message.text}</div>
                </div>
              )
            } else {
              return (
                <div key={index} className="flex flex-row w-full justify-start">
                  <div className="flex flex-row rounded-lg bg-white border border-gray-400/20 shadow-md text-slate-950 w-1/2 p-2">{message.text}</div>
                </div>
              )
            }
          }
          )}
          <RingLoader
  color="#9600ff"
  loading={isLoading}
  size={50}
/>
        </div>
        <form className="flex flex-row w-full bottom-0 relative" onSubmit={(e) => { handleInput(e) }}>
          <input className="w-full h-12 rounded-lg p-2 outline-none" type="text" name="message" disabled={isLoading} placeholder="Type your message" value={input} onChange={(e) => { setInput(e.target.value) }} />
          <button className="w-12 h-12 rounded-lg bg-indigo-500 text-white p-2" type="submit" disabled={isLoading}>Send</button>
        </form>
      </div>
    </div>
  )
}
