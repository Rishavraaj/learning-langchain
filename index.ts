// import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// const systemTemplate = "Translate the following from English into {language}";

// const model = new ChatOpenAI({ model: "gpt-4" });

// const messages = [
//   new SystemMessage("Translate the following from English into Italian"),
//   new HumanMessage("hi!"),
// ];

// // const response = await model.invoke("Hello");

// // const response = await model.invoke([{ role: "user", content: "Hello" }]);

// // const response = await model.invoke([new HumanMessage("hi!")]);

// // stream

// // const stream = await model.stream(messages);

// // const chunks = [];

// // for await (const chunk of stream) {
// //   chunks.push(chunk);
// //   console.log(`${chunk.content}|`);
// // }

// const promptTemplate = ChatPromptTemplate.fromMessages([
//   ["system", systemTemplate],
//   ["user", "{text}"],
// ]);

// const promptValue = await promptTemplate.invoke({
//   language: "italian",
//   text: "hi!",
// });

// const response = await model.invoke(promptValue);

// console.log(response);

// structured  dynamic tool calling

// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { ChatOpenAI } from "@langchain/openai";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { AgentExecutor, createReactAgent, createToolCallingAgent } from "langchain/agents";

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful assistant"],
//   ["placeholder", "{chat_history}"],
//   ["human", "{input}"],
//   ["placeholder", "{agent_scratchpad}"],
// ]);

// const llm = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
// });

// const magicTool = tool(
//   async ({ input }: { input: number }) => {
//     return `${input + 2}`;
//   },
//   {
//     name: "magic_function",
//     description: "Applies a magic function to an input.",
//     schema: z.object({
//       input: z.number(),
//     }),
//   }
// );

// const tools = [magicTool];

// const query = "what is the value of magic_function(3)?";

// const app = createReactAgent({
//   llm,
//   tools,
// });

// const agentExecutor = new AgentExecutor({
//   agent,
//   tools,
// });

// const result = await agentExecutor.invoke({ input: query });

// console.log(result);
