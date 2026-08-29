"use client";

import { useEffect, useRef } from "react";
import NextImage from "next/image";
import {
  LIQUID_GLASS_FRAGMENT,
  LIQUID_GLASS_VERTEX,
} from "../lib/liquidGlassShaders";
import { getGlassLayout } from "../lib/glassLayout";

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function getGl(canvas: HTMLCanvasElement) {
  const options: WebGLContextAttributes = {
    alpha: true,
    antialias: true,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  };
  return (
    canvas.getContext("webgl2", options) || canvas.getContext("webgl", options)
  );
}

function uploadTexture(gl: WebGLRenderingContext, source: TexImageSource) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const webgl2 =
    typeof WebGL2RenderingContext !== "undefined" &&
    gl instanceof WebGL2RenderingContext;
  if (webgl2) {
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  const anisotropic =
    gl.getExtension("EXT_texture_filter_anisotropic") ||
    gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  if (anisotropic) {
    const max = gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    gl.texParameterf(
      gl.TEXTURE_2D,
      anisotropic.TEXTURE_MAX_ANISOTROPY_EXT,
      Math.min(8, max),
    );
  }
}

export type LiquidGlassFit = "cover" | "contain" | "fill";

const FIT_UNIFORM: Record<LiquidGlassFit, number> = {
  cover: 0,
  contain: 1,
  fill: 2,
};

const DEFAULT_FOCUS: [number, number] = [0.5, 0.2];

interface LiquidGlassCanvasProps {
  src: string;
  fit?: LiquidGlassFit;
  focus?: [number, number];
  priority?: boolean;
}

export function LiquidGlassCanvas({
  src,
  fit = "cover",
  focus = DEFAULT_FOCUS,
  priority = false,
}: LiquidGlassCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusX = focus[0];
  const focusY = focus[1];

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = getGl(canvas);
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, LIQUID_GLASS_VERTEX);
    const frag = compile(gl, gl.FRAGMENT_SHADER, LIQUID_GLASS_FRAGMENT);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([8, 8, 8, 255]),
    );

    const aPos = gl.getAttribLocation(program, "aPos");
    const uFit = gl.getUniformLocation(program, "uFit");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uImageSize = gl.getUniformLocation(program, "uImageSize");
    const uFocus = gl.getUniformLocation(program, "uFocus");
    const uZoom = gl.getUniformLocation(program, "uZoom");
    const uImage = gl.getUniformLocation(program, "uImage");

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(uImage, 0);
    gl.uniform1f(uFit, FIT_UNIFORM[fit]);
    gl.uniform2f(uFocus, focusX, focusY);
    gl.uniform1f(uZoom, 1);
    gl.uniform2f(uImageSize, 1, 1);

    let bitmap: ImageBitmap | null = null;
    let cancelled = false;
    let imgW = 1;
    let imgH = 1;

    const paint = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resize = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const dpr = Math.min(coarse ? 1.75 : 2, window.devicePixelRatio || 1);
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      const nextW = Math.round(w * dpr);
      const nextH = Math.round(h * dpr);
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      if (fit === "contain" || fit === "fill") {
        wrap.style.setProperty("--glass-pos", "50% 50%");
        wrap.style.setProperty("--glass-zoom", "1");
        gl.uniform2f(uFocus, 0.5, 0.5);
        gl.uniform1f(uZoom, 1);
      } else {
        const layout = getGlassLayout(w, h);
        wrap.style.setProperty("--glass-pos", layout.pos);
        wrap.style.setProperty("--glass-zoom", String(layout.zoom));
        gl.uniform2f(uFocus, layout.focusX, layout.focusY);
        gl.uniform1f(uZoom, layout.zoom);
      }

      paint();
    };

    const applySource = (
      source: TexImageSource,
      width: number,
      height: number,
    ) => {
      if (cancelled) return;
      imgW = Math.max(1, width);
      imgH = Math.max(1, height);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      uploadTexture(gl, source);
      gl.uniform2f(uImageSize, imgW, imgH);
      resize();
      canvas.classList.add("liquid-glass-canvas--ready");
    };

    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      if (typeof createImageBitmap === "function") {
        createImageBitmap(image, { imageOrientation: "none", resizeQuality: "high" })
          .then((next) => {
            bitmap = next;
            applySource(next, next.width, next.height);
          })
          .catch(() => applySource(image, width, height));
        return;
      }
      applySource(image, width, height);
    };
    image.src = src;

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("orientationchange", resize);
    window.visualViewport?.addEventListener("resize", resize);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("orientationchange", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      image.onload = null;
      bitmap?.close();
      canvas.classList.remove("liquid-glass-canvas--ready");
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [fit, focusX, focusY, src]);

  return (
    <div ref={wrapRef} className={`liquid-glass liquid-glass--${fit}`}>
      <NextImage
        src={src}
        alt=""
        fill
        sizes="100vw"
        quality={100}
        preload={priority}
        draggable={false}
        className="liquid-glass__photo"
        style={{
          objectFit: fit === "contain" ? "contain" : fit === "fill" ? "fill" : "cover",
        }}
      />
      <canvas ref={canvasRef} className="liquid-glass-canvas" aria-hidden />
    </div>
  );
}
