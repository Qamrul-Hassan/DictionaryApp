
# 📚 Dictionary App

A modern, responsive, and accessible **Dictionary App** built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. It supports real-time word search, suggestions, pronunciation playback, keyboard navigation, and elegant animations — all wrapped in a world-class UI/UX experience.

![Dictionary App Banner](./public/banner.png)

## 🚀 Features

- 🔍 Live Search with Suggestions (powered by [Datamuse API](https://www.datamuse.com/api/))
- 🔊 Pronunciation Playback (for searched words)
- ⌨️ Keyboard Navigation (Arrow Up/Down + Enter key support)
- 🎨 Fully Responsive UI (mobile-first, optimized for all screen sizes)
- 🌗 Dark Mode Support
- ⚡️ Animations with Framer Motion
- ✅ Accessibility Best Practices
- 🛠️ Built with modern technologies: Next.js (App Router), TypeScript, Tailwind CSS, Zustand (for state)

## 📦 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **APIs Used**:
  - [Datamuse API](https://www.datamuse.com/api/) for suggestions
  - [Dictionary API](https://dictionaryapi.dev/) or [WordsAPI](https://www.wordsapi.com/) for definitions and audio

## 🖼️ Demo

Live Demo: [https://your-deployed-link.com](https://your-deployed-link.com)

## 📁 Project Structure

```bash
📦 dictionary-app
├── app/               # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── styles/        # Global styles
│   └── layout.tsx     # Root layout
├── public/            # Static assets
├── types/             # TypeScript types
├── utils/             # Utility functions
├── store/             # Zustand store
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/dictionary-app.git
cd dictionary-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## ⚙️ Environment Setup

If you use APIs that require a key, add your environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_API_KEY=your_api_key
```

## 🧠 Key Features Breakdown

### 🔠 Search Bar

- Debounced search with live API suggestions
- Arrow Up/Down + Enter for keyboard selection
- Mouse click support for suggestion selection
- Voice icon for pronunciation playback

### 📖 Word Details

- Definition, part of speech, and usage examples
- Audio pronunciation with fallback
- Smooth animations via Framer Motion

## 🎨 Customization

You can modify:

- API sources and response formats
- Colors in `tailwind.config.ts`
- Motion effects in components using [Framer Motion docs](https://www.framer.com/motion/)

## 🧪 Development Scripts

| Command         | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start development server       |
| `npm run build`| Build the app for production   |
| `npm run start`| Start the production server    |
| `npm run lint` | Run ESLint checks              |

## 🛡️ License

Licensed under the [MIT License](LICENSE).

## 🙌 Acknowledgements

- [Datamuse API](https://www.datamuse.com/api/)
- [Dictionary API](https://dictionaryapi.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Next.js](https://nextjs.org/)
- [Zustand](https://github.com/pmndrs/zustand)

## 💡 Future Improvements

- Add word history
- Add light/dark mode toggle
- Bookmark or favorite words
- Offline caching
- Synonym and antonym suggestions

---

✅ **Lint fixes included:**

- ❌ No duplicate headings (`MD024`)
- ❌ Only one `#` top-level heading (`MD025`)
- ✅ Language added to fenced blocks (`MD040`)
- ✅ Blank lines added around lists (`MD032`)
- ✅ Ends with one newline only (`MD047`)
