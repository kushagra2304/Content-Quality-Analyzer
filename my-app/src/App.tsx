import { useState } from "react";

interface Analysis {
  readability: number;
  seo: number;
  grammar: number;
  tone: string;
  overall: string;
  suggestion: string;
}

function App() {
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
  setLoading(true);
  setAnalysis(null);

  try {
    const response = await fetch("https://content-quality-analyzer-1.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data: Analysis = await response.json();
    setAnalysis(data);
  } catch (error) {
    console.error("Error analyzing content:", error);
  } finally {
    setLoading(false);
  }
};

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-10 w-96 h-96 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-pulse">
            Content Quality Analyzer
          </h1>
          <p className="text-gray-300 text-lg font-medium">
            Analyze your content with AI-powered insights ✨
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-4xl mb-8 animate-slide-up">
          <div className="relative group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="✍️ Paste your amazing content here and watch the magic happen..."
              className="w-full h-48 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 shadow-2xl resize-none group-hover:shadow-purple-500/20"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !content.trim()}
          className="relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 animate-bounce-in overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-3">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                Analyzing Magic...
              </>
            ) : (
              <>
                <span className="animate-pulse">🚀</span>
                Analyze Content
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Results Section */}
        {analysis && (
          <div className="mt-12 w-full max-w-6xl animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                📊 Analysis Results
              </h2>
              
              {/* Score Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Readability Score */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">📖</span>
                    <span className="text-sm text-gray-300 font-medium">Readability</span>
                  </div>
                  <div className="relative">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.readability)} mb-2`}>
                      {analysis.readability}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getScoreBackground(analysis.readability)} transition-all duration-1000 ease-out animate-progress-fill`}
                        style={{ width: `${analysis.readability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* SEO Score */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">🔍</span>
                    <span className="text-sm text-gray-300 font-medium">SEO</span>
                  </div>
                  <div className="relative">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.seo)} mb-2`}>
                      {analysis.seo}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getScoreBackground(analysis.seo)} transition-all duration-1000 ease-out animate-progress-fill delay-300`}
                        style={{ width: `${analysis.seo}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Grammar Score */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">✍️</span>
                    <span className="text-sm text-gray-300 font-medium">Grammar</span>
                  </div>
                  <div className="relative">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.grammar)} mb-2`}>
                      {analysis.grammar}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getScoreBackground(analysis.grammar)} transition-all duration-1000 ease-out animate-progress-fill delay-600`}
                        style={{ width: `${analysis.grammar}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tone & Overall */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎭</div>
                    <div className="text-sm text-gray-300 font-medium mb-2">Tone</div>
                    <div className="text-xl font-bold text-blue-400 mb-4">{analysis.tone}</div>
                    
                    <div className="text-2xl mb-2">✅</div>
                    <div className="text-sm text-gray-300 font-medium mb-2">Overall</div>
                    <span
                      className={`text-xl font-bold px-3 py-1 rounded-full ${
                        analysis.overall === "Excellent"
                          ? "text-emerald-400 bg-emerald-500/20"
                          : analysis.overall === "Good"
                          ? "text-yellow-400 bg-yellow-500/20"
                          : analysis.overall === "Average"
                          ? "text-orange-400 bg-orange-500/20"
                          : "text-red-400 bg-red-500/20"
                      }`}
                    >
                      {analysis.overall}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suggestions Section */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                <div className="flex items-start gap-4">
                  <div className="text-3xl animate-bounce">💡</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      AI Suggestions
                    </h3>
                    <p className="text-gray-200 leading-relaxed text-lg">
                      {analysis.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Proof & Testimonials */}
        <div className="w-full max-w-6xl mt-12 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Trusted by Content Creators Worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Testimonial Cards */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">Content Marketer</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic">
                "This tool completely transformed how I approach content creation. The AI insights are incredibly accurate!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Mike Chen</div>
                  <div className="text-gray-400 text-sm">SEO Specialist</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic">
                "The SEO analysis feature helped me boost my rankings significantly. Highly recommended!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  E
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Emma Davis</div>
                  <div className="text-gray-400 text-sm">Blogger</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic">
                "Simple, fast, and incredibly insightful. This has become an essential tool in my workflow."
              </p>
              <div className="flex text-yellow-400 mt-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
          
          {/* Company Logos */}
          <div className="text-center">
            <p className="text-gray-400 mb-6">Used by teams at</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg">
                TechCorp
              </div>
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-lg">
                StartupXYZ
              </div>
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 rounded-lg">
                MediaPlus
              </div>
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-lg">
                ContentPro
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="w-full max-w-6xl mt-12 animate-fade-in-up">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
              Live Activity Feed
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">
                  📝 <strong>Anonymous</strong> analyzed a blog post - Score: <span className="text-green-400">87%</span>
                </span>
                <span className="text-gray-500 text-xs ml-auto">2 min ago</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">
                  📄 <strong>Anonymous</strong> analyzed marketing copy - Score: <span className="text-yellow-400">72%</span>
                </span>
                <span className="text-gray-500 text-xs ml-auto">5 min ago</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">
                  📰 <strong>Anonymous</strong> analyzed news article - Score: <span className="text-blue-400">91%</span>
                </span>
                <span className="text-gray-500 text-xs ml-auto">8 min ago</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">
                  ✉️ <strong>Anonymous</strong> analyzed email campaign - Score: <span className="text-purple-400">85%</span>
                </span>
                <span className="text-gray-500 text-xs ml-auto">12 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes progress-fill {
          from { width: 0%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }
        
        .animate-bounce-in {
          animation: bounce-in 1s ease-out 0.4s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-progress-fill {
          animation: progress-fill 1.5s ease-out;
        }
      `}</style> */}
    </div>
  );
}

export default App;