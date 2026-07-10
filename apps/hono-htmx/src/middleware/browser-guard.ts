import { isNumeric } from '@olsen-mono/core-utils';
import { createMiddleware } from 'hono/factory';

export const browserGuard = createMiddleware(async (c, next) => {
  const userAgent = c.req.header('user-agent') || '';
  const MIN_CHROME_VERSION = 129;

  const chromeMatch = userAgent.match(/(?:Chrome|Chromium|CriOS)\/(\d+)/);

  if (process.env.NODE_ENV === 'production') {
    if (!chromeMatch) {
      c.status(403);
      c.res = c.html(getErrorTemplate());
      return;
    }

    const majorVersion = isNumeric(chromeMatch[1]) ? parseInt(chromeMatch[1], 10) : 0;

    if (majorVersion < MIN_CHROME_VERSION) {
      c.status(403);
      c.res = c.html(getErrorTemplate(majorVersion, MIN_CHROME_VERSION));
      return;
    }
  }

  await next();
});

function getErrorTemplate(currentVersion?: number, requiredVersion?: number) {
  const versionMeta = currentVersion
    ? `<p>Your detected version: <span style="color: #dc2626;">v${currentVersion}</span></p>`
    : '';

  return `
    <div style="padding: 3rem 2rem; font-family: sans-serif; text-align: center; max-width: 500px; margin: 0 auto;">
      <h1 style="color: #111827; font-size: 1.5rem;">Your browser is not yet supported. 🚀</h1>
      ${versionMeta}
      <p style="color: #4b5563;">Please upgrade to <strong>Google Chrome >= v${requiredVersion || 129}</strong> or any modern Chromium-based environment.</p>
    </div>
  `;
}
