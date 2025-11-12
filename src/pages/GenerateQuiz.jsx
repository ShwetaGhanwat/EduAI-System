import { useState } from 'react';
import { aiService } from '../services/aiService';
import {
	CheckSquare,
	Loader,
	Sparkles,
	Download,
} from 'lucide-react';

export const GenerateQuiz = () => {
	const [formData, setFormData] = useState({
		topic: '',
		numQuestions: '5',
		difficulty: 'medium',
	});
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setQuiz(null);

		const response = await aiService.generateQuiz(
			formData.topic,
			parseInt(formData.numQuestions),
			formData.difficulty
		);

		if (response.success && Array.isArray(response.data)) {
			setQuiz(response.data);
		} else {
			alert('Error generating quiz. Please try again.');
		}

		setLoading(false);
	};

	const handleDownload = () => {
		const content = JSON.stringify(quiz, null, 2);
		const blob = new Blob([content], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `quiz-${formData.topic.replace(
			/\s+/g,
			'-'
		)}.json`;
		a.click();
	};

	return (
		<div className="min-h-screen py-8 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
							<CheckSquare className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-3xl font-bold text-gray-900">
							Generate Quiz
						</h1>
					</div>
					<p className="text-gray-600">
						Auto-generate quiz questions with AI
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					<div className="glass-card rounded-2xl p-6">
						<form
							onSubmit={handleSubmit}
							className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Quiz Topic
								</label>
								<input
									type="text"
									value={formData.topic}
									onChange={(e) =>
										setFormData({
											...formData,
											topic: e.target.value,
										})
									}
									className="input-field"
									placeholder="e.g., JavaScript Arrays"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Number of Questions
								</label>
								<input
									type="number"
									value={formData.numQuestions}
									onChange={(e) =>
										setFormData({
											...formData,
											numQuestions:
												e.target.value,
										})
									}
									className="input-field"
									min="3"
									max="20"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Difficulty
								</label>
								<select
									value={formData.difficulty}
									onChange={(e) =>
										setFormData({
											...formData,
											difficulty:
												e.target.value,
										})
									}
									className="input-field">
									<option value="easy">Easy</option>
									<option value="medium">
										Medium
									</option>
									<option value="hard">Hard</option>
								</select>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
								{loading ? (
									<>
										<Loader className="w-5 h-5 animate-spin" />
										Generating...
									</>
								) : (
									<>
										<Sparkles className="w-5 h-5" />
										Generate Quiz
									</>
								)}
							</button>
						</form>
					</div>

					<div className="lg:col-span-2 glass-card rounded-2xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-gray-900">
								Generated Questions
							</h2>
							{quiz && (
								<button
									onClick={handleDownload}
									className="flex items-center gap-2 text-sm bg-white hover:bg-violet-100 rounded py-2">
									<Download className="w-4 h-4" />
									Download
								</button>
							)}
						</div>

						{loading ? (
							<div className="flex items-center justify-center py-12">
								<Loader className="w-8 h-8 text-primary-600 animate-spin" />
							</div>
						) : quiz ? (
							<div className="space-y-6 max-h-[600px] overflow-y-auto">
								{quiz.map((q, index) => (
									<div
										key={index}
										className="bg-gray-50 rounded-lg p-6">
										<div className="flex items-start gap-3 mb-4">
											<div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
												{index + 1}
											</div>
											<div className="flex-1">
												<p className="font-semibold text-gray-900 mb-3">
													{q.question}
												</p>

												<div className="space-y-2">
													{q.options?.map(
														(
															option,
															optIndex
														) => (
															<div
																key={
																	optIndex
																}
																className={`p-3 rounded-lg border-2 ${
																	optIndex ===
																	q.correct
																		? 'border-green-500 bg-green-50'
																		: 'border-gray-200 bg-white'
																}`}>
																<div className="flex items-center gap-2">
																	<span className="font-semibold text-gray-700">
																		{String.fromCharCode(
																			65 +
																				optIndex
																		)}

																		.
																	</span>
																	<span className="text-gray-900">
																		{
																			option
																		}
																	</span>
																	{optIndex ===
																		q.correct && (
																		<span className="ml-auto text-green-600 text-sm font-semibold">
																			Correct
																		</span>
																	)}
																</div>
															</div>
														)
													)}
												</div>

												{q.explanation && (
													<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
														<p className="text-sm text-blue-900">
															<span className="font-semibold">
																Explanation:
															</span>{' '}
															{
																q.explanation
															}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12 text-gray-400">
								<CheckSquare className="w-12 h-12 mx-auto mb-2" />
								<p>
									Your generated quiz will appear
									here
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
