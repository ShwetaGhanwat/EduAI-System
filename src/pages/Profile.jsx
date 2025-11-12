import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, Award, Calendar } from 'lucide-react';
import { storage } from '../utils/storage';

export const Profile = () => {
	const { user, updateProfile } = useAuth();
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		bio: user.bio || '',
	});

	const courses = storage.get('courses', []);
	const enrollments = storage.get('enrollments', []);

	const userCourses =
		user.role === 'teacher'
			? courses.filter((c) => c.teacherId === user.id)
			: courses.filter((c) =>
					enrollments.some(
						(e) =>
							e.courseId === c.id &&
							e.userId === user.id
					)
			  );

	const handleSubmit = (e) => {
		e.preventDefault();
		updateProfile(formData);
		setEditing(false);
	};

	return (
		<div className="min-h-screen py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="glass-card rounded-2xl overflow-hidden">
					<div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>

					<div className="px-8 pb-8">
						<div className="flex flex-col md:flex-row gap-6 -mt-16 relative z-10">
							<img
								src={user.avatar}
								alt={user.name}
								className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
							/>

							<div className="flex-1 mt-16 md:mt-0">
								{editing ? (
									<form
										onSubmit={handleSubmit}
										className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Name
											</label>
											<input
												type="text"
												value={formData.name}
												onChange={(e) =>
													setFormData({
														...formData,
														name: e.target
															.value,
													})
												}
												className="input-field"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Bio
											</label>
											<textarea
												value={formData.bio}
												onChange={(e) =>
													setFormData({
														...formData,
														bio: e.target
															.value,
													})
												}
												className="input-field"
												rows="3"
												placeholder="Tell us about yourself..."
											/>
										</div>

										<div className="flex gap-2">
											<button
												type="submit"
												className="btn-primary">
												Save Changes
											</button>
											<button
												type="button"
												onClick={() =>
													setEditing(false)
												}
												className="bg-white hover:bg-violet-100 rounded">
												Cancel
											</button>
										</div>
									</form>
								) : (
									<>
										<div className="flex items-start justify-between mb-4">
											<div>
												<h1 className="text-3xl font-bold text-gray-900 mb-1">
													{user.name}
												</h1>
												<div className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
													{user.role ===
													'teacher'
														? 'Teacher'
														: 'Student'}
												</div>
											</div>
											<button
												onClick={() =>
													setEditing(true)
												}
												className="bg-white hover:bg-violet-100 rounded">
												Edit Profile
											</button>
										</div>

										<p className="text-gray-600 mb-6">
											{user.bio || 'No bio yet'}
										</p>

										<div className="flex items-center gap-2 text-gray-600 mb-2">
											<Mail className="w-5 h-5" />
											<span>{user.email}</span>
										</div>

										<div className="flex items-center gap-2 text-gray-600">
											<Calendar className="w-5 h-5" />
											<span>
												Member since{' '}
												{new Date().getFullYear()}
											</span>
										</div>
									</>
								)}
							</div>
						</div>

						<div className="grid md:grid-cols-3 gap-6 mt-8">
							<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
								<BookOpen className="w-8 h-8 text-blue-600 mb-2" />
								<div className="text-3xl font-bold text-blue-900">
									{userCourses.length}
								</div>
								<div className="text-blue-700">
									{user.role === 'teacher'
										? 'Courses Created'
										: 'Courses Enrolled'}
								</div>
							</div>

							<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
								<Award className="w-8 h-8 text-green-600 mb-2" />
								<div className="text-3xl font-bold text-green-900">
									{Math.floor(
										userCourses.length * 0.5
									)}
								</div>
								<div className="text-green-700">
									{user.role === 'teacher'
										? 'Total Students'
										: 'Certificates'}
								</div>
							</div>

							<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
								<User className="w-8 h-8 text-purple-600 mb-2" />
								<div className="text-3xl font-bold text-purple-900">
									{user.role === 'teacher'
										? '4.8'
										: '87%'}
								</div>
								<div className="text-purple-700">
									{user.role === 'teacher'
										? 'Avg Rating'
										: 'Completion Rate'}
								</div>
							</div>
						</div>

						<div className="mt-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								{user.role === 'teacher'
									? 'My Courses'
									: 'Enrolled Courses'}
							</h2>

							{userCourses.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
									<p>No courses yet</p>
								</div>
							) : (
								<div className="grid md:grid-cols-2 gap-4">
									{userCourses.map((course) => (
										<div
											key={course.id}
											className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
											<img
												src={course.image}
												alt={course.title}
												className="w-20 h-20 rounded-lg object-cover"
											/>
											<div className="flex-1">
												<h3 className="font-semibold text-gray-900 mb-1">
													{course.title}
												</h3>
												<p className="text-sm text-gray-600">
													{course.category}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
