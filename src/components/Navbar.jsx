import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	BookOpen,
	LogOut,
	User,
	Home,
	BookMarked,
	GraduationCap,
} from 'lucide-react';

export const Navbar = () => {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<nav className="glass-card sticky top-0 z-50 border-b bg-violet-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link
						to="/"
						className="flex items-center space-x-2 group">
						<div className="p-2 rounded-lg group-hover:shadow-lg border-2 border-transparent hover:border-white transition-all duration-150">
							<GraduationCap className="w-6 h-6 text-white border-white rounded" />
						</div>
						<span className="text-xl font-bold bg-clip-text text-white">
							EduLearn
						</span>
					</Link>

					<div className="flex items-center space-x-6">
						{isAuthenticated ? (
							<>
								<Link
									to={
										user.role === 'teacher'
											? '/teacher/dashboard'
											: '/student/dashboard'
									}
									className="flex items-center space-x-1 text-gray-100 hover:text-primary-600 transition-colors">
									<Home className="w-5 h-5" />
									<span>Dashboard</span>
								</Link>

								<Link
									to="/courses"
									className="flex items-center space-x-1 text-gray-100 hover:text-primary-600 transition-colors">
									<BookMarked className="w-5 h-5" />
									<span>Courses</span>
								</Link>

								<div className="flex items-center space-x-3">
									<Link
										to="/profile"
										className="flex items-center space-x-2 text-gray-100 hover:text-primary-600 transition-colors">
										<img
											src={user.avatar}
											alt={user.name}
											className="w-8 h-8 rounded-full border-2 border-primary-200"
										/>
										<span className="font-medium">
											{user.name}
										</span>
									</Link>

									<button
										onClick={handleLogout}
										className="flex items-center space-x-1 text-gray-100 hover:text-red-600 transition-colors">
										<LogOut className="w-5 h-5" />
									</button>
								</div>
							</>
						) : (
							<>
								<Link
									to="/courses"
									className="flex items-center space-x-1 text-gray-100 hover:text-primary-600 transition-colors">
									<BookOpen className="w-5 h-5" />
									<span>Courses</span>
								</Link>
								<Link
									to="/login"
									className="text-gray-100 hover:text-white font-medium">
									Login
								</Link>
								<Link
									to="/register"
									className="text-white">
									Get Started
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
