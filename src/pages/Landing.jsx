import { Link } from 'react-router-dom';
import { BookOpen, Brain, Users, Award, ArrowRight, Sparkles } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="fixed top-0 w-full bg-dark-950/80 backdrop-blur-lg border-b border-dark-800 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold">EduAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience the future of education with AI-powered course management.
              Create, teach, and learn with intelligent tools designed for success.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register" className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/courses" className="btn-secondary px-8 py-3 text-lg">
                Browse Courses
              </Link>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain className="w-8 h-8 text-primary-500" />,
                title: "AI Tutoring",
                description: "Get personalized help from AI whenever you need it"
              },
              {
                icon: <BookOpen className="w-8 h-8 text-green-500" />,
                title: "Smart Content",
                description: "AI-generated course outlines, quizzes, and materials"
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: "Collaborative",
                description: "Connect with teachers and students worldwide"
              },
              {
                icon: <Award className="w-8 h-8 text-yellow-500" />,
                title: "Track Progress",
                description: "Monitor your learning journey with detailed analytics"
              }
            ].map((feature, index) => (
              <div key={index} className="card card-hover text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-dark-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-gray-400 text-lg">Whether you want to teach or learn, we have you covered</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card card-hover p-8 border-2 border-primary-500/20 hover:border-primary-500/40">
              <h3 className="text-2xl font-bold mb-4">For Students</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></div>
                  <span className="text-gray-300">Browse thousands of courses across various topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></div>
                  <span className="text-gray-300">Get 24/7 AI tutor support for any question</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></div>
                  <span className="text-gray-300">Track your progress with detailed analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></div>
                  <span className="text-gray-300">Practice with AI-generated questions</span>
                </li>
              </ul>
              <Link to="/register?role=student" className="btn-primary w-full justify-center flex">
                Start as Student
              </Link>
            </div>

            <div className="card card-hover p-8 border-2 border-green-500/20 hover:border-green-500/40">
              <h3 className="text-2xl font-bold mb-4">For Teachers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <span className="text-gray-300">Create courses with AI-powered content generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <span className="text-gray-300">Auto-generate quizzes and assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <span className="text-gray-300">AI-assisted grading to save time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <span className="text-gray-300">Monitor student progress and engagement</span>
                </li>
              </ul>
              <Link to="/register?role=teacher" className="w-full justify-center flex bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                Start as Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-dark-800">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary-500" />
            <span className="text-lg font-bold">EduAI</span>
          </div>
          <p className="text-gray-400 text-sm">
            Transform education with artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};
