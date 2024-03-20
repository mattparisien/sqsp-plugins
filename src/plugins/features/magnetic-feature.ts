import { IMagneticFeature } from "../interfaces";

type Constructor<T = {}> = new (...args: any[]) => T;
type AbstractConstructor<T = {}> = Function & { prototype: T };

function MagneticFeature<T extends Constructor | AbstractConstructor>(Base: T) {
  return class extends (Base as Constructor) implements IMagneticFeature {
    magneticStrength: number = 100;

    adjustMagneticStrength(strength: number): void {
      this.magneticStrength = strength;
      console.log(`Magnetic strength adjusted to ${this.magneticStrength}`);
    }
  };
}

export default MagneticFeature;
