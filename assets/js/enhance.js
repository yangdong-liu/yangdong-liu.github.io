// 渐进增强：滚动显现动画、导航栏滚动阴影、回到顶部按钮。
// 所有效果都只通过 JS 添加 class 实现；禁用 JS 时页面内容与之前完全一致。
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 回到顶部按钮
  var topBtn = document.createElement("button");
  topBtn.className = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.textContent = "↑";
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.body.appendChild(topBtn);

  // 导航栏滚动阴影 + 回顶按钮显隐
  var navbar = document.querySelector(".navbar");
  function onScroll() {
    if (navbar) {
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 8);
    }
    topBtn.classList.toggle("visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 滚动显现（尊重减少动效偏好；不支持 IntersectionObserver 时跳过）
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll(
    ".post-header, .profile, h2.paper-section, .paper-entry, .news .table-responsive, .post-list li, .projects .card-item, .featured-posts .card-item"
  );
  if (targets.length === 0) return;

  targets.forEach(function (el, i) {
    el.classList.add("io-reveal");
    el.style.transitionDelay = Math.min((i % 8) * 45, 300) + "ms";
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  targets.forEach(function (el) {
    io.observe(el);
  });
})();
