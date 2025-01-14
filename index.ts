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

//learning langgraph

// import { Annotation, StateGraph } from "@langchain/langgraph";
// import * as fs from "fs/promises";

// const state = Annotation.Root({
//   message: Annotation<string>(),
//   pastMessages: Annotation<string[]>({
//     default: () => [],
//     reducer: (currentValue, updatedValue) => currentValue.concat(updatedValue),
//   }),
// });

// const workflow = new StateGraph(state)
//   .addNode("node-1", (state) => {
//     return {
//       message: "Hello from node-1",
//       pastMessages: [],
//     };
//   })
//   .addNode("node-2", (state) => {
//     return {
//       message: "Hello from node-2",
//       pastMessages: [state.message],
//     };
//   })
//   .addNode("node-3", (state) => {
//     return {
//       message: "Hello from node-3",
//       pastMessages: [state.message],
//     };
//   })
//   .addEdge("__start__", "node-1")
//   .addConditionalEdges("node-1", (state) => {
//     return state.pastMessages.length !== 1 ? "node-2" : "node-3";
//   })
//   .addEdge("node-3", "node-2")
//   .addEdge("node-2", "__end__");

// const graph = workflow.compile();

// fs.writeFile("my-graph.png", await graph.getGraph().drawMermaid());

// const res = await graph.invoke({});

// console.log(res);

import { DallEAPIWrapper } from "@langchain/openai";

const tool = new DallEAPIWrapper({
  n: 1, // Default
  model: "dall-e-3", // Default
  apiKey: process.env.OPENAI_API_KEY, // Default
});

const imageURL = await tool.invoke("a painting of a cat");

console.log(imageURL);
