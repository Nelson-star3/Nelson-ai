exports.handler = async (event) => {
  const KEYS = {
    openrouter:  process.env.OPENROUTER_KEY,
    gemini:      process.env.GEMINI_KEY,
    huggingface: process.env.HUGGINGFACE_KEY,
    openai:      process.env.OPENAI_KEY,
    elevenlabs:  process.env.ELEVENLABS_KEY,
    groq:        process.env.GROQ_KEY
  };

  const { provider } = JSON.parse(event.body);
  const key = KEYS[provider];

  if (!key) {
    return { statusCode: 400, body: JSON.stringify({ error: "Unknown provider" }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ key })
  };
};
