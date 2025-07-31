import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, Code, Cpu, Lightbulb, Layers, Network } from 'lucide-react';
import SEO from '../../components/shared/SEO';

interface LessonCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'data-science' | 'ai' | 'software-engineering';
  comingSoon?: boolean;
}

const Lessons: React.FC = () => {
  const lessonCards: LessonCard[] = [
    // Data Science Path
    {
      id: 'eda-portfolio',
      title: 'EDA Portfolio Builder',
      description:
        'Learn to create professional exploratory data analysis portfolios with interactive guidance.',
      icon: <BarChart3 className="w-10 h-10" />,
      path: '/lessons/eda',
      difficulty: 'intermediate',
      category: 'data-science',
    },
    {
      id: 'data-visualization',
      title: 'Data Visualization Mastery',
      description:
        'Create compelling visualizations that effectively communicate insights from complex datasets.',
      icon: <BarChart3 className="w-10 h-10" />,
      path: '/lessons/data-visualization',
      difficulty: 'intermediate',
      category: 'data-science',
      comingSoon: true,
    },

    // AI Development Path
    {
      id: 'llm-building',
      title: 'Building LLMs',
      description:
        'Learn the fundamentals of building and training large language models from scratch.',
      icon: <Brain className="w-10 h-10" />,
      path: '/lessons/llm-building',
      difficulty: 'advanced',
      category: 'ai',
    },
    {
      id: 'prompt-engineering',
      title: 'Prompt Engineering',
      description:
        'Master the art of crafting effective prompts to get the best results from language models.',
      icon: <Lightbulb className="w-10 h-10" />,
      path: '/lessons/prompt-engineering',
      difficulty: 'beginner',
      category: 'ai',
      comingSoon: true,
    },
    {
      id: 'fine-tuning',
      title: 'Fine-tuning Models',
      description:
        'Learn techniques to customize pre-trained models for specific tasks and domains.',
      icon: <Layers className="w-10 h-10" />,
      path: '/lessons/fine-tuning',
      difficulty: 'advanced',
      category: 'ai',
      comingSoon: true,
    },

    // Software Engineering Path
    {
      id: 'web-development',
      title: 'Web Development Fundamentals',
      description:
        'Build modern, responsive web applications using the latest technologies and best practices.',
      icon: <Code className="w-10 h-10" />,
      path: '/lessons/web-development',
      difficulty: 'beginner',
      category: 'software-engineering',
      comingSoon: true,
    },
    {
      id: 'backend-architecture',
      title: 'Backend Architecture',
      description:
        'Design scalable, maintainable backend systems that can handle complex business requirements.',
      icon: <Network className="w-10 h-10" />,
      path: '/lessons/backend-architecture',
      difficulty: 'intermediate',
      category: 'software-engineering',
      comingSoon: true,
    },
    {
      id: 'devops',
      title: 'DevOps Essentials',
      description:
        'Learn to automate deployment, testing, and infrastructure management for modern applications.',
      icon: <Cpu className="w-10 h-10" />,
      path: '/lessons/devops',
      difficulty: 'intermediate',
      category: 'software-engineering',
      comingSoon: true,
    },
  ];

  const categories = [
    { id: 'data-science', name: 'Data Science', icon: <BarChart3 className="w-6 h-6" /> },
    { id: 'ai', name: 'AI Development', icon: <Brain className="w-6 h-6" /> },
    {
      id: 'software-engineering',
      name: 'Software Engineering',
      icon: <Code className="w-6 h-6" />,
    },
  ];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <div className="bg-gray-50">
      <SEO
        title="Lessons - Interactive Learning Paths"
        description="Explore interactive lessons designed to help you master data science, AI development, and software engineering skills."
      />
      {/* Hero Section */}
      <section className="lessons-hero">
        <div className="lessons-hero__container">
          <h1 className="lessons-hero__title">Lessons</h1>
          <p className="lessons-hero__subtitle">
            Learning paths designed to help you master data science, AI development, and software
            engineering skills.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Interactive Lessons</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive learning paths designed to help you master data science, AI
            development, and software engineering skills.
          </p>
        </div>

        {/* Learning Paths */}
        {categories.map(category => (
          <div key={category.id} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700">{category.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800">{category.name} Path</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonCards
                .filter(card => card.category === category.id)
                .map(card => (
                  <div
                    key={card.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
                      card.comingSoon ? 'opacity-70' : 'hover:shadow-md hover:border-blue-300'
                    }`}
                  >
                    <div className="p-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        {card.icon}
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[card.difficulty]}`}
                        >
                          {difficultyLabels[card.difficulty]}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-6">{card.description}</p>

                      {card.comingSoon ? (
                        <div className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
                          Coming Soon
                        </div>
                      ) : (
                        <Link
                          to={card.path}
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Learning
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-blue-100">
                Subscribe to our newsletter to get notified when new lessons are released.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-l-lg w-full md:w-64 text-gray-800 focus:outline-none"
              />
              <button className="bg-blue-800 hover:bg-blue-900 px-4 py-3 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
