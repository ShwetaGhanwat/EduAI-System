const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'anthropic',
  apiKey: import.meta.env.VITE_AI_API_KEY,
  apiUrl: import.meta.env.VITE_AI_API_URL || 'https://api.anthropic.com/v1/messages',
  model: import.meta.env.VITE_AI_MODEL || 'claude-sonnet-4-20250514'
};

const callAI = async (prompt, options = {}) => {
  if (!AI_CONFIG.apiKey) {
    throw new Error('AI API key is not configured. Please add VITE_AI_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_CONFIG.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        max_tokens: options.maxTokens || 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

export const aiService = {
  async generateCourseOutline(topic, duration, level = 'intermediate') {
    const prompt = `Create a comprehensive course outline for a ${level} level course on "${topic}".
    The course should be designed for approximately ${duration}.

    Please provide:
    1. Course title
    2. Brief course description (2-3 sentences)
    3. Learning objectives (4-6 key objectives)
    4. 5-8 modules with titles and brief descriptions
    5. Suggested activities or projects

    Format the response as structured JSON with the following structure:
    {
      "title": "Course Title",
      "description": "Course description",
      "objectives": ["objective1", "objective2", ...],
      "modules": [
        {
          "title": "Module Title",
          "description": "Module description",
          "topics": ["topic1", "topic2", ...]
        }
      ],
      "activities": ["activity1", "activity2", ...]
    }`;

    const response = await callAI(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        title: topic,
        description: response,
        objectives: [],
        modules: [],
        activities: []
      };
    }
  },

  async generateQuiz(topic, numQuestions = 5, difficulty = 'intermediate') {
    const prompt = `Generate ${numQuestions} quiz questions about "${topic}" at ${difficulty} level.

    Include a mix of:
    - Multiple choice questions (provide 4 options)
    - True/False questions
    - Short answer questions

    Format as JSON:
    {
      "questions": [
        {
          "type": "multiple_choice",
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Why this is correct"
        },
        {
          "type": "true_false",
          "question": "Statement",
          "correctAnswer": "true",
          "explanation": "Explanation"
        }
      ]
    }`;

    const response = await callAI(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return { questions: [] };
    }
  },

  async gradeAssignment(assignmentContent, submissionContent, rubric = '') {
    const prompt = `Grade the following student submission based on the assignment requirements.

    Assignment: ${assignmentContent}

    ${rubric ? `Rubric: ${rubric}` : ''}

    Student Submission: ${submissionContent}

    Provide:
    1. Score out of 100
    2. Detailed feedback (strengths and areas for improvement)
    3. Specific suggestions for improvement

    Format as JSON:
    {
      "score": 85,
      "feedback": "Overall feedback...",
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    }`;

    const response = await callAI(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        score: 0,
        feedback: response,
        strengths: [],
        improvements: []
      };
    }
  },

  async generateLessonPlan(topic, duration = '60 minutes', learningObjectives = []) {
    const prompt = `Create a detailed lesson plan for teaching "${topic}".
    Duration: ${duration}
    ${learningObjectives.length > 0 ? `Learning Objectives: ${learningObjectives.join(', ')}` : ''}

    Include:
    1. Introduction (5-10 minutes)
    2. Main content sections with activities
    3. Practice exercises
    4. Assessment methods
    5. Conclusion and homework

    Format as JSON:
    {
      "title": "Lesson Title",
      "objectives": ["objective1", "objective2"],
      "materials": ["material1", "material2"],
      "sections": [
        {
          "title": "Section title",
          "duration": "15 minutes",
          "activities": ["activity1", "activity2"],
          "content": "Detailed content"
        }
      ],
      "assessment": "Assessment method",
      "homework": "Homework assignment"
    }`;

    const response = await callAI(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        title: topic,
        objectives: [],
        materials: [],
        sections: [],
        assessment: '',
        homework: ''
      };
    }
  },

  async chatWithTutor(message, courseContext = '', conversationHistory = []) {
    const contextPrompt = courseContext
      ? `You are an AI tutor helping with a course on "${courseContext}".`
      : 'You are a helpful AI tutor.';

    const historyPrompt = conversationHistory.length > 0
      ? `Previous conversation:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n\n`
      : '';

    const prompt = `${contextPrompt}

    ${historyPrompt}Student question: ${message}

    Provide a clear, educational response that:
    1. Directly answers the question
    2. Provides relevant examples
    3. Encourages deeper understanding
    4. Suggests related topics to explore`;

    return await callAI(prompt, { maxTokens: 2048 });
  },

  async getStudySuggestions(courseContent, studentProgress = {}) {
    const prompt = `Based on this course content and student progress, provide personalized study suggestions.

    Course: ${courseContent}
    ${Object.keys(studentProgress).length > 0 ? `Progress: ${JSON.stringify(studentProgress)}` : ''}

    Provide:
    1. 5-7 key topics to focus on
    2. Recommended study schedule
    3. Practice activities
    4. Resources to explore

    Format as JSON:
    {
      "focusTopics": ["topic1", "topic2", ...],
      "schedule": {
        "week1": "Activities for week 1",
        "week2": "Activities for week 2"
      },
      "activities": ["activity1", "activity2"],
      "resources": ["resource1", "resource2"]
    }`;

    const response = await callAI(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        focusTopics: [],
        schedule: {},
        activities: [],
        resources: []
      };
    }
  },

  async generatePracticeQuestions(topic, count = 5) {
    const prompt = `Generate ${count} practice questions about "${topic}" for self-study.

    Include:
    - Questions that test understanding
    - Hints for each question
    - Detailed answers with explanations

    Format as JSON:
    {
      "questions": [
        {
          "question": "Question text",
          "hint": "Helpful hint",
          "answer": "Detailed answer with explanation"
        }
      ]
    }`;

    const response = await callAI(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return { questions: [] };
    }
  },

  async summarizeContent(content, maxLength = 'medium') {
    const lengthGuide = {
      short: '2-3 sentences',
      medium: '1 paragraph',
      long: '2-3 paragraphs'
    };

    const prompt = `Summarize the following content in ${lengthGuide[maxLength] || lengthGuide.medium}:

    ${content}

    Focus on:
    1. Main concepts
    2. Key takeaways
    3. Important details`;

    return await callAI(prompt, { maxTokens: 1024 });
  },

  async helpWithAssignment(question, assignmentContext, previousAttempt = '') {
    const prompt = `A student needs help with an assignment.

    Assignment Context: ${assignmentContext}
    ${previousAttempt ? `Previous Attempt: ${previousAttempt}` : ''}

    Student Question: ${question}

    Provide guidance that:
    1. Doesn't give away the complete answer
    2. Helps them think through the problem
    3. Provides relevant hints and examples
    4. Encourages independent problem-solving`;

    return await callAI(prompt, { maxTokens: 2048 });
  }
};

export default aiService;
