import { NextApiRequest, NextApiResponse } from 'next';
import { SpeechToTextV1 } from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSON_API_KEY || '',
  }),
  serviceUrl: process.env.IBM_WATSON_URL || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { audio } = req.body; // Expecting base64 audio data

    if (!audio) return res.status(400).json({ error: 'Audio data is required' });

    const response = await speechToText.recognize({
      audio: Buffer.from(audio, 'base64'),
      contentType: 'audio/webm', // Ensure the format matches what you're sending
      model: 'en-US_BroadbandModel',
    });

    const transcript = response.result.results.map(r => r.alternatives[0].transcript).join(' ');
    res.status(200).json({ transcript });

  } catch (error) {
    console.error('IBM Speech-to-Text Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
