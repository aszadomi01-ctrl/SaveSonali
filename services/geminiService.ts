import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCropHealth = async (imageBase64: string, language: 'en' | 'bn'): Promise<string> => {
  try {
    const prompt = language === 'en' 
      ? "Analyze this crop image. Identify the crop, detect any visible diseases or quality issues (moisture, mold, pests). Provide a brief 2-sentence assessment and 1 recommendation for storage."
      : "এই ফসলের ছবিটি বিশ্লেষণ করুন। এটি কী ফসল তা চিহ্নিত করুন এবং কোন রোগ বা মানগত সমস্যা (আর্দ্রতা, ছত্রাক, পোকা) আছে কিনা তা দেখুন। ২ বাক্যে একটি সংক্ষিপ্ত মূল্যায়ন এবং ১টি সংরক্ষণের পরামর্শ দিন (বাংলায়)।";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for speed/vision
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "Unable to analyze image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return language === 'en' ? "AI Analysis failed. Please try again." : "এআই বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
  }
};

export const getStorageAdvice = async (crop: string, method: string, language: 'en' | 'bn'): Promise<string> => {
  try {
    const prompt = language === 'en'
      ? `I have harvested ${crop} and stored it in ${method}. Given the typical humid climate of Bangladesh, give me 3 short bullet points on how to prevent food loss for this specific batch.`
      : `আমি ${crop} সংগ্রহ করেছি এবং এটি ${method}-এ রেখেছি। বাংলাদেশের আর্দ্র আবহাওয়া বিবেচনা করে, এই ব্যাচের খাদ্য অপচয় রোধে ৩টি সংক্ষিপ্ত পয়েন্টে পরামর্শ দিন (বাংলায়)।`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No advice available.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Advice system temporarily unavailable.";
  }
};