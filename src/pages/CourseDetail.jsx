import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BarChart, BookOpen, Users, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CourseDetail = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:teacher_id (full_name),
          enrollments (count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('student_id', profile.id)
        .maybeSingle();

      setIsEnrolled(!!data);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            student_id: profile.id,
            course_id: id,
            progress: 0
          }
        ]);

      if (error) throw error;
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-8 flex justify-center">
          <LoadingSpinner size="lg" text="Loading course..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-400">Course not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={course.image_url || 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={course.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
            />

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>

            <div className="flex items-center gap-4 mb-6 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.enrollments?.[0]?.count || 0} students
              </span>
              {course.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
              )}
              {course.level && (
                <span className="px-2 py-1 rounded bg-primary-500/10 text-primary-500 text-xs font-medium">
                  {course.level}
                </span>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">About this course</h2>
              <p className="text-gray-300 leading-relaxed">{course.description}</p>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <p className="text-gray-400">Course modules and lessons will appear here once added by the instructor.</p>
            </div>
          </div>

          <div>
            <div className="card sticky top-24">
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Instructor</p>
                <p className="font-semibold">{course.profiles?.full_name || 'Anonymous'}</p>
              </div>

              {profile?.role === 'student' && (
                <>
                  {isEnrolled ? (
                    <button className="w-full btn-primary flex items-center justify-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5" />
                      Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full btn-primary mb-4"
                    >
                      {enrolling ? <LoadingSpinner size="sm" /> : 'Enroll Now'}
                    </button>
                  )}
                </>
              )}

              <div className="space-y-3 pt-4 border-t border-dark-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Category</span>
                  <span className="font-medium">{course.category || 'General'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Level</span>
                  <span className="font-medium">{course.level || 'All levels'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-medium">{course.duration || 'Self-paced'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
