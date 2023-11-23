// api.js
const apiKey = "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"; // Substitua com sua chave de API da OpenAI

async function verificarAdequacaoDoPost(textoDoPost) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const prompt = `Este post é ofensivo?\n"${textoDoPost}"\nResponda somente com "true", se sim ou "false", se não. Sem pontos:`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100, // Ajuste conforme necessário
        temperature: 0.7,
        model: "gpt-3.5-turbo",
        stop: ["\n"],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao chamar a API do ChatGPT. Status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Prompt enviado:", prompt.length);
    console.log("Resposta da API:", data);
    const respostaDoChatGPT = data.choices[0]?.message?.content?.trim().toLowerCase();

    if (respostaDoChatGPT === "false") {
      return true;
    } else if (respostaDoChatGPT === "true") {
      return false;
    } else {
      console.log(respostaDoChatGPT);
      throw new Error("Resposta inesperada do ChatGPT");
    }
  } catch (error) {
    console.error("Erro ao verificar a adequação do post:", error.message);
    return false;
  }
}

export default verificarAdequacaoDoPost;
