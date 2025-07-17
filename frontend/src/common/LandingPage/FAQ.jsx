import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import faqData from "../../data/faq.json";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  // Process the FAQ data to filter questions based on search query
  const processedFAQs = faqData.faqCategories.map(category => {
    // Filter questions that match the search query
    const filteredQuestions = searchQuery 
      ? category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : category.questions;
    
    // Return a new category object with filtered questions
    return {
      ...category,
      questions: filteredQuestions
    };
  }).filter(category => category.questions.length > 0); // Only keep categories with matching questions

  const handleToggle = (categoryIndex, questionIndex) => {
    const faqId = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const handleCategoryToggle = (categoryIndex) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  // Initialize open categories on first render or when search changes
  React.useEffect(() => {
    const initialOpenState = {};
    processedFAQs.forEach((_, index) => {
      initialOpenState[index] = searchQuery ? true : false;
    });
    setOpenCategories(initialOpenState);
  }, [searchQuery]);

  return (
    <section className="py-12 px-4 bg-white">
      <h2 className="text-center font-bold text-xl sm:text-2xl mb-6 text-[#202124]">
        FAQ
      </h2>

      {/* search bar */}
      <div className="relative mb-6 max-w-md mx-auto">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
          <input
            className="w-full py-2 px-4 text-sm focus:outline-none"
            placeholder="Search Questions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {processedFAQs.length === 0 && (
        <div className="text-center text-gray-500 my-8">
          No questions found matching your search.
        </div>
      )}

      <div className="space-y-4 max-w-md mx-auto">
        {processedFAQs.map((category, categoryIndex) => (
          <div key={category.title} className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
            {/* Category header - clickable */}
            <button
              onClick={() => handleCategoryToggle(categoryIndex)}
              className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-[#202124] bg-gray-50"
            >
              <h3 className="font-medium">{category.title}</h3>
              <FaChevronDown
                size={14}
                className={`transition-transform duration-300 text-[#704ee7] ${openCategories[categoryIndex] ? "rotate-180" : ""}`}
              />
            </button>
            
            {/* Questions in this category */}
            {openCategories[categoryIndex] && (
              <div className="space-y-2 p-3">
                {category.questions.map((item, questionIndex) => {
                  const faqId = `${categoryIndex}-${questionIndex}`;
                  return (
                    <div key={item.question} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => handleToggle(categoryIndex, questionIndex)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#202124]"
                      >
                        {item.question}
                        <FaChevronDown
                          size={12}
                          className={`transition-transform duration-300 text-[#704ee7] ${openFaq === faqId ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openFaq === faqId && (
                        <div className="px-4 pb-4">
                          <p className="text-xs leading-relaxed text-[#6d6d6d]">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
