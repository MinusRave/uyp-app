import Anthropic from '@anthropic-ai/sdk';
import { GenerateExecutiveAnalysis } from 'wasp/server/operations';

// Initialize Anthropic client
// Ensure ANTHROPIC_API_KEY is set in .env
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_build', // Fallback to avoid build crash if env missing during compile
});

type ExecutiveAnalysisResult = {
    markdown: string;
};

// Add sessionId to Args
type ExecutiveAnalysisArgs = {
    dominantLens: string;
    dimensions: {
        id: string;
        sl: number;
        pm: number;
        state: string;
    }[];
    userContext?: string;
    sessionId?: string; // NEW: Allow passing session ID directly
};

export const generateExecutiveAnalysis: GenerateExecutiveAnalysis<ExecutiveAnalysisArgs, ExecutiveAnalysisResult> = async (args, context) => {
    // 1. Auth Check: Allow if User OR Valid Paid Session
    let session: any = null;

    // Always fetch session if sessionId is provided
    if (args.sessionId) {
        session = await context.entities.TestSession.findUnique({
            where: { id: args.sessionId }
        });

        if (!session) {
            throw new Error('Unauthorized: Session not found.');
        }

        // Verify session is paid OR user owns the session (fallback for dev)
        const userOwnsSession = context.user && session.userId === context.user.id;
        if (!session.isPaid && !userOwnsSession) {
            throw new Error('Unauthorized: Session not paid.');
        }
    } else if (!context.user) {
        // No session ID and not logged in
        throw new Error('Must be logged in or provide valid session ID.');
    }

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';

    // Construct the "Rich Mirror" Prompt with Lifecycle Context
    let prompt = `
    You are an expert Relationship Therapist with 30 years of experience in Attachment Theory and Nervous System Regulation.
    
    CLIENT PROFILE:
    - Dominant Pattern: ${args.dominantLens}
    - Full Dimensional Profile:
      ${args.dimensions.map(d => `- ${d.id}: Feeling=${d.sl}/100, Perception of Threat=${d.pm}/100 (State: ${d.state})`).join('\n')}
    `;

    // Add relationship history context if available
    if (session) {
        prompt += `\n    - Relationship Duration: ${session.relationshipDuration || "Not specified"}`;
        prompt += `\n    - Living Together: ${session.livingTogether ? "Yes" : "No"}`;
        prompt += `\n    - Children: ${session.hasChildren ? "Yes" : "No"}`;
        if (session.previousRelationships) {
            prompt += `\n    - Previous Relationships: ${session.previousRelationships}`;
        }
        if (session.previousMarriage) {
            prompt += `\n    - Previously Married: Yes`;
        }
        if (session.majorLifeTransition && session.majorLifeTransition !== 'none') {
            prompt += `\n    - Current Life Transition: ${session.majorLifeTransition}`;
        }
    }

    if (args.userContext) {
        prompt += `
    - USER'S LAST CONFLICT DESCRIPTION: "${args.userContext}"
        `;
    }

    prompt += `
    TASK:
    Write a "Deep Mirror" executive summary for this client.
    This is NOT a generic report. It must feel like a personalized letter from a wise therapist who "sees" them.
    
    CRITICAL INSTRUCTIONS FOR PERSONALIZATION:
    1. **Lifecycle Awareness:** Reference their specific life stage and relationship context.
       - If 10+ years together: "After a decade together, this pattern likely hardened during [specific phase]..."
       - If new relationship (0-2 years): "In these early months, your nervous system is still calibrating..."
       - If has children: "Parenting stress amplifies this pattern because [specific reason]..."
       - If major life transition: Acknowledge how [transition] is activating their pattern
    
    2. **Pattern Origins:** If they have previous relationships/marriage, acknowledge:
       - "This pattern didn't start with this relationship. It's been protecting you for years..."
    
    3. **Personalized Language:** Use their exact age/stage/situation, not generalizations.
    
    STRUCTURE:
    1. **The Core Truth:** Start with a compassionate but piercing insight about how their nervous system works overall. Connect the dots between their high scores AND their life stage.
    2. **The Hidden Cost:** Explain what this pattern is costing them in intimacy. Be direct but kind.
    `;

    if (args.userContext) {
        prompt += `
    3. **The Conflict Decoder (Analysis of their specific story):** 
       - Read the "LAST CONFLICT DESCRIPTION" provided above.
       - VALIDATION: If the text is nonsense, too short ("asdf"), or irrelevant, IGNORE IT and write: "I see you shared a moment, but I don't have quite enough detail to analyze it perfectly yet."
       - IF VALID: Analyze *why* the conflict happened based on their Lens vs Partner's likely reaction. Explain what really happened underneath the surface.
       - Provide 1 specific script they could have used instead.
        `;
    }

    prompt += `
    4. **The Path Forward:** One powerful sentence on the shift they need to make.

    TONE:
    Compassionate, direct, profound. No fluff. No "It seems like". Use "You".
    Format in clean Markdown.
    `;

    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 1000,
            temperature: 0.7,
            system: "You are the world's most insightful relationship psychologist. Your goal is to make the client feel 'seen' deeply.",
            messages: [
                { role: "user", content: prompt }
            ]
        });

        const content = msg.content[0];
        if (content.type === 'text') {
            return { markdown: content.text };
        }
        return { markdown: "Analysis generation failed." };

    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fallback content if API fails or key is missing
        return {
            markdown: `
        ### The Mirror (Preview)
        
        *Note: AI Analysis unavailable (Check API Configuration).*
        
        Based on your scores, you show a strong tendency towards **${args.dominantLens}**.
        Your system prioritizes safety, but this may often look like withdrawal to your partner.
      `
        };
    }
}

type TranslateMessageArgs = {
    message: string;
    userLens: string;
    partnerLens: string;
    sessionId?: string; // NEW: Allow passing session ID
};

type TranslateMessageResult = {
    translatedMessage: string;
    analysis: string; // Brief explanation of why the change was made
};

import { TranslateMessage } from 'wasp/server/operations';

export const translateMessage: TranslateMessage<TranslateMessageArgs, TranslateMessageResult> = async (args, context) => {
    // 1. Auth Check: Allow if User OR Valid Paid Session
    if (!context.user) {
        if (!args.sessionId) {
            throw new Error('Must be logged in or provide valid session ID.');
        }

        // Verify Session
        const session = await context.entities.TestSession.findUnique({
            where: { id: args.sessionId }
        });

        if (!session || !session.isPaid) {
            throw new Error('Unauthorized.');
        }
    }

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';

    const prompt = `
    You are a Relationship Translator.
    
    CONTEXT:
    - Sender's Lens: ${args.userLens}
    - Receiver's Lens: ${args.partnerLens}
    
    DRAFT MESSAGE: "${args.message}"
    
    TASK:
    1. Identify why this draft might trigger the Receiver's defense mechanisms (based on their lens).
    2. Rewrite the message to convey the SAME core meaning, but safely.
    
    OUTPUT FORMAT (JSON):
    {
        "analysis": "Brief explanation of the toggle point.",
        "translatedMessage": "The new script."
    }
    `;

    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 300,
            temperature: 0.5,
            system: "You are a communication expert. Output ONLY valid JSON.",
            messages: [
                { role: "user", content: prompt }
            ]
        });

        const content = msg.content[0];
        if (content.type === 'text') {
            try {
                const parsed = JSON.parse(content.text);
                return {
                    translatedMessage: parsed.translatedMessage,
                    analysis: parsed.analysis
                };
            } catch (e) {
                // Fallback if JSON fails
                return {
                    translatedMessage: content.text,
                    analysis: "Optimization complete."
                };
            }
        }
        return { translatedMessage: "Error", analysis: "Error" };

    } catch (error) {
        console.error("Translation Error:", error);
        return {
            translatedMessage: "Could not translate at this moment.",
            analysis: "AI Service Unavailable"
        };
    }
}
