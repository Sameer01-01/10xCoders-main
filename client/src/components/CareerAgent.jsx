// App.jsx
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your actual API key
const API_KEY = "AIzaSyAFWuD7AvPWLPmk1lkc8o45OUJ9v59Fh6Q";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const questions = [
    "What aspects of technology excite you the most? (e.g., creating visual designs, solving complex problems, working with data, etc.)",
    "Do you prefer working on what users directly interact with or the behind-the-scenes systems that power applications?",
    "How do you feel about continuous learning and adapting to new technologies?",
    "Do you enjoy working more independently or collaboratively in a team?",
    "What kind of projects have you enjoyed working on in the past, even if they weren't technical?"
  ];

  const handleNext = async () => {
    if (!currentResponse.trim()) {
      alert("Please provide an answer before continuing.");
      return;
    }

    const updatedResponses = { ...responses, [currentStep]: currentResponse };
    setResponses(updatedResponses);
    setCurrentResponse('');

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process final recommendation
      setLoading(true);
      await generateRecommendation(updatedResponses);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const generateRecommendation = async (allResponses) => {
    try {
      const prompt = `
        Based on a user's responses to questions about their technology interests, recommend a specific tech career path (frontend, backend, data science, blockchain, etc.) that would suit them best.
        
        Here are their responses:
        
        Question 1: ${questions[0]}
        Response: ${allResponses[0]}
        
        Question 2: ${questions[1]}
        Response: ${allResponses[1]}
        
        Question 3: ${questions[2]}
        Response: ${allResponses[2]}
        
        Question 4: ${questions[3]}
        Response: ${allResponses[3]}
        
        Question 5: ${questions[4]}
        Response: ${allResponses[4]}
        
        Provide a detailed explanation (about 200-300 words) about why this career path is suitable for them based on their answers. Include specific skills they should develop, potential job roles they might enjoy, and learning resources they could explore. Make the recommendation personalized and constructive.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setRecommendation(text);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      setRecommendation("Sorry, there was an error generating your recommendation. Please try again later.");
    }
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setResponses({});
    setCurrentResponse('');
    setRecommendation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Tech Career Path Finder</h1>
        
        {!recommendation ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round((currentStep / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(currentStep / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-3">{questions[currentStep]}</h2>
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-24"
                placeholder="Type your answer here..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
              >
                {currentStep < questions.length - 1 ? 'Next' : 'Get Recommendation'}
              </button>
            </div>
          </>
        ) : (
          <div className="recommendation-section">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Analyzing your responses...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-indigo-700 mb-4">Your Career Recommendation</h2>
                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <div className="whitespace-pre-line text-gray-800">
                    {recommendation}
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={handleStartOver}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Start Over
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;