import React, { useEffect, useState, useRef } from 'react';
import { ThreadService } from '../utils/apiService';

const SuggestedQuestions = React.memo(({ onQuestionClick }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const scrollContainerRef = useRef(null);

    // Refs for top line
  const topLineRef = useRef(null);      // The container (overflow hidden)
  const topContentRef = useRef(null);   // The actual scrolling content

  // Refs for bottom line
  const bottomLineRef = useRef(null);
  const bottomContentRef = useRef(null);

  // Function to randomize all questions in the array
  const getRandomQuestions = (questionsArray) => {
    return [...questionsArray].sort(() => 0.5 - Math.random());
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
          const randomQuestions = getRandomQuestions(fetchedQuestions);
          setQuestions(randomQuestions);
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

   // -------------
  //   MARQUEE JS
  // -------------
  useEffect(() => {
    // Reusable function to init the "infinite scroll"
    function initMarqueeAnimation(containerEl, contentEl, speed = 0.5) {
      let xPos = 0; // how far we've scrolled left (negative)
      let reqId;

      function step() {
        if (!containerEl || !contentEl) return;

        xPos -= speed; // move left each frame
        contentEl.style.transform = `translateX(${xPos}px)`;

        // If we've scrolled enough that the first "half" is fully offscreen,
        // we can reset xPos to 0. The "half" is basically the width of one copy
        const contentWidth = contentEl.scrollWidth / 2;
        if (Math.abs(xPos) >= contentWidth) {
          // jump back by the contentWidth so the second copy is effectively the new start
          xPos += contentWidth;
        }

        reqId = requestAnimationFrame(step);
      }

      step(); // start animating

      return () => cancelAnimationFrame(reqId); // cleanup
    }

    // Start marquee for top line
    let topCleanup;
    if (topLineRef.current && topContentRef.current) {
      topCleanup = initMarqueeAnimation(topLineRef.current, topContentRef.current, 0.5);
    }

    // Start marquee for bottom line
    let bottomCleanup;
    if (bottomLineRef.current && bottomContentRef.current) {
      bottomCleanup = initMarqueeAnimation(bottomLineRef.current, bottomContentRef.current, 0.3);
    }

    // Cleanup on unmount
    return () => {
      if (topCleanup) topCleanup();
      if (bottomCleanup) bottomCleanup();
    };
  }, [questions]);

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
          <div className="marquee-container" ref={topLineRef}>
            <div className="marquee-content" ref={topContentRef}>
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
          <div className="marquee-container" ref={bottomLineRef}>
            <div className="marquee-content" ref={bottomContentRef}>
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
