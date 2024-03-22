export interface IPlugin {
  
  // destroy(): void;
}

export interface IInteractiveFeature {
  clientX: number;
  clientY: number;
  addEventListeners(): void;
  removeEventListeners(): void;
}

export interface IMagneticFeature {
  magneticStrength: number;
  setMagneticStrength(strength: number): void;
  applyMagneticEffect(el: HTMLElement, clientX: number, clientY: number): void;
  removeMagneticEffect(el: HTMLElement): void;
}
