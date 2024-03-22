import { IMagneticFeature } from "../interfaces";
import gsap from "gsap";

type Constructor<T = {}> = new (...args: any[]) => T;
type AbstractConstructor<T = {}> = Function & { prototype: T };

function MagneticFeature<T extends Constructor | AbstractConstructor>(Base: T) {
  return class extends (Base as Constructor) implements IMagneticFeature {
    magneticStrength: number = 100;

    setMagneticStrength(strength: number): void {
      this.magneticStrength = strength;
    }

    applyMagneticEffect(el, clientX, clientY) {
      const { left, top, width, height } = el.getBoundingClientRect();
      const strength = this.magneticStrength;

      gsap.to(el, 1.5, {
        x: ((clientX - left) / width - 0.5) * strength,
        y: ((clientY - top) / height - 0.5) * strength,
        rotate: "0.001deg",
        ease: "Power4.easeOut",
      });
    }

    removeMagneticEffect(el) {
      gsap.to(el, 1.5, {
        x: 0,
        y: 0,
        ease: "Elastic.easeOut",
      });
    }
  };
}

export default MagneticFeature;
