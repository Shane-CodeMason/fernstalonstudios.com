// Home page background: the game development cycle as a three-depth scroll parallax.
// Far: drifting pixel dust. Middle: six pixel-art stages that slide past slower than the page.
// Near: the Pixel Frond from the logo, growing up the right edge as the reader scrolls.
(function () {
  var root = document.querySelector('.dev-cycle');
  if (!root) return;

  var STAGES = [
    ['01', 'SPARK', 'An idea worth chasing.', [
      '......####......','....##....##....','...#........#...','..#..........#..','..#....##....#..','..#...#..#...#..','..#......#...#..','...#....#...#...',
      '...#...#....#...','....#......#....','.....#....#.....','.....######.....','.....#....#.....','.....######.....','......####......','................']],
    ['02', 'SKETCH', 'Paper, pencil, plans.', [
      '............##..','...........#..#.','..........#..#..','.........#..#...','........#..#....','.......#..#.....','......#..#......','.....#..#.......',
      '....#..#........','...#..#.........','..###...........','..##............','..#.............','................','.##..##..##..##.','#..##..##..##..#']],
    ['03', 'CODE', 'The systems that make it tick.', [
      '................','................','................','..........#.....','...#......#.#...','..#......#...#..','.#.......#....#.','#.......#......#',
      '#......#.......#','.#.....#......#.','..#...#......#..','...#..#.....#...','.....#..........','................','................','................']],
    ['04', 'CRAFT', 'Art, sound and feel.', [
      '..............##','.............###','............###.','...........###..','..........###...','.........###....','........###.....','.......###......',
      '..#...###.......','...#.###........','....###.........','....###.........','...##.##........','..##............','.##.............','................']],
    ['05', 'PLAYTEST', 'Break it, fix it, play again.', [
      '................','................','................','................','...##########...','..#..........#..','.#...#.....#..#.','.#..###...#.#.#.',
      '.#...#.....#..#.','.#............#.','.#....####....#.','.#...#....#...#.','..###......###..','................','................','................']],
    ['06', 'LAUNCH', 'Into players’ hands.', [
      '.......##.......','......####......','.....##..##.....','.....#....#.....','.....#.##.#.....','.....#.##.#.....','.....#....#.....','.....#....#.....',
      '....##....##....','...#.#....#.#...','..#..######..#..','..####....####..','......#..#......','.....#.##.#.....','......#..#......','.......##.......']]
  ];
  var GOLD = '#D9A441', LILAC = '#B9A6D9', LEAF = '#B98330', TIP = '#F7E2A6';
  var SVGNS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pathFor(map) {
    var d = '';
    for (var r = 0; r < 16; r++) for (var c = 0; c < 16; c++) if ((map[r] || '')[c] === '#') d += 'M' + c + ' ' + r + 'h1v1h-1z';
    return d;
  }
  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; parent.appendChild(e); return e; }

  // Far layer.
  var dust = el('div', 'dust', root), seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  for (var i = 0; i < 56; i++) {
    var p = el('i', '', dust), s = rnd() < 0.7 ? 3 : 6;
    p.style.cssText = 'left:' + (rnd() * 100).toFixed(2) + '%;top:' + (rnd() * 100).toFixed(2) + '%;width:' + s + 'px;height:' + s + 'px;background:' +
      (rnd() < 0.3 ? GOLD : '#8E7BB0') + ';opacity:' + (0.18 + rnd() * 0.35).toFixed(2);
  }

  // Middle layer.
  var stages = STAGES.map(function (st, i) {
    var color = i % 2 === 0 ? GOLD : LILAC;
    var box = el('div', 'stage ' + (i % 2 === 0 ? 'left' : 'right'), root);
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16'); svg.setAttribute('shape-rendering', 'crispEdges'); svg.style.fill = color;
    var path = document.createElementNS(SVGNS, 'path'); path.setAttribute('d', pathFor(st[3])); svg.appendChild(path); box.appendChild(svg);
    var t = el('div', 't', box); t.textContent = st[0] + ' · ' + st[1]; t.style.color = color;
    el('div', 'l', box).textContent = st[2];
    return box;
  });

  // Near layer: stem, curl, talon tip and six alternating leaflets.
  var fern = el('div', 'fern', root), STEM = 10, X = 56;
  function pixel(color, op) { var e = el('i', '', fern); e.style.background = color; e.style.opacity = op; return e; }
  var stem = pixel(GOLD, 0.55); stem.style.left = X + 'px'; stem.style.bottom = '0';
  var curl = [[0, 0], [10, 10], [20, 10], [30, 0], [30, -10]].map(function (q) { var e = pixel(GOLD, 0.55); e.q = q; return e; });
  var tip = pixel(TIP, 0.8); tip.q = [20, -20];
  var leaves = [];
  for (var li = 0; li < STAGES.length; li++) {
    var len = 4 - Math.floor(li / 2), dir = li % 2 === 0 ? -1 : 1, group = [];
    for (var k = 0; k < len; k++) { var e = pixel(LEAF, 0); e.dx = dir * (k + 1) * STEM; e.dy = Math.floor(k / 2) * STEM; group.push(e); }
    leaves.push(group);
  }
  var loop = el('div', 'loop', root); loop.textContent = '↻ BACK TO THE SPARK';

  var raf = 0;
  function update() {
    raf = 0;
    var doc = document.scrollingElement || document.documentElement;
    var vh = window.innerHeight || 900, max = Math.max(1, doc.scrollHeight - vh);
    var p = Math.min(1, Math.max(0, doc.scrollTop / max)), n = STAGES.length - 1;
    dust.style.transform = reduce ? '' : 'translateY(' + (-(p * max) * 0.1).toFixed(1) + 'px)';
    stages.forEach(function (box, i) {
      var at = i / n, d = (at - p) * max, near = 1 - Math.min(1, Math.abs(p - at) * n);
      var top = reduce ? vh * (0.18 + 0.64 * at) : vh * 0.55 + d * 0.5;
      var rot = reduce ? 0 : Math.max(-8, Math.min(8, d * 0.008));
      box.style.top = top.toFixed(1) + 'px';
      box.style.opacity = (0.07 + 0.33 * near).toFixed(3);
      box.style.transform = 'translateY(-50%) rotate(' + rot.toFixed(2) + 'deg) scale(' + (0.86 + 0.14 * near).toFixed(3) + ')';
    });
    var full = vh * 0.84, h = Math.round((vh * 0.1 + full * p) / STEM) * STEM;
    stem.style.height = h + 'px';
    curl.concat([tip]).forEach(function (e) { e.style.left = (X + e.q[0]) + 'px'; e.style.bottom = (h + e.q[1]) + 'px'; });
    leaves.forEach(function (group, i) {
      var base = Math.round((vh * 0.06 + full * (i + 0.4) / STAGES.length) / STEM) * STEM, shown = h - 30 >= base;
      group.forEach(function (e) { e.style.left = (X + e.dx) + 'px'; e.style.bottom = (base + e.dy) + 'px'; e.style.opacity = shown ? 0.5 : 0; });
    });
    loop.style.opacity = p > 0.97 ? 0.9 : 0;
  }
  function queue() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
})();
