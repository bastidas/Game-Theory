# Game-Theory
An interactive web-based visualization that explores game theory concepts, decision-making strategies, and group dynamics. The project uses Aesop's fables and animal behaviors to illustrate different strategic approaches like cooperation, deception, and retaliation.

---

> *"A finite game is played for the purpose of winning, an infinite game for the purpose of continuing the play. Strength is paradoxical. I am not strong because I can force others to do what I wish as a result of my play with them, but because I can allow them to do what they wish in the course of my play with them."*  
> 
> **― James P. Carse, Finite and Infinite Games: A Vision of Life as Play and Possibility**

---

## How to Run

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/Game-Theory.git
   cd Game-Theory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Production Build

Build the optimized production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The built files will be iSource files
│   ├── main.js       # Application entry point
│   ├── config.js     # Configuration
│   ├── graphData.js  # Game theory data structures
│   ├── graph.js      # D3.js visualization
│   ├── gameTheory.js # Game logic and strategies
│   └── modFunctions.js # UI interactions
├── css/              # Stylesheets
├── imgs/             # Image assets
└── index.html        # Main HTML file
```- D3.js (v4.1.1) - Data visualization
- jQuery (v1.11.1) - DOM manipulation
- fullPage.js - Full-page scrolling
- Google Fonts - Typography

No installation or build process required!


## Usage
- Scroll through the presentation using your mouse wheel or arrow keys
- Interact with the visualizations to explore different game theory scenarios
- Navigate between slides using the fullPage.js navigation

## Browser Compatibility
Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
