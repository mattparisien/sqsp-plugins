class Utils {
  constructor() {}

  static midpoint(x1, y1, x2, y2) {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };
  }

  static rgbToRgba() {}

  static rgbToHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  static hexToRgb(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return { r, g, b };
  }
  
  static hexToRgba(hex, alpha) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return [ r, g, b, alpha || 1.0];
  }

  static lightenHex(hex, amount) {
    const { r, g, b } = this.hexToRgb(hex);

    // Ensure amount is not greater than 100
    amount = amount > 100 ? 100 : amount;

    // Calculate the adjustment value
    let adjust = (amount / 100) * 255;

    // Adjust each color component
    const r2 = Math.min(255, r + adjust);
    const g2 = Math.min(255, g + adjust);
    const b2 = Math.min(255, b + adjust);

    // Convert back to hex and return
    return (
      "#" +
      [r2, g2, b2]
        .map((x) => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  static getPixelColor(img, x, y, format, opacity) {
    const px = img.get(x, y);
    let final;

    if (!Array.isArray(px)) return;

    switch (format) {
      case "rgb":
        final = `rgb(${[px[0]]}, ${px[1]}, ${px[2]})`;
        break;
      case "rgba":
        final = `rgba(${[px[0]]}, ${px[1]}, ${px[2]}, ${opacity})`;
        break;
      default:
        final = Utils.rgbToHex(px[0], px[1], px[2]);
    }

    return final;
  }

  static getRandomJSONValue(json) {
    // Check if the input is a string and parse it, otherwise use it directly
    const obj = typeof json === "string" ? JSON.parse(json) : json;

    // Extract the values from the object
    const values = Object.values(obj);

    // Generate a random index based on the number of values
    const randomIndex = Math.floor(Math.random() * values.length);

    // Return a random value
    return values[randomIndex];
  }

  static drawPoint(x, y) {
    stroke("black");
    strokeWeight(50);
    point(x, y);
    noStroke();
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static isTouchScreen() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  }
}

export default Utils;
