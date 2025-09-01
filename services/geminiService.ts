import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this context, throwing an error is fine.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const reviewCode = async (code: string, language: string): Promise<string> => {
  const prompt = `
    As an expert senior software engineer, please perform a thorough code review of the following ${language} code.
    Provide feedback on the following aspects:
    1.  **Bugs and Errors**: Identify potential bugs, logic errors, and edge cases that might have been missed.
    2.  **Performance**: Suggest optimizations for performance bottlenecks.
    3.  **Clarity and Readability**: Comment on code style, naming conventions, and overall readability. Suggest improvements to make the code more maintainable.
    4.  **Best Practices**: Check if the code follows established best practices and design patterns for ${language}.
    5.  **Security**: Point out any potential security vulnerabilities.

    Provide your feedback in Markdown format. Use headings, lists, and code blocks for clarity. Start with a brief summary of your findings.

    Here is the code to review:
    \`\`\`${language}
    ${code}
    \`\`\`
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error reviewing code with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred during the code review: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the code review.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred during image generation: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  const prompt = `
    Please summarize the following text concisely. Capture the main points and key information.
    The summary should be easy to read and understand.

    Text to summarize:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`An error occurred during text summarization: ${error.message}`);
    }
    throw new Error("An unknown error occurred during text summarization.");
  }
};
