import type { KnowledgeReport, DifficultyLevel } from '@/types';

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

type AIProvider = 'openai' | 'deepseek';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export class ExtractionService {
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

  private buildPrompt(input: ExtractionInput): ExtractionPrompt {
    const system = `Anda adalah ahli pengetahuan dan pendidik. Tugas Anda adalah menganalisis transkrip video dan membuat laporan pengetahuan yang komprehensif dan mudah dipahami.

Untuk setiap video, Anda harus mengekstrak:
1. Ringkasan yang jelas (2-3 paragraf)
2. Konsep-konsep kunci dengan tingkat pentingness
3. Panduan implementasi langkah demi langkah
4. Alat-alat yang diperlukan dengan deskripsi
5. Tingkat kesulitan (pemula/menengah/lanjutan)
6. Estimasi waktu untuk implementasi
7. Prasyarat
8. Tujuan pembelajaran
9. Skor relevansi (1-10)
10. Skor kelayakan (1-10)
11. Skor nilai (1-10)
12. Peringatan atau catatan

Format respons Anda sebagai JSON valid yang sesuai dengan interface KnowledgeReport.`;

    const user = `Analisis transkrip video ini dan buat laporan pengetahuan yang komprehensif:

Judul Video: ${input.videoTitle}
Platform: ${input.platform}
Deskripsi: ${input.videoDescription}

Transkrip:
${input.transcript}

Buat laporan pengetahuan detail yang:
- Ditulis untuk pemula (jelaskan istilah teknis)
- Termasuk langkah-langkah implementasi yang dapat ditindaklanjuti
- Daftar semua alat yang diperlukan dengan tautan jika memungkinkan
- Memberikan estimasi waktu yang realistis
- Mengidentifikasi prasyarat dan tujuan pembelajaran
- Memberikan skor relevansi, kelayakan, dan nilai (1-10)

Respons dengan JSON valid saja.`;

    return { system, user };
  }

  async extractKnowledge(input: ExtractionInput): Promise<Omit<KnowledgeReport, 'id' | 'extraction_id' | 'user_id' | 'created_at' | 'updated_at'>> {
    if (!this.config.apiKey) {
      // Return mock data for development
      return this.getMockReport(input);
    }

    const prompt = this.buildPrompt(input);

    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`${this.config.provider} API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const report = JSON.parse(jsonStr) as Omit<KnowledgeReport, 'id' | 'extraction_id' | 'user_id' | 'created_at' | 'updated_at'>;
      return report;
    } catch {
      throw new Error('Failed to parse API response as JSON');
    }
  }

  private getMockReport(input: ExtractionInput): Omit<KnowledgeReport, 'id' | 'extraction_id' | 'user_id' | 'created_at' | 'updated_at'> {
    return {
      summary: `Video berjudul "${input.videoTitle}" memberikan liputan komprehensif tentang topik ini. Pembahas menjelaskan konsep-kunci dengan jelas dan memberikan contoh praktis sepanjang video.`,
      key_concepts: [
        { title: 'Konsep Kunci 1', description: 'Deskripsi konsep kunci pertama', importance: 'high' },
        { title: 'Konsep Kunci 2', description: 'Deskripsi konsep kunci kedua', importance: 'medium' },
        { title: 'Konsep Kunci 3', description: 'Deskripsi konsep kunci ketiga', importance: 'low' },
      ],
      implementation_steps: [
        { step: 1, title: 'Langkah 1', description: 'Langkah implementasi pertama', expected_outcome: 'Hasil yang diharapkan' },
        { step: 2, title: 'Langkah 2', description: 'Langkah implementasi kedua', expected_outcome: 'Hasil yang diharapkan' },
      ],
      tools_list: [
        { name: 'Alat 1', url: 'https://example.com', description: 'Alat yang diperlukan', required: true },
      ],
      difficulty_level: 'intermediate' as DifficultyLevel,
      estimated_time_hours: 4,
      prerequisites: ['Pemahaman dasar tentang topik'],
      learning_objectives: ['Memahami konsep kunci', 'Menerapkan pengetahuan secara praktis'],
      relevance_score: 8,
      feasibility_score: 7,
      value_score: 8,
      warnings: [],
      metadata: {},
    };
  }

  getProviderInfo(): { provider: AIProvider; model: string } {
    return {
      provider: this.config.provider,
      model: this.config.model,
    };
  }
}

export const extractionService = new ExtractionService();