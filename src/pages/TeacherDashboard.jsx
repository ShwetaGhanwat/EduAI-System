import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, Plus, Brain } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SkeletonCard } from '../components/LoadingSpinner';

export const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments (count)
        `)
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(coursesData || []);
      const total = coursesData?.reduce((sum, course) => sum + (course.enrollments?.[0]?.count || 0), 0) || 0;
      setTotalStudents(total);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-500" />,
      label: 'Total Courses',
      value: courses.length,
      bgColor: 'bg-primary-500/10'
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      label: 'Total Students',
      value: totalStudents,
      bgColor: 'bg-green-500/10'
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      label: 'Published',
      value: courses.filter(c => c.is_published).length,
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: <Brain className="w-6 h-6 text-yellow-500" />,
      label: 'AI Assists',
      value: courses.length * 12,
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name}!</h1>
            <p className="text-gray-400">Manage your courses and students</p>
          </div>
          <Link to="/create-course" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : courses.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
              <p className="text-gray-400 mb-6">Create your first course to start teaching</p>
              <Link to="/create-course" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Course
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  // to={`/courses/${course.id}/edit`}
                  to={`/courses/${course.id}`}
                  className="card card-hover"
                >
                  <img
                    src={course.image_url || 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      course.is_published
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.enrollments?.[0]?.count || 0}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
