import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (!req.body.prompt) return res.status(400).json({message: 'Pass in prompt field for image generation'});
    const openai = new OpenAIApi(configuration);
    const response = await openai.createImage({
        prompt: req.body.prompt,
        n: 1,
        size: "512x512",
    });

    if (!response.data) throw new Error('Unable to get image');
    console.log('received url ' + response.data.data[0].url);

    res.status(200).json({ imageURL: response.data.data[0].url })
}