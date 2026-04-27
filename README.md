# lockin-app

A minimalist focus cockpit for deep work sessions. Timer, tasks, ambient sounds, and streak tracking all in one distraction-free interface.

![TypeScript](https://img.shields.io/badge/TypeScript-64.3%25-blue)
![CSS](https://img.shields.io/badge/CSS-33.1%25-purple)
![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff?logo=vite)

---

## Features

### **Pomodoro Timer**
- **Focus sessions**: 25 minutes of deep work
- **Short breaks**: 5 minutes to recharge
- **Long breaks**: 15 minutes after 4 focus sessions
- Keyboard shortcut: Press **Space** to start/pause
- Browser notifications when sessions complete
- Real-time progress ring visualization
- Document title updates to show remaining time

### **Task Management**
- Add, complete, and delete tasks instantly
- Pin current task to keep focus anchored
- Filter tasks: All, Active, Done
- Clear all completed tasks at once
- Progress tracking: X/Y tasks complete today
- Persistent storage across sessions

### **Ambient Sounds**
- **Rain** 🌧️ - Soothing white noise
- **Fireplace** 🔥 - Cozy crackling fire
- **Café** ☕ - Coffee shop ambience
- **Forest** 🌿 - Nature background
- Adjustable volume control
- Only one sound plays at a time

### 🔥 **Streak Tracker**
- Session counter with dynamic messaging
- Visual flame indicators (up to 8 flames)
- Daily focus minutes target (120 min / 2 hours)
- Progress percentage display
- Resets at midnight automatically

---

## Quick Start

### Prerequisites
- Node.js 20.19+ or 22.13+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/isthatpaul/lockin-app.git
cd lockin-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
lockin-app/
├── src/
│   ├── components/
│   │   ├── Timer.tsx              # Pomodoro timer logic
│   │   ├── TaskList.tsx           # Task management
│   │   ├── AmbientPlayer.tsx      # Sound generation & playback
│   │   └── StreakTracker.tsx      # Session counter & messaging
│   ├── styles/
│   │   ├── variables.css          # Design tokens (colors, spacing, typography)
│   │   ├── base.css               # Global styles & animations
│   │   └── components.css         # Component-specific styles
│   ├── App.tsx                    # Main app logic & state management
│   ├── main.tsx                   # React entry point
│   └── vite-env.d.ts              # Vite type definitions
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
├── eslint.config.js               # ESLint rules
├── package.json                   # Dependencies & scripts
└── README.md                       # This file
```

---

## Design System

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--accent` | #f1642f | Primary action, highlights |
| `--accent-soft` | #ffe2d8 | Hover states, backgrounds |
| `--accent-strong` | #d74e1c | Borders, active states |
| `--ink-1` | #122325 | Headings, primary text |
| `--ink-2` | #395358 | Secondary text |
| `--ink-3` | #678187 | Tertiary text |
| `--bg-0` | #f4f8f8 | Primary background |
| `--bg-1` | #e5efee | Secondary background |
| `--line` | #c4d7d5 | Borders, dividers |
| `--ok` | #1d7c5f | Success states |

### Typography

- **Serif** (Fraunces): Headings, large numbers
- **Sans** (Space Grotesk): Body, UI elements
- Sizes: 0.74rem → 1.72rem with CSS clamp()

### Spacing Scale

```css
--spacing-xs: 0.2rem
--spacing-sm: 0.45rem
--spacing-md: 0.8rem
--spacing-lg: 1rem
--spacing-xl: 1.3rem
```

---

## Data Persistence

All app state is saved to **localStorage** under key `lockin.app.state.v1`:

```json
{
  "tasks": [],
  "sessionCount": 0,
  "currentMode": "focus",
  "activeTaskId": null,
  "focusMinutesToday": 0,
  "lastActiveDate": "2026-04-27"
}
```

**Automatic reset**: Stats reset daily at midnight (based on `lastActiveDate`).

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Space** | Start/pause timer |
| **Enter** | Add task (when focused in input) |

---

## 🔧 Configuration

### Timer Durations

Edit `src/components/Timer.tsx`:

```typescript
const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,      // 25 minutes
  short: 5 * 60,       // 5 minutes
  long: 15 * 60,       // 15 minutes
}
```

### Daily Focus Target

Edit `src/App.tsx`:

```typescript
const DAILY_FOCUS_TARGET = 120  // 2 hours in minutes
```

---

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Full | 90+ |
| Firefox | ✅ Full | 88+ |
| Safari | ✅ Full | 15+ |
| Mobile | ✅ Full | iOS 15+, Android 90+ |

**Requirements:**
- Web Audio API (for ambient sounds)
- localStorage (for data persistence)
- CSS Grid & Flexbox
- ES2023 JavaScript

---

## 🛠️ Development

### Tech Stack

- **React 19** - UI framework
- **TypeScript 6** - Type safety
- **Vite 8** - Build tool & dev server
- **ESLint 10** - Code quality
- **CSS3** - Styling with variables & Grid

### Scripts

```bash
npm run dev          # Start dev server (HMR enabled)
npm run build        # TypeScript check + Vite build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Code Quality

- ✅ Strict TypeScript (`noImplicitAny`, `noUnusedLocals`, etc.)
- ✅ React Hook ESLint rules
- ✅ Type-aware ESLint checks
- ✅ 100% TypeScript codebase

---

## 🎯 Architecture

### State Management

Global state in `App.tsx`:
- `tasks` - User's task list
- `sessionCount` - Pomodoros completed
- `currentMode` - Timer mode (focus/short/long)
- `activeTaskId` - Currently pinned task
- `focusMinutesToday` - Accumulated focus time

State is:
1. Synced to localStorage on every change
2. Loaded from localStorage on app start
3. Reset at midnight if new day detected

### Component Communication

```
App (state holder)
├── Timer (receives mode, onComplete callback)
├── TaskList (receives tasks, setTasks)
├── AmbientPlayer (independent, no props)
└── StreakTracker (receives sessionCount, focusMinutesToday)
```

---

## 🚦 Future Roadmap

- [ ] Dark mode toggle
- [ ] Sound file upload/customization
- [ ] Session history & analytics
- [ ] Break reminders/notifications
- [ ] Habit tracking integration
- [ ] Export session data (CSV/JSON)
- [ ] Desktop app (Electron)
- [ ] Sync across devices (cloud)

---

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions welcome! Areas for help:

- 🎨 UI/UX improvements
- ♿ Accessibility enhancements
- 🌍 Internationalization (i18n)
- 📱 Mobile optimizations
- 🐛 Bug fixes

---

## 📧 Support

Found an issue? Have a suggestion?

- **Issues**: [GitHub Issues](https://github.com/isthatpaul/lockin-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/isthatpaul/lockin-app/discussions)

---

**Made with ❤️ for focused developers**
```

This README includes everything needed for users and developers! 🚀