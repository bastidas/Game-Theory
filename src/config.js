// Shared configuration and constants

// Calculate responsive chart dimensions
function getChartDimensions() {
  // Scale from 240px (mobile) to 550px (desktop)
  const baseSize = Math.min(550, window.innerWidth - 80);
  const maxSize = Math.max(240, baseSize);
  return {
    chartWidth: maxSize,
    chartHeight: maxSize
  };
}

export const config = {
  backgroundColor: "#E9E9E9",
  fontColor: "#131313",
  offFontColor: "#ccc",
  textColor: "#131313",
  linkColor: "#131313",
  offLinkColor: "#ccc",
  ...getChartDimensions(),
  linkWidth: 3,
  blinkTime: 300,
  buttonBoxWidth: 250,
  buttonBoxHeight: 70,
  bWidth: 55,
  bHeight: 55,
  bSpace: 55,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  updateDimensions() {
    const dimensions = getChartDimensions();
    this.chartWidth = dimensions.chartWidth;
    this.chartHeight = dimensions.chartHeight;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
};

export const animalBehaviors = {
  "cooperator": "dog",
  "clever": "fox",
  "cheater": "snake",
  "copycat": "cat",
  "wise": "owl",
  "random": "chimpanzee",
  "aesopGoat": "goat",
  "aesopMouse": "mouse",
  "aesopLion": "lion",
  "aesopCat": "cat",
  "aesopMonkey": "chimpanzee",
  "crane": "crane",
  "wolf": "wolf"
};

const primaryColor = ['#06799F', '#216278', '#024E68', '#3AAACF', '#62B4CF'];
const secondaryColor = ['#FFB400', '#BF9530', '#A67500', '#FFC740', '#FFD673'];
const tertiaryColor = ['#FF2800', '#BF4630', '#A61A00', '#FF5D40', '#FF8973'];

export const nodeColors = [primaryColor, secondaryColor, tertiaryColor];
export const nodeColorLevel = 4;
export const strokeColorLevel = 0;

// Utility function for deep cloning data
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
