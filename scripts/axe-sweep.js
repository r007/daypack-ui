/**
 * Accessibility sweep over every Storybook story, using axe-core in a real browser.
 *
 * 1. pnpm build:storybook
 * 2. cp node_modules/axe-core/axe.min.js storybook-static/
 * 3. serve storybook-static (e.g. `python3 -m http.server 6113 -d storybook-static`)
 * 4. open http://localhost:6113/iframe.html?id=components-button--default in a browser,
 *    paste this file into the DevTools console, then read `window.__axe` when `done` is true.
 */
window.__axe = { done: false, results: {}, total: 0 };
(async () => {
  const index = await (await fetch('/index.json')).json();
  const ids = Object.values(index.entries).filter((e) => e.type === 'story').map((e) => e.id);
  window.__axe.total = ids.length;
  const axeSrc = await (await fetch('/axe.min.js')).text();
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:900px;border:0;opacity:0;pointer-events:none';
  document.body.appendChild(frame);
  for (const id of ids) {
    await new Promise((resolve) => {
      let finished = false;
      const done = () => { if (!finished) { finished = true; resolve(); } };
      frame.onload = done;
      frame.src = `/iframe.html?id=${id}&viewMode=story&t=${Date.now()}`;
      setTimeout(done, 6000);
    });
    await new Promise((r) => setTimeout(r, 250));
    try {
      const win = frame.contentWindow;
      win.eval(axeSrc);
      const root = frame.contentDocument.getElementById('storybook-root') || frame.contentDocument.body;
      const res = await win.axe.run(root, { resultTypes: ['violations'] });
      window.__axe.results[id] = res.violations.map((v) => ({ rule: v.id, impact: v.impact, count: v.nodes.length, html: v.nodes[0].html.slice(0, 140) }));
    } catch (e) {
      window.__axe.results[id] = [{ rule: 'ERROR', message: String(e) }];
    }
  }
  window.__axe.done = true;
})();
