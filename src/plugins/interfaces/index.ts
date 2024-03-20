export interface IPlugin {
    readonly name: string;
    initialize(): void;
    destroy(): void;
  }
  
  export interface IInteractiveFeature {
    addEventListeners(): void;
    removeEventListeners(): void;
  }
  
  export interface IMagneticFeature {
    magneticStrength: number;
    adjustMagneticStrength(strength: number): void;
  }
  