import type { DifficultyLevel } from '@/types';

interface AnalysisInput {
  transcript: string;
  videoTitle: string;
  videoDescription: string;
  platform: string;
  userProfile?: {
    interests: string[];
    skillLevel: string;
  };
}

interface AnalysisResult {
  relevanceScore: number;
  feasibilityScore: number;
  valueScore: number;
  difficultyLevel: DifficultyLevel;
  estimatedTimeHours: number;
  prerequisites: string[];
  learningObjectives: string[];
  warnings: string[];
}

type AIProvider = 'openai' | 'deepseek';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export class AnalysisService {
  private config: AIConfig;

  constructor() {
    const provider = (process.env.AI_PROVIDER as AIProvider) || 'deepseek';

    if (provider === 'deepseek') {
      this.config = {
        provider: 'deepseek',
        apiKey: process.env.DEEPSEEK_API_KEY || '',
        baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      };
    } else {
      this.config = {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY || '',
        baseUrl: 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL || 'gpt-4',
      };
    }
  }

  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    if (!this.config.apiKey) {
      return this.getMockAnalysis(input);
    }

    try {
      return await this.callAIAnalysis(input);
    } catch (error) {
      console.error('AI analysis failed, falling back to mock:', error);
      return this.getMockAnalysis(input);
    }
  }

  private async callAIAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
    const systemPrompt = `Anda adalah ahli analisis konten pendidikan. Analisis transkrip video dan berikan:
1. Skor relevansi (1-10) berdasarkan profil pengguna
2. Skor kelayakan implementasi (1-10)
3. Skor nilai (1-10)
4. Tingkat kesulitan (pemula/menengah/lanjutan)
5. Estimasi waktu implementasi (jam)
6. Prasyarat
7. Tujuan pembelajaran
8. Peringatan atau catatan

Respons dalam format JSON valid.`;

    const userPrompt = `Analisis video ini:
Judul: ${input.videoTitle}
Transkrip: ${input.transcript.substring(0, 2000)}...

${input.userProfile ? `Profil Pengguna: Minat - ${input.userProfile.interests.join(', ')}, Tingkat - ${input.userProfile.skillLevel}` : ''}

Berikan analisis dalam format JSON:
{
  "relevanceScore": number,
  "feasibilityScore": number,
  "valueScore": number,
  "difficultyLevel": "beginner" | "intermediate" | "advanced",
  "estimatedTimeHours": number,
  "prerequisites": string[],
  "learningObjectives": string[],
  "warnings": string[]
}`;

    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    return JSON.parse(jsonStr) as AnalysisResult;
  }

  private getMockAnalysis(input: AnalysisInput): AnalysisResult {
    const wordCount = input.transcript.split(/\s+/).length;
    const hasTechnicalTerms = /code|programming|api|database|server/i.test(input.transcript);
    const hasBeginnerTerms = /beginner|start|learn|basic|introduction/i.test(input.transcript);

    let difficultyLevel: DifficultyLevel = 'intermediate';
    if (hasBeginnerTerms || wordCount < 1000) {
      difficultyLevel = 'beginner';
    } else if (hasTechnicalTerms || wordCount > 5000) {
      difficultyLevel = 'advanced';
    }

    const estimatedTimeHours = Math.max(1, Math.min(20, Math.round(wordCount / 500)));

    return {
      relevanceScore: this.calculateRelevance(input),
      feasibilityScore: this.calculateFeasibility(input),
      valueScore: this.calculateValue(input),
      difficultyLevel,
      estimatedTimeHours,
      prerequisites: this.extractPrerequisites(input),
      learningObjectives: this.extractObjectives(input),
      warnings: this.extractWarnings(input),
    };
  }

  private calculateRelevance(input: AnalysisInput): number {
    if (!input.userProfile) return 7;

    const titleLower = input.videoTitle.toLowerCase();
    const descLower = input.videoDescription.toLowerCase();

    let score = 5;
    for (const interest of input.userProfile.interests) {
      if (titleLower.includes(interest.toLowerCase())) score += 2;
      if (descLower.includes(interest.toLowerCase())) score += 1;
    }

    return Math.min(10, Math.max(1, score));
  }

  private calculateFeasibility(input: AnalysisInput): number {
    const wordCount = input.transcript.split(/\s+/).length;
    if (wordCount < 1000) return 9;
    if (wordCount < 3000) return 7;
    if (wordCount < 5000) return 5;
    return 3;
  }

  private calculateValue(input: AnalysisInput): number {
    const hasExamples = /example|demonstrate|show|tutorial/i.test(input.transcript);
    const hasActionable = /step|follow|do|create|build/i.test(input.transcript);

    let score = 5;
    if (hasExamples) score += 2;
    if (hasActionable) score += 2;

    return Math.min(10, score);
  }

  private extractPrerequisites(input: AnalysisInput): string[] {
    const prereqs: string[] = [];

    if (/advanced|expert|senior/i.test(input.transcript)) {
      prereqs.push('Pengetahuan lanjutan di bidang ini');
    }
    if (/code|programming|api/i.test(input.transcript)) {
      prereqs.push('Dasar-dasar pemrograman');
    }
    if (/database|sql|query/i.test(input.transcript)) {
      prereqs.push('Dasar-dasar basis data');
    }

    return prereqs.length > 0 ? prereqs : ['Tidak ada prasyarat khusus'];
  }

  private extractObjectives(input: AnalysisInput): string[] {
    const objectives: string[] = [];

    if (/learn|understand/i.test(input.videoTitle)) {
      objectives.push('Memahami konsep-konsep kunci');
    }
    if (/build|create|implement/i.test(input.videoTitle)) {
      objectives.push('Membangun keterampilan praktis');
    }
    if (/tutorial|guide|how/i.test(input.videoTitle)) {
      objectives.push('Mengikuti langkah-langkah panduan');
    }

    return objectives.length > 0 ? objectives : ['Memperoleh pengetahuan dan keterampilan baru'];
  }

  private extractWarnings(input: AnalysisInput): string[] {
    const warnings: string[] = [];

    if (/deprecated|outdated|old/i.test(input.transcript)) {
      warnings.push('Konten mungkin berisi informasi yang sudah usang');
    }
    if (/complex|difficult|advanced/i.test(input.transcript)) {
      warnings.push('Ini adalah konten lanjutan - ambil waktu yang cukup');
    }

    return warnings;
  }
}

export const analysisService = new AnalysisService();