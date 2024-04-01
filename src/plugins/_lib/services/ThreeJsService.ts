import * as THREE from "three";
import PluginService from "./PluginService";

class ThreeJsService extends PluginService {
  protected container: HTMLElement;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;

  constructor(container: HTMLElement) {
    super();
    this.container = container; // The DOM element to attach the renderer to

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    if (container instanceof HTMLCanvasElement) {
      this.renderer = new THREE.WebGLRenderer({ canvas: container });
    } else {
      this.renderer = new THREE.WebGLRenderer();
    }
  }

  protected onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private start(): void {
    requestAnimationFrame(() => this.start());
    this.render();
  }

  protected render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public getThree() {
    return THREE;
  }

  init(): void {
    // When the container is not a canvas, append the renderer's DOM element
    if (!(this.container instanceof HTMLCanvasElement)) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
    }

    this.camera.position.z = 5;
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.start();
  }
}

export default ThreeJsService;
