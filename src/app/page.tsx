import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">VidKnow</div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/extract"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Extract Knowledge from
            <span className="text-indigo-600"> Any Video</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            YouTube, X.com, TikTok - konversi video menjadi pengetahuan yang mudah dipahami,
            diikuti, dan dilaksanakan. Didukung oleh AI DeepSeek.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/extract"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Mulai Ekstrak Sekarang
            </Link>
            <Link
              href="/knowledge"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Lihat Library
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Platform</h3>
            <p className="text-gray-600">
              Dukungan penuh untuk YouTube, X.com (Twitter), dan TikTok.
              Cukup paste link video.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Didukung oleh DeepSeek AI untuk ekstraksi pengetahuan yang akurat
              dan laporan yang mudah dipahami.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Knowledge Library</h3>
            <p className="text-gray-600">
              Simpan, organisir, dan pelajari kembali pengetahuan yang sudah diekstrak.
              Multi-profil untuk berbagai topik.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Paste Link</h4>
              <p className="text-gray-600 text-sm">Copy URL video dari YouTube, X.com, atau TikTok</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Ekstrak</h4>
              <p className="text-gray-600 text-sm">AI menganalisis dan mengekstrak pengetahuan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Pelajari</h4>
              <p className="text-gray-600 text-sm">Baca laporan lengkap dengan langkah implementasi</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Export</h4>
              <p className="text-gray-600 text-sm">Download sebagai PDF atau HTML untuk dibagikan</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-medium">Next.js 14</div>
              <div className="text-sm text-gray-400">React Framework</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl mb-2">🗄️</div>
              <div className="font-medium">Supabase</div>
              <div className="text-sm text-gray-400">Database & Auth</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-medium">DeepSeek AI</div>
              <div className="text-sm text-gray-400">Knowledge Extraction</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-medium">Tailwind CSS</div>
              <div className="text-sm text-gray-400">Styling</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2026 VidKnow. Built with Next.js + Supabase + DeepSeek AI</p>
        </div>
      </footer>
    </div>
  );
}