export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const initializeData = () => {
  if (!storage.get('users')) {
    storage.set('users', [
      {
        id: '1',
        email: 'teacher@demo.com',
        password: 'password',
        name: 'Sarah Johnson',
        role: 'teacher',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
        bio: 'Passionate educator with 10+ years of experience in online teaching.'
      },
      {
        id: '2',
        email: 'student@demo.com',
        password: 'password',
        name: 'Alex Chen',
        role: 'student',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
        bio: 'Enthusiastic learner exploring new technologies and skills.'
      }
    ]);
  }

  if (!storage.get('courses')) {
    storage.set('courses', [
      {
        id: '1',
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React, including components, hooks, and state management. Build modern web applications with confidence.',
        teacherId: '1',
        teacherName: 'Sarah Johnson',
        image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Web Development',
        level: 'Beginner',
        duration: '8 weeks',
        enrolled: 234,
        rating: 4.8,
        modules: [
          {
            id: 'm1',
            title: 'Getting Started with React',
            lessons: [
              { id: 'l1', title: 'What is React?', duration: '15 min', completed: false },
              { id: 'l2', title: 'Setting up your environment', duration: '20 min', completed: false },
              { id: 'l3', title: 'Your first React component', duration: '25 min', completed: false }
            ]
          },
          {
            id: 'm2',
            title: 'React Components',
            lessons: [
              { id: 'l4', title: 'Functional Components', duration: '30 min', completed: false },
              { id: 'l5', title: 'Props and State', duration: '35 min', completed: false }
            ]
          },
          {
            id: 'm3',
            title: 'React Hooks',
            lessons: [
              { id: 'l6', title: 'useState Hook', duration: '25 min', completed: false },
              { id: 'l7', title: 'useEffect Hook', duration: '30 min', completed: false }
            ]
          }
        ],
        assignments: [
          {
            id: 'a1',
            title: 'Build a Todo App',
            description: 'Create a functional todo application using React hooks',
            dueDate: '2025-12-01',
            points: 100
          }
        ]
      },
      {
        id: '2',
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts including async programming, closures, and modern ES6+ features.',
        teacherId: '1',
        teacherName: 'Sarah Johnson',
        image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Programming',
        level: 'Advanced',
        duration: '6 weeks',
        enrolled: 189,
        rating: 4.9,
        modules: [
          {
            id: 'm1',
            title: 'Async JavaScript',
            lessons: [
              { id: 'l1', title: 'Promises', duration: '30 min', completed: false },
              { id: 'l2', title: 'Async/Await', duration: '25 min', completed: false }
            ]
          }
        ],
        assignments: []
      },
      {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the principles of great user interface and user experience design. Create beautiful, functional designs.',
        teacherId: '1',
        teacherName: 'Sarah Johnson',
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Design',
        level: 'Beginner',
        duration: '4 weeks',
        enrolled: 156,
        rating: 4.7,
        modules: [
          {
            id: 'm1',
            title: 'Design Principles',
            lessons: [
              { id: 'l1', title: 'Color Theory', duration: '20 min', completed: false },
              { id: 'l2', title: 'Typography', duration: '25 min', completed: false }
            ]
          }
        ],
        assignments: []
      }
    ]);
  }

  if (!storage.get('enrollments')) {
    storage.set('enrollments', [
      {
        id: 'e1',
        userId: '2',
        courseId: '1',
        enrolledAt: new Date().toISOString(),
        progress: 0
      }
    ]);
  }

  if (!storage.get('submissions')) {
    storage.set('submissions', []);
  }

  if (!storage.get('quizResults')) {
    storage.set('quizResults', []);
  }
};
