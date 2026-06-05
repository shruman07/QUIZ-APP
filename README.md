# DevLore — Tech Quiz & Learning Tracker

> A React-based quiz platform that tests technical knowledge and tracks user progress over time using `localStorage`.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📦 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | React 18 (Vite)               |
| Routing     | React Router DOM v6           |
| Styling     | Vanilla CSS (custom design system) |
| Data Source | Open Trivia DB API            |
| Storage     | Browser `localStorage`        |
| Icons       | Inline SVG / Unicode          |

---

## 🗄️ localStorage Schema Design

Two keys are used to store all quiz data efficiently:

### Key 1: `devlore_sessions`

Stores an **array of QuizSession objects**, newest first.

```json
[
  {
    "id": "1717430400000-abc1234",
    "date": "2026-06-03T18:00:00.000Z",
    "category": {
      "id": 18,
      "name": "Science: Computers"
    },
    "difficulty": "medium",
    "totalQuestions": 10,
    "correctAnswers": 7,
    "wrongAnswers": 3,
    "score": 70,
    "questions": [
      {
        "question": "What does CPU stand for?",
        "correctAnswer": "Central Processing Unit",
        "userAnswer": "Central Processing Unit",
        "isCorrect": true
      },
      {
        "question": "What does RAM stand for?",
        "correctAnswer": "Random Access Memory",
        "userAnswer": null,
        "isCorrect": false
      }
    ]
  }
]
```

**Design decisions:**
- Sessions are stored newest-first for O(1) access to recent sessions
- `userAnswer: null` indicates a timeout (timer expired)
- Full question data is stored per session to enable detailed review on the Results page

---

### Key 2: `devlore_stats`

Stores **pre-aggregated statistics** to avoid recalculating on every page load.

```json
{
  "totalAttempts": 5,
  "averageScore": 68,
  "categoryStats": {
    "18": {
      "name": "Science: Computers",
      "attempts": 3,
      "totalScore": 210,
      "avgScore": 70
    },
    "9": {
      "name": "General Knowledge",
      "attempts": 2,
      "totalScore": 120,
      "avgScore": 60
    }
  }
}
```

**Design decisions:**
- Stats are **recalculated and re-saved** every time a new session is added, keeping reads fast
- `categoryStats` is keyed by category ID (string) for O(1) lookup
- `avgScore` is pre-computed per category so the Dashboard renders instantly
- Category strengths/weaknesses are derived from `avgScore` comparisons at render time

---

### How Category Statistics Are Calculated

```
For each session in devlore_sessions:
  1. Look up category ID in categoryStats
  2. Increment attempts counter
  3. Add session score to totalScore
  4. Recompute avgScore = totalScore / attempts

averageScore (global) = sum of all session scores / totalAttempts
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   └── ScoreBar.jsx        # CSS-only animated score bars (no chart libs)
├── pages/
│   ├── HomePage.jsx        # Stats overview + recent sessions
│   ├── SetupPage.jsx       # Category & difficulty selection
│   ├── QuizPage.jsx        # Active quiz with timer + answers
│   ├── ResultsPage.jsx     # Score ring + incorrect Q review
│   └── DashboardPage.jsx   # Progress dashboard + trend chart
├── hooks/
│   ├── useLocalStorage.js  # Generic localStorage hook
│   ├── useQuizStorage.js   # Quiz-specific CRUD operations
│   └── useTimer.js         # Countdown timer with auto-expire
├── context/
│   └── QuizContext.jsx     # Global active quiz state (React Context)
├── utils/
│   ├── api.js              # Open Trivia DB fetch wrapper
│   ├── storage.js          # localStorage read/write helpers
│   └── stats.js            # Statistics calculation helpers
└── styles/
    ├── index.css           # Design system tokens + global styles
    ├── home.css
    ├── setup.css
    ├── quiz.css
    ├── results.css
    └── dashboard.css
```

---

## 🌐 API Reference

**Open Trivia DB:** `https://opentdb.com/api.php`

| Parameter  | Value                        |
|------------|------------------------------|
| `amount`   | `10` (fixed)                 |
| `type`     | `multiple` (multiple choice) |
| `category` | OTDB category ID (optional)  |
| `difficulty` | `easy` / `medium` / `hard` |

**Tech-focused categories used:**

| ID | Name                    |
|----|-------------------------|
| 18 | Science: Computers      |
| 20 | Science: Gadgets        |
| 9  | General Knowledge       |
| 15 | Entertainment: Video Games |

---

## ✨ Features

- **Home Page** — Stats overview with empty state for first-time users
- **Quiz Setup** — Category + difficulty selection, 10 questions per quiz
- **Quiz Page** — One question at a time, 20-second timer, auto-advance on expire
- **Results Page** — Animated score ring, correct/wrong breakdown, incorrect question review
- **Dashboard** — Category score bars (CSS-only), score trend bars (CSS-only), session history

---

## 🎨 Design

- Dark theme with glassmorphism cards
- Color palette: deep navy + electric violet + teal accents
- Typography: Inter (headings) + JetBrains Mono (code/scores)
- All chart-like visuals built with pure CSS (no libraries)

---

## 📖 Learning Objectives

This project demonstrates:

1. **React Hooks** — `useState`, `useEffect`, `useCallback`, `useContext`, custom hooks
2. **React Context** — Global state management across page transitions
3. **React Router** — Client-side routing with `useNavigate`, `useLocation`
4. **Fetch API** — Consuming a REST API with error handling
5. **localStorage** — Schema design, CRUD operations, and data persistence
6. **CSS Architecture** — Custom properties, animations, responsive layout
