import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const systemTemplate = "Translate the following from English into {language}";

const model = new ChatOpenAI({ model: "gpt-4" });

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

// const response = await model.invoke("Hello");

// const response = await model.invoke([{ role: "user", content: "Hello" }]);

// const response = await model.invoke([new HumanMessage("hi!")]);

// stream

// const stream = await model.stream(messages);

// const chunks = [];

// for await (const chunk of stream) {
//   chunks.push(chunk);
//   console.log(`${chunk.content}|`);
// }

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  language: "italian",
  text: "hi!",
});

const response = await model.invoke(promptValue);

console.log(response);
