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

export class AnalysisService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    if (!this.apiKey) {
      return this.getMockAnalysis(input);
    }

    // In production, call OpenAI API for analysis
    return this.getMockAnalysis(input);
  }

  private getMockAnalysis(input: AnalysisInput): AnalysisResult {
    // Simple mock analysis based on content length and keywords
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
      prereqs.push('Advanced knowledge in the field');
    }
    if (/code|programming|api/i.test(input.transcript)) {
      prereqs.push('Basic programming knowledge');
    }
    if (/database|sql|query/i.test(input.transcript)) {
      prereqs.push('Database fundamentals');
    }

    return prereqs.length > 0 ? prereqs : ['No specific prerequisites'];
  }

  private extractObjectives(input: AnalysisInput): string[] {
    const objectives: string[] = [];

    if (/learn|understand/i.test(input.videoTitle)) {
      objectives.push('Understand core concepts');
    }
    if (/build|create|implement/i.test(input.videoTitle)) {
      objectives.push('Build practical skills');
    }
    if (/tutorial|guide|how/i.test(input.videoTitle)) {
      objectives.push('Follow step-by-step instructions');
    }

    return objectives.length > 0 ? objectives : ['Gain new knowledge and skills'];
  }

  private extractWarnings(input: AnalysisInput): string[] {
    const warnings: string[] = [];

    if (/deprecated|outdated|old/i.test(input.transcript)) {
      warnings.push('Content may contain outdated information');
    }
    if (/complex|difficult|advanced/i.test(input.transcript)) {
      warnings.push('This is advanced content - take your time');
    }

    return warnings;
  }
}

export const analysisService = new AnalysisService();