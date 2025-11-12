# EduAI - AI-Powered Course Management System

A modern, full-featured course management system built with React, Vite, Tailwind CSS, and Supabase. Features AI-powered tools for both teachers and students.

## Features

### For Students
- Browse and enroll in courses
- Track learning progress
- AI Tutor chatbot for instant help
- Get AI-generated study suggestions
- Practice with AI-generated questions
- Submit assignments and take quizzes

### For Teachers
- Create and manage courses
- AI-powered course outline generation
- Auto-generate quizzes and assignments
- AI-assisted grading
- View student analytics
- Manage course materials

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Configurable (Default: Anthropic Claude)
- **Icons**: Lucide React
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 16+
- A Supabase account and project
- (Optional) Anthropic API key for AI features

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd eduai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_anthropic_api_key
VITE_AI_API_URL=https://api.anthropic.com/v1/messages
VITE_AI_PROVIDER=anthropic
VITE_AI_MODEL=claude-sonnet-4-20250514
```

4. Set up Supabase:

The database migrations are already included. They will be automatically applied when you connect to your Supabase project.

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles with roles (student/teacher)
- `courses` - Course information
- `course_modules` - Course modules/sections
- `lessons` - Individual lessons
- `enrollments` - Student course enrollments
- `assignments` - Course assignments
- `assignment_submissions` - Student submissions
- `quizzes` - Quiz information
- `quiz_questions` - Quiz questions
- `quiz_attempts` - Student quiz attempts

All tables have Row Level Security (RLS) enabled for data protection.

## AI Service Configuration

The AI service is designed to be easily configurable. To switch AI providers:

1. Update the environment variables in `.env`
2. Modify `src/services/aiService.js` if needed for different API formats

Current supported provider: Anthropic Claude

The AI service provides:
- Course outline generation
- Quiz question generation
- Assignment grading assistance
- Lesson plan creation
- Student tutoring
- Study suggestions
- Practice question generation
- Content summarization

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all environment variables from `.env`

### Other Platforms

The application can be deployed to any static hosting service:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

Just make sure to:
1. Build the project (`npm run build`)
2. Set environment variables
3. Configure redirects for client-side routing (use `vercel.json` as reference)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── DashboardLayout.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProtectedRoute.jsx
│   └── Toast.jsx
├── context/            # React context providers
│   └── AuthContext.jsx
├── lib/               # Library configurations
│   └── supabase.js
├── pages/             # Page components
│   ├── AITutor.jsx
│   ├── CourseDetail.jsx
│   ├── CoursesPage.jsx
│   ├── CreateCourse.jsx
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── StudentDashboard.jsx
│   └── TeacherDashboard.jsx
├── services/          # External services
│   └── aiService.js
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_AI_API_KEY` | Your AI provider API key | No* |
| `VITE_AI_API_URL` | AI provider API endpoint | No* |
| `VITE_AI_PROVIDER` | AI provider name | No* |
| `VITE_AI_MODEL` | AI model to use | No* |

*Required for AI features to work

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or production.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Supabase](https://supabase.com/)
- AI by [Anthropic Claude](https://www.anthropic.com/)
- Icons by [Lucide](https://lucide.dev/)
- Images from [Pexels](https://www.pexels.com/)
