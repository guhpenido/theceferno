// api.js
const apiKey = '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'; // Substitua com sua chave de API da OpenAI

async function verificarAdequacaoDoPost(textoDoPost) {
  const apiUrl = 'https://api.openai.com/v1/completions';

  const prompt = `É este post adequado? Permita palavrões, mas não muitos.\n"${textoDoPost}"\nResponda somente com "true" ou "false":`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        prompt,
        max_tokens: 100,
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
      console.log(respostaDoChatGPT);
      throw new Error('Resposta inesperada do ChatGPT', respostaDoChatGPT); 
    }
  } catch (error) {
    console.error('Erro ao verificar a adequação do post:', error.message);
    return false;
  }
}

export default verificarAdequacaoDoPost;
