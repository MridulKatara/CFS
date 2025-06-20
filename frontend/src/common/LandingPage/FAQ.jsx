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
    <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <h2 className="text-center font-bold text-2xl sm:text-3xl lg:text-4xl text-[#202124]">
        FAQ
      </h2>

      {/* search bar */}
      <div className="relative mt-6 mb-4 max-w-2xl mx-auto">
        <input
          className="w-full rounded-lg bg-[#f5f5f5] py-2 sm:py-3 pl-4 pr-10 text-sm sm:text-base focus:ring-0 border border-[#d4d9d6]"
          placeholder="Search FAQs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="absolute right-3 top-2.5 sm:top-3 h-4 w-4 text-[#6d6d6d]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
        </svg>
      </div>

      <div className="space-y-3 max-w-4xl mx-auto">
        {filteredFAQs.map((category) => (
          <div key={category.title} className="mb-6">
            <h3 className="text-[#202124] font-semibold mb-3 text-lg sm:text-xl">
              {category.title}
            </h3>
            {category.questions.map((item, i) => (
              <div key={item.question} className="border border-[#d4d9d6] rounded-lg mb-2 bg-[#fff]">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm sm:text-base font-medium text-[#202124]"
                >
                  {item.question}
                  <FaChevronDown
                    size={16}
                    className={`transition-transform text-[#704ee7] ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <p className="px-4 pb-4 text-xs sm:text-sm leading-relaxed text-[#6d6d6d]">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
