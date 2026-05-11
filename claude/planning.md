# Attune — Project Planning Documentation
**Course:** Graduate UX Design — Final Project  
**Framework:** IDEO Design Thinking Process  
**Date:** May 2026

---

## Project Overview

Attune is a mental health web application that helps users discover, personalize, and track evidence-based coping strategies. Recommendations are personalized based on a user's profile answers and current emotional state, and generated using the Claude API grounded in peer-reviewed research.

The core differentiator from competitors like Finch and Headspace is that Attune is:
- Research-driven (grounded in MBSR, MBCT, ACT, DBT, Lazarus & Folkman)
- Culturally aware
- Genuinely personalized through AI

---

## Screen Flow

```
Welcome → Q1 → Q2 → Q3 → Q4 → Q5 → Q6 → Profile Built → Situational Check-in (3 screens) → Recommendations
```

### Why this order matters
- Q1–Q6 build the user's stable profile (who they are, how they cope, where stress happens)
- Profile Built reflects that profile back to the user as a summary
- Situational Check-in captures the current moment state (how they feel right now)
- Recommendations uses both layers to generate personalized strategies via Claude API

This two-layer input directly reflects Lazarus & Folkman's appraisal model:
- Primary appraisal: what is the stressor (profile)
- Secondary appraisal: what resources do I have right now (situational check-in)

---

## Screen Decisions

### Welcome
- Content kept as-is
- Three steps map cleanly to the full flow:
  1. 6 quick questions about you
  2. A check-in about right now (situational screens)
  3. Personalized strategies for your toolkit
- On load: call `clearAnswers()` from `state.js` so every run starts fresh

### Q1 — "What would you like help with first?"
- Input type: single-select MC buttons
- Has "Other" option with inline text field
- Answer options: Get through my problems / Build better habits / Understand my feelings / Other
- State key: `goal`

### Q2 — "When things feel off, what do you usually turn to?"
- Input type: multi-select chips
- Has "Other" option that adds a new chip
- Answer options: Taking action / Talking to someone / Thinking it through / Staying positive / Keeping busy / Letting it pass / Other
- State key: `copingStyle`
- Saved as array of selected values

### Q3 — "Where do stress moments happen most?"
- Input type: single-select MC buttons
- Answer options: At home / At work or school / Around other people / In public
- State key: `stressContext`

### Q4 — "How much control do you feel in stressful situations?"
- Input type: 5-point slider
- Answer options: None / A little / Some / A lot / Complete
- State key: `controlLevel`

### Q5 — "What usually stops you from using coping tools?"
- Input type: free-text textarea (not MC buttons)
- Rationale: barriers to coping are deeply personal and don't compress well into fixed options. Free text gives the Claude API richer, more nuanced input.
- Next button is disabled until the user types something (trim().length > 0)
- Skip question option remains available
- Custom text answers do NOT become profile pills — they feed the Claude API silently
- State key: `barriers`

### Q6 — "Over the past two weeks, how have you mostly felt?"
- Input type: single-select MC buttons
- Answer options: Anxious or overwhelmed / Low or disconnected / Okay but running on empty / Mostly stable, just want to improve
- Next enabled on selection
- State key: `recentMood`

### Profile Built
- Reads from `state.js` using `getAnswers()`
- Renders chip grid dynamically from stored answers
- Only structured answers become pills (Q1, Q2, Q3, Q4, Q6)
- Q5 (free text) does not become a pill — too long, feeds API only
- For Q2 (array), each selected chip gets its own pill
- Custom text responses from Other fields: not shown as pills

### Situational Check-in (3 screens — to be designed)
- Sits between Profile Built and Recommendations
- Captures current moment state separate from stable profile
- Each screen saves to state with its own descriptive key
- Answers included in Claude API prompt alongside Q1–Q6

### Recommendations
- Reads all answers from `state.js`
- Makes a single fetch call to the Claude API
- Renders 4 strategy cards dynamically from the API response
- Three UI states: loading / success / error
- No hardcoded fallback cards — error state shows a message and retry button
- Research basis field exists in JSON but is not shown to the user

---

## State Management

### File: `state.js`
- Storage: `sessionStorage` (browser-only, no backend, persists through refresh, clears when tab closes)
- Three functions only:
  - `saveAnswer(key, value)` — uses `JSON.stringify` before saving
  - `getAnswers()` — uses `JSON.parse` when reading back
  - `clearAnswers()` — called on Welcome screen load

### Why sessionStorage
- Pure frontend, no server needed
- Survives accidental page refresh mid-flow
- Automatically clears when the session ends
- Appropriate for a single-session prototype

### Key naming convention
Descriptive keys chosen over numbered keys (e.g. `goal` not `q1`) so the Claude API prompt reads naturally when answers are injected.

---

## API Key Setup

### Problem
`.env` files are a backend/Node.js convention and cannot be natively read in a pure frontend browser project.

### Solution for this project
- Create `config.js` locally with the real API key — added to `.gitignore`, never pushed to GitHub
- Create `config.example.js` committed to GitHub showing the structure with a placeholder value
- Import the key in `recommendations.js` only

### `.gitignore` additions needed
```
.env
config.js
```

### `config.example.js` structure
```js
export const ANTHROPIC_API_KEY = 'replace-this-with-your-anthropic-api-key';
```

---

## Recommendation Cards

### Card structure (JSON shape returned by Claude API)
```json
{
  "title": "",
  "duration": "",
  "description": "",
  "reason": "",
  "tags": ["", "", "", ""],
  "researchBasis": ""
}
```

- `researchBasis` is populated by Claude but never shown in the UI
- `reason` must directly reference what the user answered — not generic advice
- Exactly 4 cards returned per API call
- Exactly 4 tags per card, one from each category

### Fixed tag system (used for filtering in future toolkit feature)

| Category | Options |
|---|---|
| Format/style | breathing, movement, writing, sensory, social, spiritual |
| Context/environment | anywhere, at-home, outdoors, quiet, private |
| Time commitment | under-5-min, 5-15-min, 15-min-plus |
| Approach | cognitive, behavioral, somatic, mindfulness, grounding |

---

## Claude API Prompt

```javascript
const prompt = `
You are a mental health support assistant trained on evidence-based coping strategy research including Mindfulness-Based Stress Reduction (MBSR), Mindfulness-Based Cognitive Therapy (MBCT), Acceptance and Commitment Therapy (ACT), Dialectical Behavior Therapy (DBT), and Lazarus & Folkman's transactional model of stress and coping. Use these frameworks to inform your recommendations.

The user has completed a short onboarding questionnaire. Based on their responses, recommend exactly 4 coping strategies that are most relevant to their profile.

User profile:
- What they want help with: ${answers.goal}
- What they usually turn to when things feel off: ${answers.copingStyle}
- Where stress moments happen most: ${answers.stressContext}
- How much control they feel in stressful situations: ${answers.controlLevel}
- What usually stops them from using coping tools: ${answers.barriers}
- How they have mostly felt over the past two weeks: ${answers.recentMood}

Instructions:
- Recommend exactly 4 coping strategies
- Each strategy must be directly relevant to the user's profile above
- The reason field must explicitly reference what the user answered — not generic advice
- For tags, choose exactly 4 — one from each of these categories:

  Format/style: breathing, movement, writing, sensory, social, spiritual
  Context/environment: anywhere, at-home, outdoors, quiet, private
  Time commitment: under-5-min, 5-15-min, 15-min-plus
  Approach: cognitive, behavioral, somatic, mindfulness, grounding

- Return your response as a valid JSON object only — no explanation, no markdown, no extra text before or after

Use this exact structure:

{
  "strategies": [
    {
      "title": "",
      "duration": "",
      "description": "",
      "reason": "",
      "tags": ["", "", "", ""],
      "researchBasis": ""
    }
  ]
}
`;
```

### Important notes on the prompt
- Inject `getAnswers()` result before building the prompt
- Replace any `undefined` values (skipped questions) with `'not provided'` before injecting
- Parse the response with `JSON.parse()` — strip any markdown code fences first

---

## Local Strategy JSON Database (planned)

A `strategies.json` file of pre-researched strategies to optionally pass to Claude as a curated pool.

### Entry structure
```json
{
  "id": "box-breathing",
  "title": "Box Breathing",
  "duration": "2-5 minutes",
  "description": "",
  "tags": ["breathing", "anywhere", "under-5-min", "somatic"],
  "researchBasis": "",
  "source": {
    "title": "",
    "url": "",
    "authors": "",
    "year": ""
  }
}
```

### Recommended research sources
- PubMed: https://pubmed.ncbi.nlm.nih.gov
- Google Scholar: https://scholar.google.com
- Cochrane Library: https://www.cochranelibrary.com
- Search pattern: `"[strategy name] anxiety randomized controlled trial"` or `"[strategy name] systematic review"`

---

## File Structure Plan

```
project/
├── config.js              ← local only, in .gitignore
├── config.example.js      ← committed to GitHub
├── planning.md            ← this file
├── .gitignore             ← must include config.js and .env
├── pages/
│   ├── welcome.html
│   ├── q1.html
│   ├── q2.html
│   ├── q3.html
│   ├── q4.html
│   ├── q5.html
│   ├── q6.html
│   ├── profile-built.html
│   ├── situational-1.html
│   ├── situational-2.html
│   ├── situational-3.html
│   └── recommendations.html
├── JS/
│   ├── state.js           ← build this first
│   ├── status-bar.js
│   ├── q1.js
│   ├── q2.js
│   ├── q3.js
│   ├── q4.js
│   ├── q5.js
│   ├── q6.js
│   ├── Profilebuilt.js
│   └── recommendations.js
└── design-system/
    └── css-vars.css
```

---

## To-Do List (current status)

### Immediate
- [ ] Decide descriptive key names for all 6 questions and 3 situational screens
- [ ] Write `state.js` — this unblocks everything else
- [ ] Add `config.js` and `.env` to `.gitignore`

### Question screens
- [ ] `q1.js` — single select, Other field, save to state on Next
- [ ] `q2.js` — multi select chips, Other chip, save array to state on Next
- [ ] `q3.js` — single select, save to state on Next
- [ ] `q4.js` — move slider logic from runtime.js, save to state on Next
- [ ] `q5.html` — replace MC stack with textarea, change Next to button with disabled default
- [ ] `q5.js` — enable Next on input, save to state on Next
- [ ] `q6.html` — add real answer options (replace placeholder dots)
- [ ] `q6.js` — single select, save to state on Next

### Profile Built
- [ ] `Profilebuilt.js` — read from state, render chips dynamically
- [ ] Only show pills for Q1, Q2, Q3, Q4, Q6 — not Q5

### Situational Check-in
- [ ] Design 3 questions
- [ ] Build HTML for each screen
- [ ] Write JS for each, save to state
- [ ] Wire into navigation between Profile Built and Recommendations

### Recommendations
- [ ] Remove hardcoded fallback cards from HTML
- [ ] Add loading / success / error state containers
- [ ] Write `recommendations.js` — getAnswers, build prompt, fetch Claude API, parse response, render cards
- [ ] Handle undefined answers before building prompt
- [ ] Handle loading and error states in the UI

### Before pushing to GitHub
- [ ] Confirm `config.js` is in `.gitignore`
- [ ] Confirm `config.js` does not appear in `git status`
- [ ] Create `config.example.js` with placeholder value
- [ ] Test full flow end to end
