"use client";

import { GLOW_THEMES } from "../lib/themes";
import { useTimelineContext } from "../context/TimelineContext";
import type { GlowThemeKey, PinStyle } from "../types";

const THEME_KEYS = Object.keys(GLOW_THEMES) as GlowThemeKey[];

export function TimelineControls() {
  const {
    config,
    setGlowTheme,
    setGlowIntensity,
    setPinStyle,
    setCurveShape,
    theme,
  } = useTimelineContext();

  return (
    <div className="timeline-controls">
      <div className="timeline-controls__group">
        <span className="timeline-controls__label">Glow</span>
        <div className="timeline-controls__themes">
          {THEME_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`timeline-controls__swatch ${
                config.glowTheme === key ? "is-active" : ""
              }`}
              onClick={() => setGlowTheme(key)}
              aria-label={`${GLOW_THEMES[key].label} theme`}
              aria-pressed={config.glowTheme === key}
              title={GLOW_THEMES[key].label}
            >
              <span
                className="timeline-controls__swatch-dot"
                style={{ background: GLOW_THEMES[key].primary }}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      <label className="timeline-controls__slider">
        <span>Intensity {config.glowIntensity}%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={config.glowIntensity}
          onChange={(e) => setGlowIntensity(Number(e.target.value))}
        />
      </label>

      <label className="timeline-controls__slider">
        <span>Curvature {(config.curveShape * 100).toFixed(0)}%</span>
        <input
          type="range"
          min={40}
          max={100}
          value={config.curveShape * 100}
          onChange={(e) => setCurveShape(Number(e.target.value) / 100)}
        />
      </label>

      <div className="timeline-controls__group">
        <span className="timeline-controls__label">Pin</span>
        <div className="timeline-controls__toggles">
          {(["glass-orb", "diamond-facets"] as PinStyle[]).map((style) => (
            <button
              key={style}
              type="button"
              className={
                config.pinStyle === style ? "is-active" : undefined
              }
              onClick={() => setPinStyle(style)}
              aria-pressed={config.pinStyle === style}
            >
              {style === "glass-orb" ? "Glass" : "Diamond"}
            </button>
          ))}
        </div>
      </div>

      <span
        className="timeline-controls__preview"
        style={{ color: theme.primary }}
      >
        {theme.label}
      </span>
    </div>
  );
}
