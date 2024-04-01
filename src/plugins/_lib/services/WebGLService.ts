import CanvasService from "./CanvasService";
import PluginService from "./PluginService";

interface IWebGLService {}

interface IShaders {
  vertex: string,
  fragment: string;
}

class WebGLService extends PluginService implements IWebGLService {
  private _canvasService: CanvasService | null = null;
  private _gl: WebGLRenderingContext | null = null;
  private _cnv: HTMLCanvasElement | null = null;
  private _buffers: WebGLBuffer = null;
  private _vsSource: string | null = null;
  private _fsSource: string | null = null;

  constructor(cnv: HTMLCanvasElement, shaders: IShaders) {
    super();
    this._canvasService = new CanvasService(cnv, "webgl");
    this._gl = this._canvasService.context as WebGLRenderingContext;
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

    this._buffers = positionBuffer;
  }

  private loadShader(source, type) {
    const shader = this._gl.createShader(type);
    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + this._gl.getShaderInfoLog(shader));
        this._gl.deleteShader(shader);
        return null;
    }

    return shader;
  }

  public initShaders() {

    if (!this._fsSource || !this._vsSource) {
      throw new Error("Unable to init shaders. Both vertex and fragment shaders must be passed into WebGLService constructor");
    } 


    const vertexShader = this.loadShader(this._gl.VERTEX_SHADER, this._vsSource);
    const fragmentShader = this.loadShader(this._gl.FRAGMENT_SHADER, this._fsSource);

    const shaderProgram = this._gl.createProgram();
    this._gl.attachShader(shaderProgram, vertexShader);
    this._gl.attachShader(shaderProgram, fragmentShader);
    this._gl.linkProgram(shaderProgram);

    if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
        throw new Error('Unable to initialize the shader program: ' + this._gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
  }

  // private drawScene() {
  //   this._gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  //   this._gl.clearDepth(1.0); // Clear everything
  //   this._gl.enable(this._gl.DEPTH_TEST); // Enable depth testing
  //   this._gl.depthFunc(this._gl.LEQUAL); // Near things obscure far things

  //   // Clear the canvas before we start drawing on it.
  //   this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

  //   // Set the positions of vertices
  //   {
  //     const numComponents = 2; // pull out 2 values per iteration
  //     const type = this._gl.FLOAT; // the data in the buffer is 32bit floats
  //     const normalize = false; // don't normalize
  //     const stride = 0; // how many bytes to get from one set of values to the next
  //     const offset = 0; // how many bytes inside the buffer to start from
  //     this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.position);
  //     this._gl.vertexAttribPointer(
  //       programInfo.attribLocations.vertexPosition,
  //       numComponents,
  //       type,
  //       normalize,
  //       stride,
  //       offset
  //     );
  //     this._gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  //   }

  //   // Tell Webthis._gl to use our program when drawing
  //   this._gl.useProgram(programInfo.program);

  //   // Set the shader uniforms
  //   this._gl.uniform2f(
  //     programInfo.uniformLocations.mousePosition,
  //     mousePosition.x,
  //     mousePosition.y
  //   );
  //   this._gl.uniform2f(
  //     programInfo.uniformLocations.resolution,
  //     this._gl.canvas.clientWidth,
  //     this._gl.canvas.clientHeight
  //   );

  //   {
  //     const offset = 0;
  //     const vertexCount = 4;
  //     this._gl.drawArrays(this._gl.TRIANGLE_STRIP, offset, vertexCount);
  //   }
  // }

  public init(): void {
    this.initBuffers();
    this.initShaders();
  }
}

export default WebGLService;
