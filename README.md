# Attune — 637 Research Project (Figma screens)

Vanilla **HTML / CSS / JavaScript** implementation of nine mobile UI screens from Figma, with a small hash-based router and a JSON design token file for consistency that was created by cursor.

## Design system

- **Tokens:** [`design-system/tokens.json`](design-system/tokens.json)
- **CSS variables:** [`design-system/css-vars.css`](design-system/css-vars.css) (used across the app)

## Run locally
Attune uses a local Node server for API-based recommendations. Run the app with ` ANTHROPIC_API_KEY=replace-this-with-your-own-api-key node server.js` and open `http://localhost:3000`.

# Attune Project Notes

For my final project, I focused on building the HTML, CSS, and JavaScript for four main screens in my app:

- Question 5
- Question 6
- Profile Built
- Recommendations

These screens show the main interaction flow I wanted to build: collecting a written response, collecting a mood response, turning the user’s quiz answers into profile tags, and showing personalized coping strategy cards.

## What I Built

### Q5
I built the HTML structure and JS for the open text response question. I styled the textarea, label, progress bar, and navigation buttons. I also wrote JavaScript that enables the Next button only when the user types a response, then saves that answer in session storage.

### Q6
I built the mood selection screen using simple choice buttons. I wrote JavaScript so the selected button changes state, enables the Next button, and saves the selected mood answer before moving to the profile screen.

### Profile Built
I built the profile summary screen and created pill chips that summarize the user’s answers. I wrote JavaScript that reads the saved quiz answers from session storage and turns them into short profile tags such as “emotion focused,” “support seeking,” “anxious,” or “low energy.”

### Recommendations
I built the recommendations screen with strategy cards. I styled the cards, tag pills, selected state, and checkmark behavior. I also wrote JavaScript that loads strategy recommendations and lets the user click cards to select or unselect them. I had some help with claude on how to handle the API and how to hide certain states.

## Other Tid bits
I also spent a lot of time editing css components that were originally created in the components, screens, and global css. These were very minute details that I wasnt able to provide in line comments for but examples of this include fixing the other text field components to match the MC buttons/CTA chips respectively, fixing problems of spacing and awkward alignment that came from using cursor planning mode, etc.

## How I Used Claude

I used Claude as a helper while building, especially for understanding debugging and how to write my code. I asked claude to give me a to-do list of what I should do in order to get to where I want to with this project. I made decisions about which screens to focus on, what each page should do, and how the user flow should work. 

**Note about md file for planning mode: for some reason I wasnt able to find the markdown file for using the planning agent. Im not sure if it got lost or deleted or something but I cant find it anywhere on my files.**

## What I Learned

This project helped me practice connecting multiple HTML pages with JavaScript. I learned how to save user answers, reuse them on later pages, create elements like chips and cards, and use CSS classes to show selected states. I also learned that AI-generated code especially from cursor planner can become too complex, so I spent time simplifying class names and removing extra code so the project felt easier to understand and maintain for future use.

