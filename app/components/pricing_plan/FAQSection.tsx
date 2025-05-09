// This component is used to display the "Frequently Asked Questions (FAQ)" section in the pricing plan page.
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How are slots calculated?",
      answer:
        "Slots refer to the number of hires or business units you're allowed within a plan.",
    },
    {
      question: "Can I upgrade mid-cycle?",
      answer:
        "Yes, you can upgrade your plan at any time. Charges will be prorated.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit/debit cards, bank transfers, and select local payment gateways.",
    },
    {
      question: "Is there a discount for annual billing?",
      answer:
        "Yes, annual plans come at a discounted rate compared to monthly plans.",
    },
  ];

  return (
    <div className="my-20 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Frequently Asked Questions
      </h3>
      <div className="divide-y border rounded-md">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="group">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-4 py-4 text-left focus:outline-none"
              >
                <span className="font-medium text-[#0F1729]">
                  {faq.question}
                </span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-neutral-700">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
