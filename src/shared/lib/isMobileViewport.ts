const MOBILE_VIEWPORT_MAX_WIDTH = 768;
const MOBILE_USER_AGENT_PATTERN = /Android|iPad|iPhone|Mobile/i;

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia(
      `(max-width: ${MOBILE_VIEWPORT_MAX_WIDTH}px)`,
    ).matches ||
    window.screen.width <= MOBILE_VIEWPORT_MAX_WIDTH ||
    MOBILE_USER_AGENT_PATTERN.test(navigator.userAgent)
  );
}
