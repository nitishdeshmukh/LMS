import React, { useState } from 'react';
import {
  PlayCircle,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Infinity,
  Menu,
  X,
  ShieldCheck,
  Share2,
  Briefcase,
  CreditCard,
  Tag,
  Zap,
  BookOpen,
  Code,
  Database,
  Brain,
  BarChart
} from 'lucide-react';

const DataScience = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // --- UPDATED DATA FOR DATA SCIENCE ROADMAP ---
  const courseDetails = {
    title: "Data Science, ML & AI Self-Paced Internship",
    subtitle: "A rigorous 60-Day Roadmap. Master Python, Statistics, Machine Learning, Deep Learning, and Generative AI to build intelligent systems.",
    lastUpdated: "November 2025",
    price: "₹500",
    originalPrice: "₹5000",
    discount: "Pay 10% Now",
  };

  const learningPoints = [
    "Python for Data Science (NumPy, Pandas)",
    "Data Visualization & Exploratory Data Analysis",
    "Statistical Analysis & Hypothesis Testing",
    "Machine Learning Algorithms (Regression, Classification, Clustering)",
    "Deep Learning with TensorFlow/Keras",
    "NLP & Generative AI (LLMs, RAG, OpenAI API)",
    "SQL & Database Management for Data Science",
    "Model Deployment with Streamlit"
  ];

  // 60-Day Data Science Roadmap Data - SIMPLIFIED FORMAT
  const curriculum = [
    {
      id: 1,
      title: "Module 1: Python Core & Logic Building",
      timeline: "Days 1-5",
      topics: [
        "Variables, Data Types, & Operators",
        "Control Flow (If-Else) & Loops",
        "Functions & Lambda Expressions",
        "Data Structures: Lists, Dictionaries, Sets"
      ],
      practice: "Inventory Manager: Create a program using a Dictionary to store items. Implement functions to add items, remove items, and check stock levels."
    },
    {
      id: 2,
      title: "Module 2: Advanced Python & NumPy",
      timeline: "Days 6-10",
      topics: [
        "Object-Oriented Programming (OOP)",
        "File Handling & Exception Handling",
        "NumPy Basics: Arrays, Reshape, Slicing",
        "Broadcasting & Matrix Operations"
      ],
      practice: "Matrix Operator: Create a class that accepts a list of numbers, converts it to a NumPy array, reshapes it to a 3x3 matrix, and calculates its Determinant."
    },
    {
      id: 3,
      title: "Module 3: Pandas Mastery & Data Cleaning",
      timeline: "Days 11-15",
      topics: [
        "DataFrames & Series",
        "Reading CSV/Excel & Handling Missing Data",
        "GroupBy, Merging, & Concatenating",
        "Data Cleaning Techniques"
      ],
      practice: "Sales Cleaner: Write a script to clean a sales dataset: drop rows with missing IDs, convert dates, and calculate total sales per city using groupby."
    },
    {
      id: 4,
      title: "Module 4: Statistics & Probability",
      timeline: "Days 16-20",
      topics: [
        "Descriptive Stats (Mean, Median, Std Dev)",
        "Probability Distributions (Normal, Binomial)",
        "Hypothesis Testing (T-Test, P-Value)",
        "Correlation vs Covariance"
      ],
      practice: "Hypothesis Tester: Generate two random datasets. Perform a T-test to check if there is a statistically significant difference between their means."
    },
    {
      id: 5,
      title: "Module 5: EDA & Visualization",
      timeline: "Days 21-25",
      topics: [
        "Matplotlib (Line, Bar, Subplots)",
        "Seaborn (Heatmaps, Pairplots, Boxplots)",
        "Interactive Charts with Plotly",
        "Feature Engineering & Scaling"
      ],
      practice: "Interactive Dashboard: Use Plotly Express to create an interactive Scatter plot of a dataset (e.g., Tips), visualizing relationships between variables."
    },
    {
      id: 6,
      title: "Module 6: Supervised Learning - Regression",
      timeline: "Days 26-30",
      topics: [
        "Linear Regression Math & Gradient Descent",
        "Train-Test Split & Cost Functions",
        "Polynomial Regression",
        "Evaluation Metrics (MAE, MSE, R2 Score)"
      ],
      practice: "Car Price Predictor: Build a Linear Regression model using Scikit-Learn to predict car prices based on features like Mileage and Age. Evaluate with R2 score."
    },
    {
      id: 7,
      title: "Module 7: Supervised Learning - Classification",
      timeline: "Days 31-35",
      topics: [
        "Logistic Regression & Sigmoid Function",
        "KNN, SVM, & Naive Bayes",
        "Confusion Matrix, Precision, Recall",
        "F1-Score & ROC Curves"
      ],
      practice: "Heart Disease Classifier: Train a Logistic Regression model on a health dataset. Generate a Confusion Matrix and explain the impact of False Negatives."
    },
    {
      id: 8,
      title: "Module 8: Advanced ML (Trees & Tuning)",
      timeline: "Days 36-40",
      topics: [
        "Decision Trees & Random Forest",
        "XGBoost & Gradient Boosting",
        "Hyperparameter Tuning (GridSearchCV)",
        "Unsupervised Learning (K-Means, PCA)"
      ],
      practice: "Customer Segmentation: Apply K-Means Clustering to a customer dataset. Use the Elbow Method to find the optimal number of clusters and visualize them."
    },
    {
      id: 9,
      title: "Module 9: SQL & Database Management",
      timeline: "Days 41-45",
      topics: [
        "SQL Basics: SELECT, WHERE, JOINs",
        "Aggregations: GROUP BY, HAVING",
        "Window Functions (Rank, Row_Number)",
        "Connecting Python to SQL"
      ],
      practice: "SQL Analysis: Create a mini database for a company. Write a query to find departments where the average salary exceeds a specific threshold."
    },
    {
      id: 10,
      title: "Module 10: Deep Learning Fundamentals",
      timeline: "Days 46-50",
      topics: [
        "Neural Networks (Neurons, Weights, Biases)",
        "Activation Functions & Backpropagation",
        "TensorFlow/Keras Fundamentals",
        "CNNs (Convolutional Neural Networks)"
      ],
      practice: "Digit Recognizer: Build and train a Neural Network using Keras to classify handwritten digits from the MNIST dataset with >95% accuracy."
    },
    {
      id: 11,
      title: "Module 11: NLP & Generative AI",
      timeline: "Days 51-55",
      topics: [
        "Text Preprocessing & Tokenization",
        "Word Embeddings & Transformers (BERT)",
        "OpenAI API & Large Language Models",
        "RAG (Retrieval-Augmented Generation)"
      ],
      practice: "Smart Summary Bot: Use the OpenAI API or a Hugging Face model to build a script that summarizes long text articles into concise bullet points."
    },
    {
      id: 12,
      title: "Module 12: The Final Capstone & Portfolio",
      timeline: "Days 56-60",
      topics: [
        "End-to-End Data Pipeline Creation",
        "Model Deployment (Streamlit/Gradio)",
        "Documentation & Storytelling",
        "Portfolio Presentation"
      ],
      practice: "Final Deliverable: Build a complete AI app (e.g., Movie Recommender, Stock Forecaster, or Resume Scanner) with a Streamlit UI. Submit GitHub Repo + Demo Video."
    }
  ];

  const benefitsAfterPayment = [
    "Fully Verifiable Internship Certificate (Verifiable on website)",
    "Skill Certificate to prove your technical expertise",
    "Official Letter of Recommendation (LOR)",
    "Premium Benefits worth ₹20,000 (Resume, LinkedIn, Mock Interviews)"
  ];

  const toggleModule = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">


      {/* --- MAIN CONTAINER --- */}
      <div className="pt-20 pb-20">

        {/* Hero Banner (Dark Theme) */}
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-4">
                <span>Internship</span>
                <span>•</span>
                <span>Data Science</span>
                <span>•</span>
                <span>AI & ML</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{courseDetails.title}</h1>
              <p className="text-lg text-zinc-300 mb-6 leading-relaxed">{courseDetails.subtitle}</p>

              <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} /> Last updated {courseDetails.lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} /> Job Ready Curriculum
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* --- LEFT COLUMN (Course Info) --- */}
            <div className="lg:col-span-2 space-y-12">

              {/* Payment Structure Info Box */}
              <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-3 text-blue-100 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-400" /> How the Payment Works
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  You only pay <strong>10% of ({courseDetails.price})</strong> now to enroll and start the internship. The course content itself is a curated roadmap of high-quality, freely available resources. We do not charge for the content.
                  <br /><br />
                  The fee covers our <strong>LMS infrastructure, progress tracking, and the verification systems</strong>. You will pay the remaining amount only after completing the internship to unlock your certificates and premium career benefits.
                </p>
              </div>

              {/* What you'll learn */}
              <div className="relative overflow-hidden p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30">
                {/* Decorational background blobs */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 flex items-center gap-3">
                  <Zap className="text-yellow-400 fill-yellow-400" size={28} />
                  Master Data & AI
                </h2>

                <div className="grid grid-cols-1  gap-6 relative z-10">
                  {learningPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group cursor-default">
                      <div className="mt-1 p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors shrink-0">
                        <CheckCircle size={18} className="text-blue-400 group-hover:text-blue-300" />
                      </div>
                      <span className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed pt-1 group-hover:text-white transition-colors">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Internship Roadmap</h2>
                <div className="flex justify-between text-sm text-zinc-400 mb-4">
                  <span>60-Day Plan • 12 Modules</span>
                </div>

                <div className="border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900/20">
                  {curriculum.map((module) => (
                    <div key={module.id} className="border-b border-zinc-700 last:border-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-5 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${expandedModule === module.id ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                            {expandedModule === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                          <div>
                            <span className="font-bold block text-lg">{module.title}</span>
                            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{module.timeline}</span>
                          </div>
                        </div>
                      </button>

                      {expandedModule === module.id && (
                        <div className="bg-black/50 border-t border-zinc-800 divide-y divide-zinc-800/50">

                          {/* TOPICS SECTION */}
                          <div className="p-5">
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <BookOpen size={14} /> Course Topics
                            </h4>
                            <ul className="space-y-2 pl-2">
                              {module.topics.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0"></div>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* PRACTICE SECTION */}
                          <div className="p-5 bg-blue-900/5">
                            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                              <Code size={14} /> Hands-on Practice
                            </h4>
                            <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-green-500/30 pl-3">
                              {module.practice}
                            </p>
                          </div>

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Benefits Section */}
              <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award size={24} className="text-yellow-500" /> Unlocked After Full Payment
                </h2>
                <div className="space-y-4">
                  {benefitsAfterPayment.map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-black/40 border border-zinc-800">
                      <div className="mt-1 bg-green-500/20 p-1 rounded-full text-green-500">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-zinc-300 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-zinc-500 text-center">
                  Use your coupon code (which you will get from any existing paid user) to redeem the ₹20,000 worth of premium benefits on LMS.
                </p>
              </div>

            </div>

            {/* --- RIGHT COLUMN (Sticky Pricing Card) --- */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
                {/* Preview Video Placeholder */}
                

                <div className="p-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold text-white">₹50</span>
                    <span className="text-zinc-500 line-through text-lg mb-1">{courseDetails.originalPrice}</span>
                  </div>
                  <p className="text-green-400 font-bold  mb-6">Pay just 10% to Start Learning</p>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors shadow-lg shadow-blue-600/25">
                    Enroll Now
                  </button>

                  {/* Coupon Code Section */}
                  <div className="mb-6">
                    {!showCouponInput ? (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="text-blue-400 text-sm hover:underline flex items-center gap-2 mx-auto"
                      >
                        <Tag size={16} /> Have a coupon code?
                      </button>
                    ) : (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors border border-zinc-700">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-zinc-500 text-xs mb-6">Secure Payment • Instant Access</p>

                  <div className="space-y-4 border-t border-zinc-800 pt-6">
                    <h4 className="font-bold text-sm text-white">This Internship includes:</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                      <li className="flex items-center gap-3"><Infinity size={16} /> 60-Day Structured Roadmap</li>
                      <li className="flex items-center gap-3"><Video size={16} /> Curated Free Resources</li>
                      <li className="flex items-center gap-3"><Briefcase size={16} /> Capstone Project</li>
                      <li className="flex items-center gap-3"><Award size={16} /> Internship Certificate (Post-Completion)</li>
                      <li className="flex items-center gap-3"><FileText size={16} /> Letter of Recommendation</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <button className="hover:text-blue-400 transition-colors flex items-center gap-2"><Share2 size={16} /> Share</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div> {/* Correctly closing the main content wrapper div */}

    </div>
  );
};

export default DataScience;