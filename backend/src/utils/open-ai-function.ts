import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Faz uma pergunta ao ChatGPT e retorna a resposta em português (Brasil),
 * mas só responde se a pergunta estiver permitida no dicionário.
 * @param question Pergunta do usuário (em português ou qualquer idioma)
 * @param allowedQuestions Dicionário de perguntas permitidas: chave = pergunta (normalizada), valor = pergunta canônica para enviar ao ChatGPT
 * @returns Resposta do ChatGPT em português (Brasil) ou mensagem de bloqueio
 */
export async function askChatGPTInPortuguese(
  question: string,
  allowedQuestions: Record<string, string>
): Promise<string> {
  // Normaliza a pergunta do usuário para comparação (case-insensitive, trim)
  const normalized = question.trim().toLowerCase();
  const allowedKeys = Object.keys(allowedQuestions);
  const matchedKey = allowedKeys.find(
    key => key.trim().toLowerCase() === normalized
  );

  if (!matchedKey) {
    return "Desculpe, sua pergunta não está permitida no momento. Por favor, tente outra pergunta ou entre em contato com o suporte.";
  }

  const canonicalQuestion = allowedQuestions[matchedKey];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um assistente útil que responde sempre em português do Brasil (pt-BR). Seja claro, objetivo e educado."
        },
        {
          role: "user",
          content: canonicalQuestion
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });
    return response.choices[0]?.message?.content?.trim() || "Não foi possível obter uma resposta.";
  } catch (error: any) {
    console.error("Erro ao consultar o ChatGPT:", error);
    return "Desculpe, ocorreu um erro ao tentar responder sua pergunta.";
  }
}