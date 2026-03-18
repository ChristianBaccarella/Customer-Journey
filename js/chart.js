/**
 * chart.js — Emotion Curve Chart
 * Renders a smooth line chart on a <canvas> element showing the
 * customer's emotional arc across the 5 journey stages.
 */

/* global STAGE_NAMES, EMOTION_COLORS */

'use strict';

const EmotionChart = (() => {

  /**
   * Draw the emotion curve on the canvas.
   * @param {HTMLCanvasElement} canvas
   * @param {number[]} values  Array of 5 emotion values (1–5)
   * @param {string[]} stageNames  Array of 5 stage labels
   */
  function draw(canvas, values, stageNames) {
    const dpr   = window.devicePixelRatio || 1;
    const W_CSS = canvas.parentElement.clientWidth || 700;
    const H_CSS = Math.max(200, Math.min(260, W_CSS * 0.32));

    canvas.width  = W_CSS * dpr;
    canvas.height = H_CSS * dpr;
    canvas.style.width  = W_CSS  + 'px';
    canvas.style.height = H_CSS + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W_CSS, H_CSS);

    const PAD_TOP    = 24;
    const PAD_BOTTOM = 52;
    const PAD_LEFT   = 44;
    const PAD_RIGHT  = 20;

    const chartW = W_CSS - PAD_LEFT - PAD_RIGHT;
    const chartH = H_CSS - PAD_TOP  - PAD_BOTTOM;

    const n = values.length;  // 5

    // ---- Helpers ----
    function xPos(i) { return PAD_LEFT + (i / (n - 1)) * chartW; }
    function yPos(v) { return PAD_TOP + chartH - ((v - 1) / 4) * chartH; }

    // ---- Background grid ----
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth   = 1;
    for (let level = 1; level <= 5; level++) {
      const y = yPos(level);
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(PAD_LEFT + chartW, y);
      ctx.stroke();
    }

    // ---- Y-axis labels ----
    const LABELS = ['', '😤', '😟', '😐', '😊', '😄'];
    ctx.fillStyle    = '#94A3B8';
    ctx.font         = `12px Inter, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    for (let level = 1; level <= 5; level++) {
      ctx.fillText(LABELS[level], PAD_LEFT - 18, yPos(level));
    }

    // ---- Coloured area fill under curve ----
    const grad = ctx.createLinearGradient(0, PAD_TOP, 0, PAD_TOP + chartH);
    grad.addColorStop(0,   'rgba(6, 182, 212, 0.18)');
    grad.addColorStop(0.5, 'rgba(234,179,8, 0.12)');
    grad.addColorStop(1,   'rgba(239,68,68, 0.10)');

    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(values[0]));
    _smoothPath(ctx, values, xPos, yPos);
    ctx.lineTo(xPos(n - 1), PAD_TOP + chartH);
    ctx.lineTo(xPos(0),     PAD_TOP + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // ---- Line ----
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(values[0]));
    _smoothPath(ctx, values, xPos, yPos);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = 'round';
    ctx.stroke();

    // ---- Data points ----
    for (let i = 0; i < n; i++) {
      const x   = xPos(i);
      const y   = yPos(values[i]);
      const col = _emotionColor(values[i]);

      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = col + '33';
      ctx.fill();

      // Filled circle
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle   = col;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 2;
      ctx.fill();
      ctx.stroke();

      // Value label above
      ctx.fillStyle    = '#1E293B';
      ctx.font         = 'bold 11px Inter, sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(values[i]), x, y - 12);
    }

    // ---- X-axis stage labels ----
    ctx.fillStyle    = '#475569';
    ctx.font         = '11px Inter, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    const maxLabelW  = chartW / n - 4;
    for (let i = 0; i < n; i++) {
      const x     = xPos(i);
      const label = stageNames[i] || ('Stage ' + (i + 1));
      // Truncate if too long
      const truncated = _truncateLabel(ctx, label, maxLabelW);
      ctx.fillText(truncated, x, PAD_TOP + chartH + 12);
    }
  }

  /**
   * Draw a smooth catmull-rom like path through points.
   */
  function _smoothPath(ctx, values, xPos, yPos) {
    const n = values.length;
    for (let i = 1; i < n; i++) {
      const x0 = xPos(i - 1), y0 = yPos(values[i - 1]);
      const x1 = xPos(i),     y1 = yPos(values[i]);
      const cpx = (x0 + x1) / 2;
      ctx.bezierCurveTo(cpx, y0, cpx, y1, x1, y1);
    }
  }

  /** Returns an emotion color for a value 1–5 */
  function _emotionColor(v) {
    const colors = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4'];
    return colors[Math.round(v)] || '#3B82F6';
  }

  /** Truncate a text label to fit within maxW pixels */
  function _truncateLabel(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let truncated = text;
    while (truncated.length > 1 && ctx.measureText(truncated + '…').width > maxW) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '…';
  }

  return { draw };
})();
