// Open Trivia DB API wrapper

const BASE_URL = "https://opentdb.com/api.php";


function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}


export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Fetch 10 quiz questions from Open Trivia DB
 * @param {number} categoryId - OTDB category ID
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {Promise<Array>} normalized question objects
 */
export async function fetchQuestions(categoryId, difficulty) {
  const params = new URLSearchParams({
    amount: 10,
    type: "multiple",
    ...(categoryId && { category: categoryId }),
    ...(difficulty && difficulty !== "any" && { difficulty }),
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error("Network error fetching questions");

  const data = await response.json();

  if (data.response_code === 1) throw new Error("Not enough questions available for this category/difficulty.");
  if (data.response_code === 2) throw new Error("Invalid parameter in API request.");
  if (data.response_code !== 0) throw new Error("API error, please try again.");

  return data.results.map((q) => {
    const correct = decodeHTML(q.correct_answer);
    const incorrect = q.incorrect_answers.map(decodeHTML);
    const allAnswers = shuffle([correct, ...incorrect]);

    return {
      question: decodeHTML(q.question),
      correctAnswer: correct,
      incorrectAnswers: incorrect,
      allAnswers,
      category: decodeHTML(q.category),
      difficulty: q.difficulty,
    };
  });
}


export const TECH_CATEGORIES = [
  { id: "", name: " Any Tech Category" },
  { id: 18, name: " Science: Computers" },
  { id: 20, name: " Science: Gadgets" },
  { id: 9, name: " General Knowledge" },
  { id: 11, name: " Entertainment: Film" },
  { id: 15, name: " Entertainment: Video Games" },
  { id: 30, name: " Science: Cryptography" },
];

export const DIFFICULTIES = [
  { id: "any", name: " Any Difficulty" },
  { id: "easy", name: " Easy" },
  { id: "medium", name: " Medium" },
  { id: "hard", name: " Hard" },
];
