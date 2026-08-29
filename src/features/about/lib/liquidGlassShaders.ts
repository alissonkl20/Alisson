export const LIQUID_GLASS_VERTEX = /* glsl */ `
  attribute vec2 aPos;
  void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

export const LIQUID_GLASS_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uFit;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  uniform vec2 uFocus;
  uniform float uZoom;
  uniform sampler2D uImage;

  vec2 fitUv(vec2 uv) {
    if (uFit > 1.5) {
      return (uv - 0.5) / max(uZoom, 1.0) + 0.5;
    }
    vec2 canvas = uResolution;
    vec2 image = max(uImageSize, vec2(1.0));
    float scaleCover = max(canvas.x / image.x, canvas.y / image.y);
    float scaleContain = min(canvas.x / image.x, canvas.y / image.y);
    float scale = mix(scaleCover, scaleContain, uFit) * max(uZoom, 1.0);
    vec2 scaled = image * scale;
    vec2 extra = max(scaled - canvas, vec2(0.0));
    vec2 letter = max(canvas - scaled, vec2(0.0));
    vec2 offset = extra * clamp(uFocus, vec2(0.0), vec2(1.0)) - letter * 0.5;
    return (uv * canvas + offset) / scaled;
  }

  vec3 sampleImg(vec2 uv) {
    vec2 p = clamp(fitUv(uv), 0.0, 1.0);
    return texture2D(uImage, p).rgb;
  }

  void main() {
    vec2 uv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    vec2 base = fitUv(uv);
    float mask =
      step(0.0, base.x) * step(base.x, 1.0) * step(0.0, base.y) * step(base.y, 1.0);

    float flute = uv.x * 16.0 + sin(uv.y * 2.6) * 0.42;
    float ridge = sin(flute * 6.283185);
    vec2 warp = vec2(ridge * 0.012, ridge * 0.0042) + vec2(
      sin(uv.y * 3.4) * 0.010,
      cos(uv.x * 2.2) * 0.0075
    );
    float ca = 0.0032 + ridge * 0.0008;

    vec3 col;
    col.r = sampleImg(uv + warp + vec2(ca, 0.0)).r;
    col.g = sampleImg(uv + warp).g;
    col.b = sampleImg(uv + warp - vec2(ca, 0.0)).b;

    float sheen = pow(max(0.0, 1.0 - abs(uv.y - 0.38) * 1.45), 2.2) * 0.055;
    col += vec3(0.92, 0.96, 1.0) * sheen;

    gl_FragColor = vec4(col, mask);
  }
`;
