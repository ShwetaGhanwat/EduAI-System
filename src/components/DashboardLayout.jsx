import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, LogOut, User, Book, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = ({ children }) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const studentLinks = [
    { to: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/courses', icon: <Book className="w-5 h-5" />, label: 'Courses' },
    { to: '/ai-tutor', icon: <MessageSquare className="w-5 h-5" />, label: 'AI Tutor' },
  ];

  const teacherLinks = [
    { to: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/my-courses', icon: <Book className="w-5 h-5" />, label: 'My Courses' },
  ];

  const links = profile?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="fixed top-0 w-full bg-dark-900/80 backdrop-blur-lg border-b border-dark-800 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold">EduAI</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link 
              // to="/profile" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors cursor-text">
                <User className="w-5 h-5" />
                <span className=" md:inline text-sm">{profile?.full_name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800 text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};
