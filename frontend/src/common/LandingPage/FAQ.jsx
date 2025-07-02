import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import faqData from "../../data/faq.json";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = faqData.faqCategories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.questions.some(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <section className="py-12 px-4 sm:px-6 bg-white">
      <h2 className="text-center font-bold text-xl sm:text-2xl mb-6 text-[#202124]">
        FAQ
      </h2>

      {/* search bar */}
      <div className="relative mb-6 max-w-sm mx-auto">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
        <input
            className="w-full py-2 px-4 text-sm focus:outline-none"
          placeholder="Search FAQs"
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

      <div className="space-y-4 max-w-sm mx-auto">
        {filteredFAQs.map((category) => (
          <div key={category.title} className="mb-4">
            <div className="space-y-2">
            {category.questions.map((item, i) => (
                <div key={item.question} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#202124]"
                >
                  {item.question}
                  <FaChevronDown
                      size={12}
                      className={`transition-transform duration-300 text-[#704ee7] ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                    <div className="px-4 pb-4">
                      <p className="text-xs leading-relaxed text-[#6d6d6d]">
                    {item.answer}
                  </p>
                    </div>
                )}
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
