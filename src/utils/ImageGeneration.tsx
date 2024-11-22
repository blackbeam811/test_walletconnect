import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ImageGenOptions {
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
}

const defaultOptions: ImageGenOptions = {
  size: "1024x1024",
  quality: "standard",
  style: "vivid"
};

function extractImagePrompt(text: string): string {
  const keywords = ['meme', 'picture', 'image'];
  const commands = ['generate', 'create', 'make', 'show'];
  
  for (const keyword of keywords) {
    for (const command of commands) {
      const patterns = [
        new RegExp(`${command}\\s+(?:a|an)?\\s+${keyword}\\s+of\\s+(.+)`, 'i'),
        new RegExp(`${command}\\s+(?:a|an)?\\s+${keyword}\\s+(.+)`, 'i'),
        new RegExp(`${command}\\s+${keyword}\\s+(.+)`, 'i')
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
      }
    }
  }
  
  return text;
}

function isAgentSmithRequest(prompt: string): boolean {
  const smithTerms = ['yourself', 'agent', 'agent smith', 'smith', 'you'];
  return smithTerms.some(term => prompt.toLowerCase().includes(term));
}

function generateMatrixPrompt(basePrompt: string): string {
  if (isAgentSmithRequest(basePrompt)) {
    return `Create a professional, minimalist image representing $SMITH cryptocurrency. Include a silhouette of a man in a business suit with sunglasses standing in front of a digital matrix background with cascading green code. The figure should be elegant and mysterious, viewed from a slight angle or profile. Add subtle crypto and blockchain elements like network nodes or digital connections. Style: cyberpunk meets corporate, dark background with green matrix effects.`;
  }

  return `Create a minimalist, matrix-themed digital art piece featuring ${basePrompt}. The image should incorporate:
- A dark, cyber-aesthetic background
- Green matrix code rain effects
- Neon highlights and digital glitch elements
- Geometric patterns and network connections
- A modern, cyberpunk style that matches the Matrix universe
The overall composition should be clean and professional, suitable for a high-end crypto project.`;
}

export async function generateImage(prompt: string, options: ImageGenOptions = {}): Promise<string | null> {
  try {
    console.log('Processing image request:', prompt);
    
    const extractedPrompt = extractImagePrompt(prompt);
    console.log('Extracted base prompt:', extractedPrompt);
    
    const finalPrompt = generateMatrixPrompt(extractedPrompt);
    console.log('Final DALL-E prompt:', finalPrompt);

    const { size, quality, style } = { ...defaultOptions, ...options };

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt,
      n: 1,
      size,
      quality,
      style
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL in response');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('Error in image generation:', error);
    return null;
  }
}