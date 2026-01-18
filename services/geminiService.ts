
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RepoFileTree, Citation, Task } from '../types';

// Helper to ensure we always get the freshest key from the environment
// immediately before a call.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface InfographicResult {
    imageData: string | null;
    citations: Citation[];
}

/**
 * Generates an infographic representation of a repository structure.
 * 
 * @param repoName - Name of the repository (e.g., "owner/repo").
 * @param fileTree - Array of file paths representing the repo structure.
 * @param style - Visual style guideline to apply (e.g., "Neon Cyberpunk").
 * @param is3D - Whether to generate a 3D isometric/tabletop view.
 * @param language - Target language for text labels.
 * @returns Promise resolving to base64 image data string or null.
 */
export async function generateInfographic(
  repoName: string, 
  fileTree: RepoFileTree[], 
  style: string, 
  is3D: boolean = false,
  language: string = "English"
): Promise<string | null> {
  const ai = getAiClient();
  // Summarize architecture for the image prompt
  const limitedTree = fileTree.slice(0, 150).map(f => f.path).join(', ');
  
  let styleGuidelines = "";
  let dimensionPrompt = "";

  if (is3D) {
      // OVERRIDE standard styles for a specific "Tabletop Model" look
      styleGuidelines = `VISUAL STYLE: Photorealistic Miniature Diorama. The data flow should look like a complex, glowing 3D printed physical model sitting on a dark, reflective executive desk.`;
      dimensionPrompt = `PERSPECTIVE & RENDER: Isometric view with TILT-SHIFT depth of field (blurry foreground/background) to make it look like a small, tangible object on a table. Cinematic volumetric lighting. Highly detailed, 'octane render' style.`;
  } else {
      // Standard 2D styles or Custom
      switch (style) {
          case "Hand-Drawn Blueprint":
              styleGuidelines = `VISUAL STYLE: Technical architectural blueprint. Dark blue background with white/light blue hand-drawn lines. Looks like a sketch on drafting paper.`;
              break;
          case "Corporate Minimal":
              styleGuidelines = `VISUAL STYLE: Clean, corporate, minimalist. White background, lots of whitespace. Use a limited, professional color palette (greys, navy blues).`;
              break;
          case "Neon Cyberpunk":
              styleGuidelines = `VISUAL STYLE: Dark mode cyberpunk. Black background with glowing neon pink, cyan, and violet lines and nodes. High contrast, futuristic look.`;
              break;
          case "Modern Data Flow":
              styleGuidelines = `VISUAL STYLE: Replicate "Androidify Data Flow" aesthetic. Light blue (#eef8fe) solid background. Colorful, flat vector icons. Smooth, bright blue curved arrows.`;
              break;
          default:
              // Handle custom style string
              if (style && style !== "Custom") {
                  styleGuidelines = `VISUAL STYLE: ${style}.`;
              } else {
                  styleGuidelines = `VISUAL STYLE: Replicate "Androidify Data Flow" aesthetic. Light blue (#eef8fe) solid background. Colorful, flat vector icons. Smooth, bright blue curved arrows.`;
              }
              break;
      }
      dimensionPrompt = "Perspective: Clean 2D flat diagrammatic view straight-on. No 3D effects.";
  }

  const baseStylePrompt = `
  STRICT VISUAL STYLE GUIDELINES:
  ${styleGuidelines}
  - LAYOUT: Distinct Left-to-Right flow.
  - CENTRAL CONTAINER: Group core logic inside a clearly defined central area.
  - ICONS: Use relevant technical icons (databases, servers, code files, users).
  - TYPOGRAPHY: Highly readable technical font. Text MUST be in ${language}.
  `;

  const prompt = `Create a highly detailed technical logical data flow diagram infographic for GitHub repository : "${repoName}".
  
  ${baseStylePrompt}
  ${dimensionPrompt}
  
  Repository Context: ${limitedTree}...
  
  Diagram Content Requirements:
  1. Title exactly: "${repoName} Data Flow" (Translated to ${language} if not English)
  2. Visually map the likely data flow based on the provided file structure.
  3. Ensure the "Input -> Processing -> Output" structure is clear.
  4. Add short, clear text labels to connecting arrows indicating data type (e.g., "JSON", "Auth Token").
  5. IMPORTANT: All text labels and explanations in the image must be written in ${language}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error: any) {
    console.error("Gemini infographic generation failed:", error);
    
    // Enhanced error handling
    const errorMsg = error.message || error.toString();
    let userMessage = "Failed to generate visual. Please try again.";

    if (errorMsg.includes("403") || errorMsg.includes("permission denied")) {
        userMessage = "Access Denied: Please check your API key permissions. Ensure you are using a key from a paid Google Cloud Project for image generation.";
    } else if (errorMsg.includes("404") || errorMsg.includes("not found")) {
        userMessage = "Model Not Found: The required model (gemini-3-pro-image-preview) is not available with your current API key or region.";
    } else if (errorMsg.includes("429") || errorMsg.includes("quota")) {
        userMessage = "Rate Limit Exceeded: You are sending requests too quickly. Please wait a moment and try again.";
    } else if (errorMsg.includes("SAFETY")) {
        userMessage = "Safety Block: The content generation was blocked by safety filters. Please try a different repository or style.";
    } else if (errorMsg.includes("500")) {
        userMessage = "Service Error: Google AI service is temporarily unavailable. Please try again later.";
    }

    throw new Error(userMessage);
  }
}

/**
 * Converts a raster image of an infographic into SVG code using an LLM.
 * 
 * @param base64Image - Base64 string of the image.
 * @param promptContext - Context description of what the image contains.
 * @returns Promise resolving to SVG code string.
 */
export async function vectorizeInfographic(base64Image: string, promptContext: string): Promise<string | null> {
  const ai = getAiClient();
  const prompt = `Analyze the attached infographic image. It is a technical diagram for: "${promptContext}".
  
  TASK: Recreate this infographic as a clean, high-quality, professional SVG file.
  
  REQUIREMENTS:
  1. The SVG must be responsive (use viewBox, not fixed width/height).
  2. Maintain all structural connections and text labels from the original image.
  3. Use clean vector paths and professional gradients for a modern look.
  4. Preserve the color scheme and layout.
  5. Ensure all text is rendered as <text> elements for accessibility and scaling.
  6. Output ONLY valid SVG code. No explanations, no markdown blocks.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    let svgText = response.text || "";
    // Clean up any potential markdown wrapper
    svgText = svgText.replace(/^```svg\n/, '').replace(/^```xml\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
    return svgText.trim();
  } catch (error) {
    console.error("Gemini vectorization failed:", error);
    throw error;
  }
}

/**
 * Answers questions about the repo architecture based on the visual diagram.
 */
export async function askRepoQuestion(question: string, infographicBase64: string, fileTree: RepoFileTree[]): Promise<string> {
  const ai = getAiClient();
  // Provide context about the file structure to supplement the image
  const limitedTree = fileTree.slice(0, 300).map(f => f.path).join('\n');
  
  const prompt = `You are a senior software architect reviewing a project.
  
  Attached is an architectural infographic of the project.
  Here is the actual file structure of the repository:
  ${limitedTree}
  
  User Question: "${question}"
  
  Using BOTH the visual infographic and the file structure as context, answer the user's question. 
  If they ask about optimization, suggest specific areas based on the likely bottlenecks visible in standard architectures like this.
  Keep answers concise, technical, and helpful.`;

  try {
    const response = await ai.models.generateContent({
       model: 'gemini-3-pro-preview',
       contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: infographicBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "I couldn't generate an answer at this time.";
  } catch (error) {
    console.error("Gemini Q&A failed:", error);
    throw error;
  }
}

/**
 * Answers questions about a specific node (file/component) in the dependency graph.
 * Uses persona-based system instructions.
 * 
 * @param nodeLabel - Name of the selected node.
 * @param question - User's question.
 * @param fileTree - Full file tree context.
 * @param fileContent - Optional content of the selected file.
 * @param persona - Active persona ID for response tone/focus.
 */
export async function askNodeSpecificQuestion(
  nodeLabel: string, 
  question: string, 
  fileTree: RepoFileTree[],
  fileContent?: string,
  persona: string = "Senior Software Architect"
): Promise<string> {
  const ai = getAiClient();
  const limitedTree = fileTree.slice(0, 300).map(f => f.path).join('\n');
  
  let contentContext = "";
  if (fileContent) {
      contentContext = `\n\nCONTENT OF FILE "${nodeLabel}":\n\`\`\`\n${fileContent.slice(0, 15000)}\n\`\`\`\n(Truncated if too long)`;
  }

  // Construct system instruction based on persona
  let systemInstruction = `You are an expert ${persona}. `;
  if (persona.includes("Security")) {
      systemInstruction += "Focus heavily on vulnerabilities, data validation, auth logic, and potential exploits. Be paranoid but constructive.";
  } else if (persona.includes("Product")) {
      systemInstruction += "Focus on user value, feature feasibility, and user flow. Avoid overly deep technical jargon unless necessary.";
  } else if (persona.includes("Junior")) {
      systemInstruction += "Explain concepts simply (ELI5). Use analogies. Focus on learning and growth.";
  } else if (persona.includes("Architect")) {
      systemInstruction += "Focus on scalability, maintainability, design patterns, and clean code.";
  } else {
      systemInstruction += "Focus on code quality and best practices.";
  }

  const prompt = `
  The user is asking about a specific node in the dependency graph labeled: "${nodeLabel}".
  
  Repository File Structure Context (first 300 files):
  ${limitedTree}
  ${contentContext}
  
  User Question: "${question}"
  
  Based on the node name "${nodeLabel}" ${fileContent ? "and its actual content" : "and the file structure"}, explain what this component likely does and answer the question.
  Keep the response aligned with your persona: ${persona}.`;

  try {
    const response = await ai.models.generateContent({
       model: 'gemini-3-pro-preview',
       contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
          systemInstruction: systemInstruction
      }
    });

    return response.text || "I couldn't generate an answer at this time.";
  } catch (error) {
    console.error("Gemini Node Q&A failed:", error);
    throw error;
  }
}

/**
 * Generates an infographic from a web article URL.
 */
export async function generateArticleInfographic(
  url: string, 
  style: string, 
  onProgress?: (stage: string) => void,
  language: string = "English"
): Promise<InfographicResult> {
    const ai = getAiClient();
    if (onProgress) onProgress("RESEARCHING & ANALYZING CONTENT...");
    
    let structuralSummary = "";
    let citations: Citation[] = [];

    try {
        const analysisPrompt = `You are an expert Information Designer. Your goal is to extract the essential structure from a web page to create a clear, educational infographic.

        Analyze the content at this URL: ${url}
        
        TARGET LANGUAGE: ${language}.
        
        Provide a structured breakdown specifically designed for visual representation in ${language}:
        1. INFOGRAPHIC HEADLINE: The core topic in 5 words or less (in ${language}).
        2. KEY TAKEAWAYS: The 3 to 5 most important distinct points, steps, or facts (in ${language}). THESE WILL BE THE MAIN SECTIONS OF THE IMAGE.
        3. SUPPORTING DATA: Any specific numbers, percentages, or very short quotes that add credibility.
        4. VISUAL METAPHOR IDEA: Suggest ONE simple visual concept that best fits this content (e.g., "a roadmap with milestones", "a funnel", "three contrasting pillars", "a circular flowchart").
        
        Keep the output concise and focused purely on what should be ON the infographic. Ensure all content is in ${language}.`;

        const analysisResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: analysisPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        structuralSummary = analysisResponse.text || "";

        const chunks = analysisResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            chunks.forEach((chunk: any) => {
                if (chunk.web?.uri) {
                    citations.push({
                        uri: chunk.web.uri,
                        title: chunk.web.title || ""
                    });
                }
            });
            const uniqueCitations = new Map();
            citations.forEach(c => uniqueCitations.set(c.uri, c));
            citations = Array.from(uniqueCitations.values());
        }

    } catch (e) {
        console.warn("Content analysis failed, falling back to direct URL prompt", e);
        structuralSummary = `Create an infographic about: ${url}. Translate text to ${language}.`;
    }

    if (onProgress) onProgress("DESIGNING & RENDERING INFOGRAPHIC...");

    let styleGuidelines = "";
    switch (style) {
        case "Fun & Playful":
            styleGuidelines = `STYLE: Fun, playful, vibrant 2D vector illustrations. Use bright colors, rounded shapes, and a friendly tone.`;
            break;
        case "Clean Minimalist":
            styleGuidelines = `STYLE: Ultra-minimalist. Lots of whitespace, thin lines, limited color palette (1-2 accent colors max). Very sophisticated and airy.`;
            break;
        case "Dark Mode Tech":
            styleGuidelines = `STYLE: Dark mode technical aesthetic. Dark slate/black background with bright, glowing accent colors (cyan, lime green) for data points.`;
            break;
        case "Modern Editorial":
            styleGuidelines = `STYLE: Modern, flat vector illustration style. Clean, professional, and editorial (like a high-end tech magazine). Cohesive, mature color palette.`;
            break;
        default:
             if (style && style !== "Custom") {
                styleGuidelines = `STYLE: Custom User Style: "${style}".`;
             } else {
                styleGuidelines = `STYLE: Modern, flat vector illustration style. Clean, professional, and editorial (like a high-end tech magazine). Cohesive, mature color palette.`;
             }
            break;
    }

    const imagePrompt = `Create a professional, high-quality educational infographic based strictly on this structured content plan:

    ${structuralSummary}

    VISUAL DESIGN RULES:
    - ${styleGuidelines}
    - LANGUAGE: The text within the infographic MUST be written in ${language}.
    - LAYOUT: MUST follow the "VISUAL METAPHOR IDEA" from the plan above if one was provided.
    - TYPOGRAPHY: Clean, highly readable sans-serif fonts. The "INFOGRAPHIC HEADLINE" must be prominent at the top.
    - CONTENT: Use the actual text from "KEY TAKEAWAYS" in the image. Do not use placeholder text like Lorem Ipsum.
    - GOAL: The image must be informative and readable as a standalone graphic.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: imagePrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        let imageData = null;
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    imageData = part.inlineData.data;
                    break;
                }
            }
        }
        return { imageData, citations };
    } catch (error) {
        console.error("Article infographic generation failed:", error);
        throw error;
    }
}

/**
 * Suggests tasks for the project based on repo structure.
 */
export async function suggestProjectTasks(repoName: string, fileTree: RepoFileTree[]): Promise<Task[]> {
  const ai = getAiClient();
  const limitedTree = fileTree.slice(0, 300).map(f => f.path).join('\n');

  const prompt = `You are a Technical Project Manager.
  
  Based on the file structure of the repository "${repoName}", identify 3-5 critical technical tasks, refactoring opportunities, or missing configurations that a developer should address.
  
  File Structure:
  ${limitedTree}
  
  Return the tasks as a JSON array where each object has:
  - title: string (concise task name)
  - priority: "high" | "medium" | "low"
  - dueDate: string (YYYY-MM-DD, assume today is ${new Date().toISOString().split('T')[0]} and set reasonable deadlines)
  
  Do not include markdown formatting, just the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
              dueDate: { type: Type.STRING }
            },
            required: ["title", "priority", "dueDate"]
          }
        }
      }
    });

    const tasks = JSON.parse(response.text || "[]");
    return tasks.map((t: any, index: number) => ({
      id: `ai-gen-${Date.now()}-${index}`,
      title: t.title,
      priority: t.priority,
      dueDate: t.dueDate,
      completed: false,
      createdAt: Date.now()
    }));
  } catch (error) {
    console.error("Task suggestion failed:", error);
    return [];
  }
}

/**
 * Uses Generative AI to apply style transfer or edits to an image.
 */
export async function editImageWithGemini(base64Data: string, mimeType: string, prompt: string): Promise<string | null> {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini image editing failed:", error);
    throw error;
  }
}

/**
 * Converts a UI wireframe image into React/Tailwind code.
 */
export async function generateCodeFromImage(base64Image: string, prompt: string): Promise<string | null> {
   const ai = getAiClient();
   const fullPrompt = `
   You are an expert Frontend Developer specializing in React and Tailwind CSS.
   
   Analyze the attached UI wireframe/screenshot.
   
   TASK: Write the React code to implement this UI.
   - Use Tailwind CSS for styling.
   - Use Lucide React for icons if needed (imports from 'lucide-react').
   - Component should be functional and responsive.
   - Return ONLY the code, no markdown formatting.
   
   User specific request: ${prompt}
   `;

   try {
     const response = await ai.models.generateContent({
       model: 'gemini-3-pro-preview',
       contents: {
         parts: [
           { inlineData: { mimeType: 'image/png', data: base64Image } },
           { text: fullPrompt }
         ]
       }
     });
     
     let code = response.text || "";
     // Clean markdown
     code = code.replace(/^```tsx?\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
     return code;
   } catch (e) {
     console.error("Code generation failed", e);
     throw e;
   }
}
