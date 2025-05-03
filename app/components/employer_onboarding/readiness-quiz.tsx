//// This code defines a React functional component named `ReadinessQuiz` that is part of an employer profile onboarding process.

import Button from "~/components/ui/button";
import { useNavigate } from "react-router";
import { type QuizQuestion } from "~/routes/dashboard/profile/employer_onboarding";

interface ReadinessQuizProps {
  quizQuestions: QuizQuestion[];
  answeredQuestions: number;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string | null) => void;
  handleNextQuestion: () => void;
  setAnsweredQuestions: (callback: (prev: number) => number) => void;
  setPage: (page: number) => void;
  onComplete: () => void;
}

const getSectionInfo = (index: number) => {
  if (index < 5)
    return {
      section: "1 of 3 Organizational Readiness",
      localIndex: index + 1,
    };
  if (index < 10)
    return {
      section: "2 of 3 Legal & Compliance Awareness",
      localIndex: index - 4,
    };
  return {
    section: "3 of 3 Communication & Ongoing Support",
    localIndex: index - 9,
  };
};

const ReadinessQuiz: React.FC<ReadinessQuizProps> = ({
  quizQuestions,
  answeredQuestions,
  selectedAnswer,
  setSelectedAnswer,
  handleNextQuestion,
  setAnsweredQuestions,
  setPage,
  onComplete,
}) => {
  const currentQuestion = quizQuestions[answeredQuestions];
  const { section, localIndex } = getSectionInfo(answeredQuestions);

  const quizCompleted = answeredQuestions === quizQuestions.length;

  const progressPercent = Math.round(
    (answeredQuestions / quizQuestions.length) * 100
  );

  return (
    <div className="w-full rounded-lg border bg-white dark:bg-neutral-900 shadow-sm p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#0F1729] dark:text-white flex items-center gap-2">
          <img src="/images/rediness.png" alt="readinessIcon" className="" />{" "}
          Readiness Checklist
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Assess your preparedness for remote work with our comprehensive
          readiness quiz.
        </p>
      </div>

      {/* Question block */}
      {!quizCompleted && currentQuestion && (
        <>
          {/* Section & Progress */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">{section}</span>
            <p className="text-sm text-gray-500">
              Question {answeredQuestions + 1} of {quizQuestions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Question */}
          <p className="text-base font-semibold text-[#0F1729]">
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`border rounded px-4 py-3 flex items-center gap-2 cursor-pointer transition ${
                  selectedAnswer === option
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name={`quiz-${answeredQuestions}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-[#0F1729]">{option}</span>
              </label>
            ))}
          </div>

          {/* Quiz Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() =>
                setAnsweredQuestions((prev) => Math.max(prev - 1, 0))
              }
              disabled={answeredQuestions === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
              Next
            </Button>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      {quizCompleted && (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setPage(3)}>
            Back
          </Button>
          <Button
            onClick={onComplete}
            disabled={!quizCompleted}
            className={!quizCompleted ? "opacity-50 cursor-not-allowed" : ""}
          >
            Finish & Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReadinessQuiz;
