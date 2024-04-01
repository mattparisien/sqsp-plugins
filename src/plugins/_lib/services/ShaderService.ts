import * as THREE from "three";
import ThreeJsService from "./ThreeJsService"; // Assuming ThreeJsService is in the same directory

export type TUniforms<T> = { [P in keyof T]: { value: T[P] } };


class ShaderService<T = {}> extends ThreeJsService {
  private _uniforms: TUniforms<T>;
  private _onRenderCallback: (uniforms: TUniforms<T>) => any
  private _onResizeCallback: (uniforms: TUniforms<T>) => any

  constructor(
    container: HTMLElement,
    vertexShader: string,
    fragmentShader: string,
    uniforms: TUniforms<T>,
    onRender: (uniforms: TUniforms<T>) => any,
    onResize: (uniforms: TUniforms<T>) => any
  ) {
    super(container); // Call the parent constructor
    this._uniforms = uniforms;
    this._onRenderCallback = onRender;
    this._onResizeCallback = onResize;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
  }

  protected render(): void {
    this._onRenderCallback?.(this._uniforms);
    super.render();
  }

  protected onWindowResize(): void {
    this._onResizeCallback?.(this._uniforms)
    super.onWindowResize();
  }

  init(): void {
    super.init();
  }
}

export default ShaderService;
