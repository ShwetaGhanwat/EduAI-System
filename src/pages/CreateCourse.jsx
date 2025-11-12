import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CreateCourse = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'programming',
    level: 'beginner',
    duration: '4 weeks',
    image_url: 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIGenerate = async () => {
    if (!formData.title) {
      alert('Please enter a course title first');
      return;
    }

    setAiLoading(true);
    try {
      const outline = await aiService.generateCourseOutline(
        formData.title,
        formData.duration,
        formData.level
      );

      setFormData(prev => ({
        ...prev,
        description: outline.description || prev.description
      }));
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate course outline. Please check your AI API configuration.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            ...formData,
            teacher_id: profile.id,
            is_published: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // navigate(`/courses/${data.id}/edit`);
      navigate(`/courses/${data.id}`);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-gray-400">Use AI to help generate your course content</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Introduction to Web Development"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input-field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input-field"
              placeholder="4 weeks"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Description</label>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={aiLoading}
                className="text-sm text-primary-500 hover:text-primary-400 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[120px]"
              placeholder="Describe what students will learn in this course..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Course Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <><Save className="w-4 h-4" /> Create Course</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
