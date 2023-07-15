import { OpenAIStreamRanked, OpenAIStreamPayloadRanked } from "../../utils/OpenAIStreamRanked";


if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { answer_prompt } = (await req.json()) as {
    answer_prompt?: string;
  };

  if (!answer_prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayloadRanked = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: answer_prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStreamRanked(payload);
  // return stream response (SSE)
  return new Response(
    stream, {
      headers: new Headers({
        'Cache-Control': 'no-cache',
      })
    }
  );
};

export default handler;
