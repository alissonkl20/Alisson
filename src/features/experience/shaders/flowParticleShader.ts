export const flowParticleVertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (280.0 / max(80.0, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

export const flowParticleFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.05, d) * 0.5;
    float alpha = (core + glow) * vAlpha;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor * (1.0 + core * 0.4), alpha);
  }
`;
