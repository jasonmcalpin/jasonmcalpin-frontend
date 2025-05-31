import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  Code,
  BarChart3,
  Users,
  Lightbulb,
  CheckCircle,
  Circle,
  Star,
  ArrowRight,
  Brain,
  Zap,
  Trophy,
} from 'lucide-react';

interface UserResponse {
  [key: string]: number;
}

const EDALesson: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [userResponses, setUserResponses] = useState<UserResponse>({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const steps = [
    {
      id: 'intro',
      title: 'Welcome to EDA Portfolio Builder',
      icon: <Brain className="w-6 h-6" />,
      type: 'intro',
    },
    {
      id: 'assessment',
      title: 'Skill Assessment',
      icon: <Target className="w-6 h-6" />,
      type: 'quiz',
    },
    {
      id: 'planning',
      title: 'Portfolio Planning',
      icon: <BookOpen className="w-6 h-6" />,
      type: 'interactive',
    },
    {
      id: 'project-selection',
      title: 'Project Selection',
      icon: <Star className="w-6 h-6" />,
      type: 'selection',
    },
    {
      id: 'technical-setup',
      title: 'Technical Setup',
      icon: <Code className="w-6 h-6" />,
      type: 'tutorial',
    },
    {
      id: 'eda-process',
      title: 'EDA Methodology',
      icon: <BarChart3 className="w-6 h-6" />,
      type: 'process',
    },
    {
      id: 'presentation',
      title: 'Portfolio Presentation',
      icon: <Users className="w-6 h-6" />,
      type: 'guidance',
    },
  ];

  const projectTemplates = [
    {
      id: 'customer-analytics',
      title: 'Customer Analytics Deep Dive',
      difficulty: 'Beginner',
      domain: 'Business',
      description: 'Analyze customer behavior patterns, segmentation, and lifetime value',
      techniques: ['Customer Segmentation', 'RFM Analysis', 'Cohort Analysis'],
      datasets: ['E-commerce transactions', 'Customer demographics', 'Purchase history'],
      deliverables: [
        'Customer segments',
        'Churn prediction insights',
        'Revenue optimization recommendations',
      ],
    },
    {
      id: 'healthcare-outcomes',
      title: 'Healthcare Outcomes Analysis',
      difficulty: 'Intermediate',
      domain: 'Healthcare',
      description: 'Explore patient outcomes, treatment effectiveness, and healthcare disparities',
      techniques: ['Survival Analysis', 'Statistical Testing', 'Geographic Analysis'],
      datasets: ['Patient records', 'Treatment outcomes', 'Hospital performance data'],
      deliverables: [
        'Treatment effectiveness study',
        'Geographic health disparities',
        'Cost-benefit analysis',
      ],
    },
    {
      id: 'financial-markets',
      title: 'Financial Market Trends',
      difficulty: 'Advanced',
      domain: 'Finance',
      description: 'Analyze market volatility, sector performance, and investment opportunities',
      techniques: ['Time Series Analysis', 'Volatility Modeling', 'Portfolio Analysis'],
      datasets: ['Stock prices', 'Trading volumes', 'Economic indicators'],
      deliverables: [
        'Market trend analysis',
        'Risk assessment model',
        'Investment recommendations',
      ],
    },
  ];

  const skillQuestions = [
    {
      question: "What's your experience with Python/R for data analysis?",
      options: ['Complete beginner', 'Some basics', 'Intermediate', 'Advanced'],
      key: 'programming',
    },
    {
      question: 'How comfortable are you with statistics?',
      options: ['No experience', 'Basic concepts', 'Intermediate', 'Advanced'],
      key: 'statistics',
    },
    {
      question: 'Experience with data visualization?',
      options: ['None', 'Basic charts', 'Advanced plots', 'Interactive dashboards'],
      key: 'visualization',
    },
  ];

  const getAIFeedback = (step: string, responses: UserResponse) => {
    const feedbacks = {
      assessment: {
        beginner:
          "Great starting point! I'll focus on foundational concepts and provide extra guidance on Python basics and statistical fundamentals.",
        intermediate:
          "Perfect! You have solid fundamentals. We'll build on your existing skills and introduce more advanced techniques.",
        advanced:
          "Excellent background! I'll challenge you with complex projects and focus on portfolio presentation and storytelling.",
      },
      planning: {
        business:
          "Business-focused portfolios are highly valued! I'll help you demonstrate ROI and business impact in your analyses.",
        research:
          "Research portfolios showcase analytical rigor! We'll emphasize methodology and statistical significance.",
        technical:
          "Technical portfolios highlight your coding skills! We'll focus on clean code, reproducibility, and advanced techniques.",
      },
    };

    if (step === 'assessment') {
      const avgScore =
        Object.values(responses).reduce((sum, val) => sum + val, 0) / Object.keys(responses).length;
      if (avgScore <= 1) return feedbacks.assessment.beginner;
      if (avgScore <= 2.5) return feedbacks.assessment.intermediate;
      return feedbacks.assessment.advanced;
    }

    return "I'm analyzing your responses to provide personalized recommendations...";
  };

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleQuizResponse = (questionKey: string, answerIndex: number) => {
    setUserResponses(prev => ({
      ...prev,
      [questionKey]: answerIndex,
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">AI-Powered EDA Portfolio Builder</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                I'm your AI tutor that will guide you through creating a professional exploratory
                data analysis portfolio. I'll provide personalized recommendations based on your
                skill level and career goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <Zap className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Personalized Learning</h3>
                <p className="text-sm text-gray-600">
                  Adaptive curriculum based on your current skills
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <Trophy className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Project Templates</h3>
                <p className="text-sm text-gray-600">
                  Ready-to-use project structures and datasets
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Industry Ready</h3>
                <p className="text-sm text-gray-600">Portfolio optimized for data science roles</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => handleStepComplete('intro')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center mx-auto gap-2"
              >
                Start Building My Portfolio <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Let's Assess Your Current Skills</h2>
              <p className="text-gray-600">This helps me customize the tutorial to your level</p>
            </div>

            <div className="space-y-6">
              {skillQuestions.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">{q.question}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizResponse(q.key, optIdx)}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          userResponses[q.key] === optIdx
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(userResponses).length === skillQuestions.length && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">AI Analysis</h4>
                      <p className="text-blue-800 text-sm mt-1">
                        {getAIFeedback('assessment', userResponses)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStepComplete('assessment')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Portfolio Planning
                </button>
              </div>
            )}
          </div>
        );

      case 'planning':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Portfolio Strategy Planning</h2>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">AI Recommendation</h3>
                  <p className="text-gray-700">
                    Based on your skill assessment, I recommend focusing on{' '}
                    <strong>intermediate-level projects</strong>
                    that showcase both technical skills and business acumen. Your portfolio should
                    include 4-5 diverse projects demonstrating progression from basic EDA to
                    advanced analytical techniques.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Recommended Portfolio Structure</h3>
                <div className="space-y-3">
                  {[
                    'Foundation Project (Data cleaning & basic EDA)',
                    'Business Analytics Project (Customer/Sales analysis)',
                    'Statistical Analysis Project (Hypothesis testing)',
                    'Advanced Visualization Project (Interactive dashboards)',
                    'Domain Expertise Project (Your industry focus)',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">{idx + 1}</span>
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Success Metrics</h3>
                <div className="space-y-2">
                  {[
                    'Clear problem statements',
                    'Clean, documented code',
                    'Compelling visualizations',
                    'Actionable insights',
                    'Business impact focus',
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStepComplete('planning')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Project Selection
            </button>
          </div>
        );

      case 'project-selection':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Choose Your First Project</h2>
            <p className="text-gray-600 mb-6">
              I've curated these projects based on your skill level. Each includes datasets,
              methodology, and expected deliverables.
            </p>

            <div className="grid gap-6">
              {projectTemplates.map(project => (
                <div
                  key={project.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedProject === project.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          project.difficulty === 'Beginner'
                            ? 'bg-green-100 text-green-800'
                            : project.difficulty === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {project.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        {project.domain}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Key Techniques</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.techniques.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">Expected Deliverables</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {project.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Circle className="w-2 h-2 fill-current" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedProject && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Great Choice!</h4>
                    <p className="text-green-800 text-sm mt-1">
                      I'll provide step-by-step guidance for this project, including code templates,
                      dataset suggestions, and milestone checkpoints.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleStepComplete('project-selection')}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Start This Project
                </button>
              </div>
            )}
          </div>
        );

      case 'technical-setup':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Technical Environment Setup</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <Code className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">AI Setup Assistant</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    I'll guide you through setting up your development environment with all
                    necessary tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Python Environment Setup</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-green-400"># Create virtual environment</div>
                  <div>python -m venv eda_portfolio</div>
                  <div className="mt-2">
                    <div className="text-green-400"># Activate environment</div>
                    <div>source eda_portfolio/bin/activate # Linux/Mac</div>
                    <div>eda_portfolio\Scripts\activate # Windows</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-green-400"># Install essential packages</div>
                    <div>pip install pandas numpy matplotlib seaborn plotly jupyter</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  This creates an isolated environment for your EDA projects with all essential
                  libraries.
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Project Structure Template</h3>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div>my-eda-portfolio/</div>
                  <div className="ml-4">├── README.md</div>
                  <div className="ml-4">├── requirements.txt</div>
                  <div className="ml-4">├── data/</div>
                  <div className="ml-8">├── raw/</div>
                  <div className="ml-8">└── processed/</div>
                  <div className="ml-4">├── notebooks/</div>
                  <div className="ml-4">├── src/</div>
                  <div className="ml-4">└── reports/</div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Essential Jupyter Extensions</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-green-400"># Install Jupyter extensions</div>
                  <div>pip install jupyterlab-git nbextensions</div>
                  <div>jupyter labextension install @jupyterlab/toc</div>
                </div>
                <div className="text-sm text-gray-600">
                  These extensions add version control, table of contents, and other productivity
                  features.
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStepComplete('technical-setup')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Environment Ready - Continue to EDA Process
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">More Modules Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              Continue building your EDA portfolio with the guidance you've received so far.
            </p>
            <button
              onClick={() => setCurrentStep(0)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Restart Tutorial
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50">
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EDA Portfolio AI Tutor</h1>
          <p className="text-gray-600">
            Your intelligent guide to building a professional data analysis portfolio
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Progress */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h3 className="font-semibold mb-4">Tutorial Progress</h3>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      idx === currentStep
                        ? 'bg-blue-50 border border-blue-200'
                        : completedSteps.has(step.id)
                          ? 'bg-green-50 border border-green-200'
                          : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentStep(idx)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        completedSteps.has(step.id)
                          ? 'bg-green-500 text-white'
                          : idx === currentStep
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {completedSteps.has(step.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-medium text-sm ${
                          idx === currentStep ? 'text-blue-900' : 'text-gray-700'
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg p-8">{renderStepContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDALesson;
