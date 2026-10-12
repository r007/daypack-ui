/** Inline SVG "photos" so stories need no network access or third-party images. */
export function art(hue: number, width = 800, height = 450, label = ''): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${hue} 60% 62%)'/><stop offset='1' stop-color='hsl(${(hue + 50) % 360} 55% 34%)'/></linearGradient></defs>
<rect width='${width}' height='${height}' fill='url(#g)'/>
<circle cx='${width * 0.78}' cy='${height * 0.28}' r='${Math.min(width, height) * 0.1}' fill='rgba(255,255,255,0.55)'/>
<path d='M0 ${height} L${width * 0.3} ${height * 0.55} L${width * 0.5} ${height * 0.78} L${width * 0.72} ${height * 0.45} L${width} ${height} Z' fill='rgba(0,0,0,0.25)'/>
${label ? `<text x='24' y='${height - 24}' font-family='sans-serif' font-size='${Math.round(height / 12)}' fill='white'>${label}</text>` : ''}
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
