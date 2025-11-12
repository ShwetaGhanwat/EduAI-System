import { useState } from 'react';
import { aiService } from '../services/aiService';
import { FileText, Loader, Sparkles, Copy, Check } from 'lucide-react';

export const GenerateCourseOutline = () => {
  const [formData, setFormData] = useState({
    topic: '',
    duration: '8',
    level: 'intermediate'
  });
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutline('');

    const response = await aiService.generateCourseOutline(
      formData.topic,
      formData.duration,
      formData.level
    );

    if (response.success) {
      setOutline(response.data);
    } else {
      setOutline('Error generating outline. Please try again.');
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Course Outline</h1>
          </div>
          <p className="text-gray-600">Create a structured course outline with AI assistance</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Topic
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Introduction to Machine Learning"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Duration (weeks)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-field"
                  min="1"
                  max="52"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Outline
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Generated Outline</h2>
              {outline && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : outline ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                  {outline}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>Your generated outline will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
