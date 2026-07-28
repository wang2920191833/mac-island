// Mac Island — 首页灵动岛：滚动展开 + Tab 切换 + 电源收起
(function () {
  var stage = document.getElementById('islandStage');
  var island = document.getElementById('island');
  if (!stage || !island) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width:860px)').matches;

  function setP(p) { island.style.setProperty('--p', p.toFixed(3)); }

  // 移动端 / 降帧偏好：直接展开，不绑定滚动
  if (mobile || reduce) { setP(1); return; }

  var hint = document.getElementById('islandHint');
  var raf = null;

  function update() {
    raf = null;
    var rect = stage.getBoundingClientRect();
    var total = stage.offsetHeight - window.innerHeight;
    var scrolled = Math.min(Math.max(-rect.top, 0), total);
    var p = total > 0 ? scrolled / total : 0;
    p = Math.min(p / 0.9, 1);          // 前 90% 滚动内完成展开
    setP(p);
    stage.classList.toggle('expanded', p > 0.5);
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(update); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // 电源键：收起（平滑滚回舞台顶部 → --p 自然归零）
  var power = document.getElementById('islandPower');
  if (power) {
    power.addEventListener('click', function (e) {
      e.stopPropagation();
      var top = stage.getBoundingClientRect().top + window.pageYOffset - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  // Tab 切换
  var tabs = stage.querySelectorAll('.ix-tab');
  var panels = stage.querySelectorAll('.ix-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
      panels.forEach(function (pn) {
        pn.classList.toggle('active', pn.getAttribute('data-panel') === name);
      });
    });
  });
})();
