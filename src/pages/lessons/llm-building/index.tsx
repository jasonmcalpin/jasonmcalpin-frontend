import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Code,
  Server,
  Brain,
  Zap,
  CheckCircle,
  ChevronRight,
  Network,
  Shield,
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
  type: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: React.ReactNode;
}

const LLMBuildingLesson: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: Step[] = [
    {
      id: 'intro',
      title: 'Introduction to LLMs',
      icon: <Brain className="w-6 h-6" />,
      type: 'intro',
    },
    {
      id: 'foundations',
      title: 'Theoretical Foundations',
      icon: <BookOpen className="w-6 h-6" />,
      type: 'theory',
    },
    {
      id: 'architecture',
      title: 'Model Architecture',
      icon: <Network className="w-6 h-6" />,
      type: 'technical',
    },
    {
      id: 'training',
      title: 'Training Methodologies',
      icon: <Zap className="w-6 h-6" />,
      type: 'practical',
    },
    {
      id: 'fine-tuning',
      title: 'Fine-tuning Techniques',
      icon: <Code className="w-6 h-6" />,
      type: 'practical',
    },
    {
      id: 'evaluation',
      title: 'Evaluation & Testing',
      icon: <CheckCircle className="w-6 h-6" />,
      type: 'practical',
    },
    {
      id: 'deployment',
      title: 'Deployment Strategies',
      icon: <Server className="w-6 h-6" />,
      type: 'technical',
    },
    {
      id: 'ethics',
      title: 'Ethical Considerations',
      icon: <Shield className="w-6 h-6" />,
      type: 'discussion',
    },
  ];

  const modules: Module[] = [
    {
      id: 'intro',
      title: 'Introduction to Large Language Models',
      description: 'Understanding the fundamentals of LLMs and their capabilities',
      duration: '45 minutes',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Building Large Language Models</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome to this comprehensive course on building Large Language Models (LLMs). You'll
              learn the theory, architecture, training methods, and practical implementation
              details.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Theoretical Foundations</h3>
              <p className="text-sm text-gray-600">
                Learn the mathematical and linguistic principles behind LLMs
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <Code className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Practical Implementation</h3>
              <p className="text-sm text-gray-600">
                Hands-on experience building and training models
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <Server className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Deployment Strategies</h3>
              <p className="text-sm text-gray-600">
                Learn to deploy and scale LLMs in production environments
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="font-semibold mb-3">Course Overview</h3>
            <p className="text-gray-700 mb-4">
              This course is designed for machine learning engineers, data scientists, and
              researchers who want to understand how to build and train large language models from
              scratch. We'll cover everything from the theoretical foundations to practical
              implementation details.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  8 comprehensive modules covering all aspects of LLM development
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Hands-on exercises and code examples using PyTorch and Hugging Face
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Case studies of successful LLM implementations
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Ethical considerations and responsible AI development
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleStepComplete('intro')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center mx-auto gap-2"
            >
              Begin Learning <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'foundations',
      title: 'Theoretical Foundations of LLMs',
      description: 'Exploring the mathematical and linguistic principles behind language models',
      duration: '1.5 hours',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Theoretical Foundations</h2>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">Language Modeling Fundamentals</h3>
            <p className="text-gray-700 mb-4">
              At its core, a language model is a probability distribution over sequences of words or
              tokens. The goal is to predict the next token given the previous tokens in a sequence.
            </p>
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <p className="font-mono text-sm">
                P(token<sub>n</sub> | token<sub>1</sub>, token<sub>2</sub>, ..., token<sub>n-1</sub>
                )
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Neural Network Architectures</h3>
              <p className="text-gray-700 mb-4">
                Modern LLMs are built on transformer architectures, which use self-attention
                mechanisms to process sequences in parallel rather than sequentially.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Self-Attention Mechanism</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Allows the model to weigh the importance of different words in the input when
                      predicting each output word.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Multi-Head Attention</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Allows the model to attend to information from different representation
                      subspaces at different positions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Feed-Forward Networks</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Process the attention outputs and introduce non-linearity into the model.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Tokenization and Embeddings</h3>
              <p className="text-gray-700 mb-4">
                Before processing text, LLMs convert words or subwords into numerical
                representations called tokens.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">A</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Byte-Pair Encoding (BPE)</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      A subword tokenization algorithm that iteratively merges the most frequent
                      pairs of bytes or characters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">B</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">WordPiece</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Similar to BPE but uses a different criterion for merging tokens based on
                      likelihood.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">C</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Embeddings</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Dense vector representations of tokens that capture semantic relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStepComplete('foundations')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
          >
            Continue to Model Architecture
          </button>
        </div>
      ),
    },
    // Additional modules would be defined here
  ];

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(currentIndex + 1);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    const module = modules.find(m => m.id === step.id);

    if (module) {
      return module.content;
    }

    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Module Under Development</h2>
        <p className="text-gray-600 mb-6">
          This module is currently being developed. Check back soon for updates!
        </p>
        <button
          onClick={() => setCurrentStep(0)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Introduction
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Building Large Language Models</h1>
          <p className="text-gray-600">
            A comprehensive guide to understanding, building, and deploying LLMs
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Progress */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h3 className="font-semibold mb-4">Course Modules</h3>
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

export default LLMBuildingLesson;
