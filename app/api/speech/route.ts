const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return Response.json({ error: 'Speech is not configured.' }, { status: 503 });

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (typeof text !== 'string' || !text.trim() || text.length > 120) {
    return Response.json({ error: 'Text must be between 1 and 120 characters.' }, { status: 400 });
  }

  const voiceId = process.env.ELEVENLABS_AMELIA_VOICE_ID || 'ZF6FPAbjXT4488VcRRnw';
  const upstream = await fetch(`${ELEVENLABS_API}/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text: text.trim(), model_id: 'eleven_multilingual_v2' }),
  });

  if (!upstream.ok) {
    const providerError = await upstream.text();
    console.error('ElevenLabs TTS error', upstream.status, providerError.slice(0, 1200));
    let providerMessage = 'Check your API key, voice access, and account usage.';
    try {
      const details = JSON.parse(providerError);
      providerMessage = details.detail?.message || details.detail?.status || details.message || providerMessage;
    } catch {}
    return Response.json({ error: 'ElevenLabs could not generate speech.', providerStatus: upstream.status, providerMessage }, { status: 502 });
  }
  return new Response(upstream.body, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, no-store' },
  });
}
