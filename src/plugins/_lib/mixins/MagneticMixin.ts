
import { Constructor } from "../ts/types";
import gsap from "gsap";

// Assume Constructor type is defined elsewhere, as per original setup.
// This interface ensures that any class we mix into has the HTMLElement property.
interface HasElement {
  element: HTMLElement;
}

// Extend the IMagnetic interface for clarity and type safety.
interface IMagnetic {
  magneticStrength: number;
  setMagneticStrength(strength: number): void;
  applyMagneticEffect(el: HTMLElement, clientX: number, clientY: number): void;
  removeMagneticEffect(el: HTMLElement): void;
}

// This mixin now requires the base class to satisfy HasElement interface.
function MagneticMixin<T>(Base: T) {
  return class extends Base implements IMagnetic {
    magneticStrength: number = 100;

    constructor(...args: any[]) {
      super(...args);
    }

    setMagneticStrength(strength: number): void {
      this.magneticStrength = strength;
    }

    applyMagneticEffect(el: HTMLElement, clientX: number, clientY: number): void {
      const { left, top, width, height } = el.getBoundingClientRect();
      const strength = this.magneticStrength;

      gsap.to(el, {
        duration: 1.5,
        x: ((clientX - left) / width - 0.5) * strength,
        y: ((clientY - top) / height - 0.5) * strength,
        rotate: "0.001deg",
        ease: "Power4.easeOut",
      });
    }

    removeMagneticEffect(el: HTMLElement): void {
      gsap.to(el, {
        duration: 1.5,
        x: 0,
        y: 0,
        ease: "Elastic.easeOut",
      });
    }
  };
}

export default MagneticMixin;


// import gsap from "gsap";
// import { Constructor } from "../ts/types";

// interface IMagnetic {
//   magneticStrength: number;
//   setMagneticStrength(strength: number): void;
//   applyMagneticEffect(el: HTMLElement, clientX: number, clientY: number): void;
//   removeMagneticEffect(el: HTMLElement): void;
// }

// function MagneticMixin<T extends new (...args: any[]) => any>(Base: T) {
//   return class extends Base implements IMagnetic {
//     magneticStrength: number = 100;

//     constructor(...args: any[]) {
//       const element = args[0];
//       const config = args[1];
//       super(element as HTMLElement, config);
//     }

//     setMagneticStrength(strength: number): void {
//       this.magneticStrength = strength;
//     }

//     applyMagneticEffect(el, clientX, clientY) {
//       const { left, top, width, height } = el.getBoundingClientRect();
//       const strength = this.magneticStrength;

//       gsap.to(el, 1.5, {
//         x: ((clientX - left) / width - 0.5) * strength,
//         y: ((clientY - top) / height - 0.5) * strength,
//         rotate: "0.001deg",
//         ease: "Power4.easeOut",
//       });
//     }

//     removeMagneticEffect(el) {
//       gsap.to(el, 1.5, {
//         x: 0,
//         y: 0,
//         ease: "Elastic.easeOut",
//       });
//     }
//   };
// }

// export default MagneticMixin;
