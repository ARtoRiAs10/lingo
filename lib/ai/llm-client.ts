import { HfInference } from "@huggingface/inference";

export interface LLMResponse {
  success: boolean;
  content: string;
  error?: string;
}

export class LLMClient {
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async generateText(
    prompt: string,
    model = "microsoft/DialoGPT-medium",  // ✅ DeepSeek model on HF
    maxTokens = 512
  ): Promise<LLMResponse> {
    try {
      const response = await this.hf.textGeneration({
        model,
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      });

      return {
        success: true,
        content: response.generated_text.trim(),
      };
    } catch (error) {
      console.error("LLM Generation Error:", error);
      return {
        success: false,
        content: "",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async generateCourse(topic: string, language: string, difficulty: string) {
    const prompt = `Create a language learning course for ${language} on the topic "${topic}" at ${difficulty} level.
    
Format the response as JSON with the following structure:
{
  "title": "Course title",
  "description": "Course description",
  "units": [
    {
      "title": "Unit title",
      "description": "Unit description",
      "lessons": [
        {
          "title": "Lesson title",
          "challenges": [
            {
              "question": "Question text",
              "type": "SELECT",
              "options": [
                {"text": "Option 1", "correct": true},
                {"text": "Option 2", "correct": false}
              ]
            }
          ]
        }
      ]
    }
  ]
}

Make it educational and progressive. Include 2 units with 3 lessons each.`;

    return await this.generateText(prompt, "deepseek-ai/deepseek-llm-7b-chat", 1024);
  }
}

export const llmClient = new LLMClient();
