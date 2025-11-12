import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (profile?.role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
};
