import { OpenAIStreamRanked, OpenAIStreamPayloadRanked } from "../../utils/OpenAIStreamRanked";


if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { answerPrompt } = (await req.json()) as {
    answerPrompt?: string;
  };

  if (!answerPrompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayloadRanked = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: answerPrompt }],
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