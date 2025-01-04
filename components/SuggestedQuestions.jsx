import React, { useEffect, useState, useRef } from 'react';
import { ThreadService } from '../utils/apiService';

const SuggestedQuestions = React.memo(({ onQuestionClick }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const scrollContainerRef = useRef(null);

   // Function to get 5 random questions from the array
  const getRandomQuestions = (questionsArray, count = 5) => {
    const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await ThreadService.getSuggestedQuestions();
        if (isMounted) {
          console.log('Fetched questions:', fetchedQuestions);
          // Set 5 random questions instead of all questions
          //const randomQuestions = getRandomQuestions(fetchedQuestions);
          //console.log('Setting random questions:', randomQuestions);
          console.log('Setting fetched questions');
          setQuestions(fetchedQuestions);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching suggested questions:', err);
        if (isMounted) {
          setError(err);
          setQuestions(prevQuestions => prevQuestions.length ? prevQuestions : []);
        }
      }
    };

    fetchQuestions();
    const refreshInterval = setInterval(fetchQuestions, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  // If you want to split questions between two lines
  const halfIndex = Math.ceil(questions.length / 2);
  const topLineQuestions = questions.slice(0, halfIndex);
  const bottomLineQuestions = questions.slice(halfIndex);

  // Check scroll position to show/hide scroll buttons
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      // Also check when questions change
      checkScroll();
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
    };
  }, [questions]);

  const handleClick = React.useCallback((question) => {
    onQuestionClick(question);
  }, [onQuestionClick]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (error && !questions.length) {
    return (
      <div className="h-20 flex-none w-full bg-gray-50 border-b border-gray-200">
        <div className="flex items-center h-full px-4">
          <span className="text-sm text-red-500">
            Failed to load suggested questions. Please try again later.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-none w-full bg-gray-50 border-b border-gray-200">
      {questions.length > 0 ? (
        <div className="h-full flex flex-col justify-center px-4">
           {/* --- Top line of marquee --- */}
          <div className="marquee-container">
            <div className="marquee-content">
              {topLineQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleClick(q.content)}
                  className="inline-block px-4 py-2 m-1 text-sm bg-white rounded-full
                             border border-gray-200 hover:border-gray-300
                             text-gray-600 hover:text-gray-800
                             transition-colors duration-200"
                >
                  {q.content}
                </button>
              ))}
              {topLineQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleClick(q.content)}
                  className="inline-block px-4 py-2 m-1 text-sm bg-white rounded-full
                             border border-gray-200 hover:border-gray-300
                             text-gray-600 hover:text-gray-800
                             transition-colors duration-200"
                >
                  {q.content}
                </button>
              ))}
            </div>
          </div>

          {/* --- Bottom line of marquee --- */}
          <div className="marquee-container">
            <div className="marquee-content">
              {bottomLineQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleClick(q.content)}
                  className="inline-block px-4 py-2 m-1 text-sm bg-white rounded-full
                             border border-gray-200 hover:border-gray-300
                             text-gray-600 hover:text-gray-800
                             transition-colors duration-200"
                >
                  {q.content}
                </button>
              ))}
              {bottomLineQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleClick(q.content)}
                  className="inline-block px-4 py-2 m-1 text-sm bg-white rounded-full
                             border border-gray-200 hover:border-gray-300
                             text-gray-600 hover:text-gray-800
                             transition-colors duration-200"
                >
                  {q.content}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center h-full px-4">
          <span className="text-sm text-gray-500">Loading questions...</span>
        </div>
      )}
    </div>
  );
});

SuggestedQuestions.displayName = 'SuggestedQuestions';

export default SuggestedQuestions;
