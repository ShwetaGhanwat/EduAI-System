import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Clock, Award, ArrowRight, Brain } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LoadingSpinner, SkeletonCard } from '../components/LoadingSpinner';

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          enrolled_at,
          courses (
            id,
            title,
            description,
            image_url,
            category,
            level
          )
        `)
        .eq('student_id', profile.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrolledCourses(data || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-500" />,
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      bgColor: 'bg-primary-500/10'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      label: 'In Progress',
      value: enrolledCourses.filter(e => e.progress > 0 && e.progress < 100).length,
      bgColor: 'bg-green-500/10'
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      label: 'Completed',
      value: enrolledCourses.filter(e => e.progress === 100).length,
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      label: 'Study Hours',
      value: Math.floor(enrolledCourses.length * 8.5),
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name}!</h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Link to="/courses" className="text-primary-500 hover:text-primary-400 flex items-center gap-2">
                Browse More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="card text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
                <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course</p>
                <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
                  Browse Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 4).map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    to={`/courses/${enrollment.courses.id}`}
                    className="card flex items-center gap-4 hover:border-primary-500/50 card-hover"
                  >
                    <img
                      src={enrollment.courses.image_url || 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={enrollment.courses.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{enrollment.courses.title}</h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-1">{enrollment.courses.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-dark-800 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400">{enrollment.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/ai-tutor" className="card card-hover flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Tutor</h3>
                  <p className="text-sm text-gray-400">Get instant help with your studies</p>
                </div>
              </Link>

              <Link to="/courses" className="card card-hover flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Browse Courses</h3>
                  <p className="text-sm text-gray-400">Explore new topics to learn</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
