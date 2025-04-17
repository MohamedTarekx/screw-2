# Skrew Card Game Score Tracker

A modern, futuristic web application for tracking scores in the Skrew card game.


## Features

- Track player scores across 5 rounds
- Automatic calculation of totals
- Special rule implementation: the player with the lowest score in each round gets their score set to 0
- Highlighting of winners and losers
- Dark/light mode toggle
- Futuristic purple and black design theme
- Responsive layout for all devices
- No backend required - works entirely in the browser

## Getting Started

### Prerequisites

No special prerequisites are required. The application uses vanilla HTML, CSS, and JavaScript, so you only need a modern web browser.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/skrew-score-tracker.git
   ```

2. Open `index.html` in your browser.

Alternatively, you can use a local development server like [Live Server for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or Python's built-in HTTP server:

```
python -m http.server
```

## Game Rules

Skrew is a popular card game where players aim to achieve the lowest total score across 5 rounds. The player with the lowest score wins, while the player with the highest score is designated as "الكوز" (the loser).

Special rule: In each round, the player with the lowest score (greater than 0) gets their score set to 0.

## Usage

1. Enter player names (2-8 players)
2. Enter scores for each round
3. The application automatically calculates totals and determines winners/losers
4. Start a new game when finished

## Tech Stack

- HTML5
- CSS3 (with custom properties and flexbox/grid layouts)
- Vanilla JavaScript (ES6+)
- Local Storage for theme preference

## Customization

You can easily customize the application:

- Edit the CSS variables in `style.css` to change the color scheme
- Modify the game rules in `script.js` to adapt to different variations of the game

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font: [Orbitron](https://fonts.google.com/specimen/Orbitron) from Google Fonts
- Inspired by futuristic UI design trends
