import CanvasService from "./CanvasService";
import PluginService from "./PluginService";

interface IWebGLService {}

interface IShaders {
  vertex: string;
  fragment: string;
}

interface IUniformInfo {
  name: string;
}

export interface IUniformData {
  name: string;
  type: "1f" | "1i" | "2f" | "2i" | "3f" | "3i" | "4f" | "4i" | "Matrix4fv";
  value:
    | number
    | [number, number]
    | [number, number, number]
    | [number, number, number, number]
    | Float32Array;
}

export interface IAttributeData {
  name: string; // Name of the attribute in GLSL
  buffer: WebGLBuffer; // Buffer containing the data for this attribute
  size: number; // Number of components per vertex attribute (e.g., 2 for vec2)
  type: GLenum; // Data type of each component in the array
  normalize: GLboolean; // Whether integer data values should be normalized
  stride: GLsizei; // Offset in bytes between consecutive vertex attributes
  offset: GLintptr; // Offset in bytes of the first component in the buffer
}

class WebGLService extends PluginService implements IWebGLService {
  private _canvasService: CanvasService | null = null;
  private _gl: WebGLRenderingContext | null = null;
  private _cnv: HTMLCanvasElement | null = null;
  private _positionBuffer: WebGLBuffer | null = null;
  private _shaderProgram: any | null = null;
  private _vsSource: string | null = null;
  private _fsSource: string | null = null;
  private _uniformsInfo: IUniformInfo[] | null = null;

  public attribLocations: { [key: string]: number };
  public uniformLocations: { [key: string]: WebGLUniformLocation };

  constructor(
    cnv: HTMLCanvasElement,
    shaders: IShaders,
    uniformsInfo: IUniformInfo[]
  ) {
    super();
    this._canvasService = new CanvasService(cnv, "webgl");
    this._gl = this._canvasService.context as WebGLRenderingContext;
    this._uniformsInfo = uniformsInfo;

    if (!this._gl) {
      throw new Error(
        "Unable to initialize WebGL. Your browser may not support it."
      );
    }

    this._cnv = this._canvasService.canvas;
    this._vsSource = shaders?.vertex;
    this._fsSource = shaders?.fragment;
  }

  public getContext() {
    return this._gl;
  }

  public getCanvas() {
    return this._cnv;
  }

  private initBuffers() {
    if (!this._cnv)
      throw new Error(
        "Unable to init WebGL buffers. GL object is null or undefined"
      );

    const positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this._gl.STATIC_DRAW
    );

    this._positionBuffer = positionBuffer;
  }

  private loadShader(source, type) {
    const shader = this._gl.createShader(type);
    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      alert(
        "An error occurred compiling the shaders: " +
          this._gl.getShaderInfoLog(shader)
      );
      this._gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  public initShaders(): WebGLProgram {
    if (!this._fsSource || !this._vsSource) {
      throw new Error(
        "Unable to init shaders. Both vertex and fragment shaders must be passed into WebGLService constructor"
      );
    }

    const vertexShader = this.loadShader(
      this._vsSource,
      this._gl.VERTEX_SHADER
    );
    const fragmentShader = this.loadShader(
      this._fsSource,
      this._gl.FRAGMENT_SHADER
    );

    const shaderProgram = this._gl.createProgram();
    this._gl.attachShader(shaderProgram, vertexShader);
    this._gl.attachShader(shaderProgram, fragmentShader);
    this._gl.linkProgram(shaderProgram);

    if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
      throw new Error(
        "Unable to initialize the shader program: " +
          this._gl.getProgramInfoLog(shaderProgram)
      );
    }

    return shaderProgram;
  }

  public drawScene(uniforms: IUniformData[]) {
    if (!this._gl || !this._shaderProgram) {
      throw new Error("WebGL context or shader program is not initialized.");
    }
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.clearDepth(1.0);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this._gl.useProgram(this._shaderProgram);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    uniforms.forEach((uniform) => {
      const location = this.uniformLocations[uniform.name];
      if (!location) return;
      switch (uniform.type) {
        case "1f":
          this._gl.uniform1f(location, uniform.value as number);
          break;
        case "2f":
          this._gl.uniform2f(location, ...(uniform.value as [number, number]));
          break;
      }
    });
    const vertexCount = 4;
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, vertexCount);
  }

  private setupUniformLocations() {
    if (!this._shaderProgram) {
      console.error("Shader program is not initialized.");
      return;
    }

    this.uniformLocations = this._uniformsInfo.reduce((acc, uniform) => {
      const location = this._gl.getUniformLocation(
        this._shaderProgram,
        uniform.name
      );
      if (location) {
        acc[uniform.name] = location;
      } else {
        console.warn(`Uniform location for "${uniform.name}" not found.`);
      }
      return acc;
    }, {} as { [key: string]: WebGLUniformLocation });
  }

  public init(): void {
    this.initBuffers();
    this._shaderProgram = this.initShaders();
    this.setupUniformLocations();

    const positionAttribLocation = this._gl.getAttribLocation(
      this._shaderProgram,
      "aVertexPosition"
    );
    this._gl.enableVertexAttribArray(positionAttribLocation);
    this._gl.vertexAttribPointer(
      positionAttribLocation,
      2,
      this._gl.FLOAT,
      false,
      0,
      0
    );
  }
}

export default WebGLService;
