import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ImageGenOptions {
  maxWords?: number;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
}

const defaultOptions: ImageGenOptions = {
  maxWords: 5,
  size: "1024x1024",
  quality: "standard",
  style: "vivid"
};

function extractSubject(prompt: string): string {
  const regex = /(?:generate|create|make|show)(?:\s+(?:a|an))?\s+(?:meme|image|picture)\s+(?:of\s+)?(.+)/i;
  const match = prompt.match(regex);
  return match ? match[1].trim() : prompt;
}

function isAgentSmithRequest(subject: string): boolean {
  const smithTerms = ['yourself', 'agent', 'agent smith', 'smith', 'you'];
  return smithTerms.some(term => subject.toLowerCase().includes(term));
}

async function uploadToImgur(imageUrl: string): Promise<string> {
  try {
    // First, fetch the image data
    const imageResponse = await fetch(imageUrl);
    const blob = await imageResponse.blob();
    
    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); // Remove data URL prefix
      };
    });
    reader.readAsDataURL(blob);
    const base64Image = await base64Promise;

    // Upload to Imgur
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        type: 'base64',
      }),
    });

    const data = await response.json();
    return data.data.link;
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return imageUrl; // Fallback to original URL if upload fails
  }
}

export async function generateImage(prompt: string, options: ImageGenOptions = {}): Promise<string | null> {
  const { maxWords, size, quality, style } = { ...defaultOptions, ...options };
  const subject = extractSubject(prompt);
  
  try {
    let imagePrompt = '';
    
    if (isAgentSmithRequest(subject)) {
      imagePrompt = `Create a professional, minimalist image representing $SMITH cryptocurrency. Include a silhouette of a man in a business suit with sunglasses standing in front of a digital matrix background with cascading green code. The figure should be elegant and mysterious, viewed from a slight angle or profile to maintain policy compliance. Add subtle crypto and blockchain elements like network nodes or digital connections. Style: cyberpunk meets corporate, dark background with green matrix effects. Maximum ${maxWords} words of text allowed.`;
    } else {
      imagePrompt = `Create a minimalist, matrix-themed image of ${subject}. The image should be stylized with green matrix code effects and cyber aesthetic. Maximum ${maxWords} words of text allowed.`;
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size,
      quality,
      style
    });
    
    const imageUrl = response.data[0].url;
    return await uploadToImgur(imageUrl);
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

export async function generateMemeCaption(instructions: string, tweets: string, prompt: string): Promise<string | null> {
  const subject = extractSubject(prompt);
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `${instructions}\n\nTweets for reference:\n${tweets}\n\nGenerate a short, matrix-themed caption (max 5 words) that's both funny and relevant to ${subject}.`
        }
      ],
      temperature: 0.9,
      max_tokens: 50
    });
    
    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('Error generating meme caption:', error);
    return null;
  }
}

export async function generateTwitterCaption(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate a short, bullish caption about $SMITH that relates to the given meme prompt. Keep it under 100 characters, make it engaging and matrix-themed."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 60
    });
    
    return response.choices[0]?.message?.content?.trim() || "The Matrix evolves. $SMITH is inevitable. 🕶️";
  } catch (error) {
    console.error('Error generating Twitter caption:', error);
    return "The Matrix evolves. $SMITH is inevitable. 🕶️";
  }
}

export async function handleShareToTwitter(imageUrl: string, originalPrompt: string): Promise<void> {
  const caption = await generateTwitterCaption(originalPrompt);
  const tweetText = `${caption}\n\nJoin the inevitable: @RuneAgentSmith #SmithAI #Matrix $SMITH`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(imageUrl)}`;
  window.open(shareUrl, '_blank');
}

export default {
  generateImage,
  generateMemeCaption,
  handleShareToTwitter
};