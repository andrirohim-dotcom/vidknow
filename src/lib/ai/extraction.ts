import type { KnowledgeReport, KeyConcept, ImplementationStep, Tool, DifficultyLevel } from '@/types';

interface ExtractionInput {
  transcript: string;
  videoTitle: string;
  videoDescription: string;
  platform: string;
}

interface ExtractionPrompt {
  system: string;
  user: string;
}

export class ExtractionService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  private buildPrompt(input: ExtractionInput): ExtractionPrompt {
    const system = `You are an expert knowledge extractor and educator. Your task is to analyze video transcripts and create comprehensive, easy-to-understand knowledge reports.

For each video, you must extract:
1. A clear summary (2-3 paragraphs)
2. Key concepts with importance levels
3. Step-by-step implementation guide
4. Required tools with descriptions
5. Difficulty level (beginner/intermediate/advanced)
6. Estimated time to implement
7. Prerequisites
8. Learning objectives
9. Relevance score (1-10)
10. Feasibility score (1-10)
11. Value score (1-10)
12. Any warnings or caveats

Format your response as valid JSON matching the KnowledgeReport interface.`;

    const user = `Analyze this video transcript and create a comprehensive knowledge report:

Video Title: ${input.videoTitle}
Platform: ${input.platform}
Description: ${input.videoDescription}

Transcript:
${input.transcript}

Create a detailed knowledge report that:
- Is written for beginners (explain technical terms)
- Includes actionable implementation steps
- Lists all required tools with links where possible
- Provides realistic time estimates
- Identifies prerequisites and learning objectives
- Scores relevance, feasibility, and value (1-10)

Respond with valid JSON only.`;

    return { system, user };
  }

  async extractKnowledge(input: ExtractionInput): Promise<Omit<KnowledgeReport, 'id' | 'extraction_id' | 'user_id' | 'created_at' | 'updated_at'>> {
    if (!this.apiKey) {
      // Return mock data for development
      return this.getMockReport(input);
    }

    const prompt = this.buildPrompt(input);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    try {
      const report = JSON.parse(content) as Omit<KnowledgeReport, 'id' | 'extraction_id' | 'user_id' | 'created_at' | 'updated_at'>;
      return report;
    } catch {
      throw new Error('Failed to parse API response as JSON');
    }
  }

  private getMockReport(input: ExtractionInput): Omit<KnowledgeReport, 'id' | 'extraction_id' | 'user_id' | 'created_at' | 'updated_at'> {
    return {
      summary: `This video titled "${input.videoTitle}" provides comprehensive coverage of the topic. The presenter explains key concepts clearly and provides practical examples throughout.`,
      key_concepts: [
        { title: 'Core Concept 1', description: 'Description of the first key concept', importance: 'high' },
        { title: 'Core Concept 2', description: 'Description of the second key concept', importance: 'medium' },
        { title: 'Core Concept 3', description: 'Description of the third key concept', importance: 'low' },
      ],
      implementation_steps: [
        { step: 1, title: 'Step 1', description: 'First implementation step', expected_outcome: 'Expected result' },
        { step: 2, title: 'Step 2', description: 'Second implementation step', expected_outcome: 'Expected result' },
      ],
      tools_list: [
        { name: 'Tool 1', url: 'https://example.com', description: 'Required tool', required: true },
      ],
      difficulty_level: 'intermediate' as DifficultyLevel,
      estimated_time_hours: 4,
      prerequisites: ['Basic understanding of the topic'],
      learning_objectives: ['Understand core concepts', 'Apply knowledge practically'],
      relevance_score: 8,
      feasibility_score: 7,
      value_score: 8,
      warnings: [],
      metadata: {},
    };
  }
}

export const extractionService = new ExtractionService();