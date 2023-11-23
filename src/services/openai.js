// api.js
const apiKey = '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'; // Substitua com sua chave de API da OpenAI

async function verificarAdequacaoDoPost(textoDoPost) {
  const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

  const prompt = `É este post adequado?\n"${textoDoPost}"\nResponda com "true" ou "false":`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 1,
        stop: ['\n'],
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar a API do ChatGPT');
    }

    const data = await response.json();
    const respostaDoChatGPT = data.choices[0].text.trim().toLowerCase();

    if (respostaDoChatGPT === 'true') {
      return true;
    } else if (respostaDoChatGPT === 'false') {
      return false;
    } else {
      throw new Error('Resposta inesperada do ChatGPT');
    }
  } catch (error) {
    console.error('Erro ao verificar a adequação do post:', error.message);
    return false;
  }
}

export default verificarAdequacaoDoPost;
