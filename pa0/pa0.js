
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;
var rotatedDegrees = 0;
// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
  return degrees * Math.PI / 180;
}


function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
}

function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
 
  /*
  * TODO: Your code goes here 
  * Edit the triangleVertices mesh definition below.
  * Make it into letters U, C and I.
  * Don't forget to update the buffer parameters below,
  * if you change the number of elements.
  */
  var vertices = [
    // Letter U
    // Triangle 1
    -0.75, -0.5,  0.0, //left
    -0.75,  0.05,  0.0, //top
    -0.69, 0.05,  0.0, //right
    // Triangle 2
    -0.75, -0.5, 0.0, //left
    -0.69, 0.05, 0.0, // top
    -0.69, -0.5, 0.0, //right
    // Triangle 3
    -0.69, -0.5, 0.0, // left
    -0.69, -0.45, 0.0, //top
    -0.39, -0.45, 0.0, //right
    // Triangle 4
    -0.69, -0.5, 0.0, // left
    -0.39, -0.45, 0.0, // top
    -0.39, -0.5, 0.0, // right

    // Triangle 5
    -0.39, -0.5, 0.0, // left
    -0.39, 0.05, 0.0, // top
    -0.33, -0.5, 0.0, // right

    // Triangle 6
    -0.33, -0.5, 0.0, // left
    -0.39, 0.05, 0.0, // top
    -0.33, 0.05, 0.0, // right

    // Letter C
    // Triangle 7
    -0.28, -0.5, 0.0, // left
    -0.28, 0.05, 0.0, // top
    -0.22, -0.5, 0.0, // right

    // Triangle 8
    -0.22, -0.5, 0.0, // left
    -0.28, 0.05, 0.0, // top
    -0.22, 0.05, 0.0, // right

    // Triangle 9
    -0.22, -0.01, 0.0, // left
    -0.22, 0.05, 0.0, // top
    0.08, -0.01, 0.0, // right

    // Triangle 10
    -0.22, 0.05, 0.0, // left
    0.08, 0.05, 0.0, // top
    0.08, -0.01, 0.0, // right

    // Triangle 11
    -0.22, -0.5, 0.0, // left
    -0.22, -0.44, 0.0, // top
    0.08, -0.44, 0.0, // right

    // Triangle 12
    -0.22, -0.5, 0.0, // left
    0.08, -0.44, 0.0, // top
    0.08, -0.5, 0.0, // right

    // Letter I
    // Triangle 13
    0.13, -0.5, 0.0, // left
    0.13, 0.05, 0.0, // top
    0.19, 0.05, 0.0, // right

    // Triangle 14
    0.13, -0.5, 0.0, // left
    0.19, 0.05, 0.0, // top
    0.19, -0.5, 0.0 // right

  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 42;
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
 /*
  * TODO: Your code goes here 
  * Change and edit the colors here. Assign color for each vertex.
  * Make sure to match the edits you made to the positions above.
  * Don't forget to update the buffer parameters below,
  * if you change the number of elements.
  */
  var colors = [
    // red, green, blue, alpha (alpha is opacity - 1 is 100%)
    // pastel blue
    .1, .35, .5, .45,
    .1, .35, .5, .45,
    .1, .35, .5, .45,

    // pastel pink
    .45, .15, .15, .45,
    .45, .15, .15, .45,
    .45, .15, .15, .45,

    // pastel green
     0.05, .5, .15, .45,
     0.05, .5, .15, .45,
     0.05, .5, .15, .45,
  
    // pastel yellow
    .45, .45, .1, .45,
    .45, .45, .1, .45,
    .45, .45, .1, .45,

    // pastel purple
    .45, .1, .5, .45,
    .45, .1, .5, .45,
    .45, .1, .5, .45,
    .1, .35, .5, .45,
    .1, .35, .5, .45,
    .1, .35, .5, .45,

    // pastel pink
    .45, .15, .15, .45,
    .45, .15, .15, .45,
    .45, .15, .15, .45,

    // pastel green
     0.05, .5, .15, .45,
     0.05, .5, .15, .45,
     0.05, .5, .15, .45,
  
    // pastel yellow
    .45, .45, .1, .45,
    .45, .45, .1, .45,
    .45, .45, .1, .45,

    // pastel purple
    .45, .1, .5, .45,
    .45, .1, .5, .45,
    .45, .1, .5, .45,

    .1, .35, .5, .45,
    .1, .35, .5, .45,
    .1, .35, .5, .45,

    // pastel pink
    .45, .15, .15, .45,
    .45, .15, .15, .45,
    .45, .15, .15, .45,

    // pastel green
     0.05, .5, .15, .45,
     0.05, .5, .15, .45,
     0.05, .5, .15, .45,
  
    // pastel yellow
    .45, .45, .1, .45,
    .45, .45, .1, .45,
    .45, .45, .1, .45
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 6;  
}

function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);
  rotatedDegrees = (rotatedDegrees + 1) % 360;
  mat4.translate(mvMatrix, mvMatrix, [0, 0, 0]);
  mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotatedDegrees));
  mat4.translate(mvMatrix, mvMatrix, [0.25, 0.2, 0]);
 /*
  * TODO: Your code goes here
  * Transformations can be implemented as modifications to the model view matrix
  * using mat4.scale, mat4.rotate, mat4.translate... 
  * You should implement
  * (1) Properly change the transformation to keep the letters U, C, and I always
  *     inside the canvas (the letters should always be completely shown)
  * (2) Animate the letters by rotating them. The draw function is called
  *     regularly with fixed time interval, so what you need is to declare a global
  *     variable "rotatedDegrees", and inside draw() function, increase its value
  *     by fixed interval (You may want to keep it between 0-360, so consider using mod %).
  *     And then rotate the scene by rotatedDegrees along z axis. 
  */
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}
