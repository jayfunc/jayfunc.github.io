// 1. 中英双语切换逻辑
const translations = {
  zh: {
    logoText: "摘叶飞镖",
    pageTitle: "摘叶飞镖的个人主页",
    heroTitle: "代码之外，黑白之间",
    heroSubtitle: "艺术创作与开源世界",
    artTitle: "个人画作",
    artSubtitle: "用线条勾勒时光，用明暗泼墨心漾",
    art1: "天气之子",
    art2: "超能陆战队",
    art3: "疯狂动物城",
    projTitle: "开源项目",
    proj1Title: "BetterLyrics",
    proj1Desc:
      "BetterLyrics 是一款优雅且高度自定义的歌词可视化与全能音乐播放应用，基于 WinUI3 / Win2D 构建。",
    viewGithub: "前往 GitHub 查看",
  },
  en: {
    logoText: "jayfunc",
    pageTitle: "jayfunc's Space",
    heroTitle: "Beyond Code, Between Black & White",
    heroSubtitle: "Artistry and Open Source",
    artTitle: "Artworks",
    artSubtitle: "Lines to sketch the time, shade to splash the mind",
    art1: "Weathering With You",
    art2: "Big Hero 6",
    art3: "Zootopia",
    projTitle: "Open Source",
    proj1Title: "BetterLyrics",
    proj1Desc:
      "BetterLyrics is an elegant and deeply customizable lyrics visualizer & versatile music player, built with WinUI3 / Win2D.",
    viewGithub: "View on GitHub",
  },
};

// 1. 艺术化中英双语切换逻辑
const langContainer = document.getElementById("lang-switch-container");
const langToggle = document.getElementById("lang-toggle");
const langMenu = document.getElementById("lang-menu");
const currentLangText = document.getElementById("current-lang");
const langOptions = langMenu.querySelectorAll("li");

// 点击展开/收起下拉菜单
langToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // 阻止事件冒泡到 document
  langContainer.classList.toggle("open");
});

// 点击页面空白处自动关闭菜单
document.addEventListener("click", () => {
  langContainer.classList.remove("open");
});

// 选择语言并附带文字淡入淡出动画
langOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    const lang = e.target.getAttribute("data-value");
    const langText = e.target.textContent;

    // 更新UI状态
    currentLangText.textContent = langText;
    langOptions.forEach((opt) => opt.classList.remove("active"));
    e.target.classList.add("active");
    langContainer.classList.remove("open");

    // 执行翻译并附带灵动的淡入淡出效果
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (el.tagName === "TITLE") {
        document.title = translations[lang][key];
      } else {
        // 先变透明，替换文字后再显示
        el.style.opacity = 0;
        setTimeout(() => {
          el.textContent = translations[lang][key];
          el.style.opacity = 1;
        }, 300); // 这里的 300ms 对应 CSS 中的 transition 时间
      }
    });
  });
});

// 2. 日夜主题切换逻辑
const themeSwitch = document.getElementById("theme-switch");
// 尝试获取本地存储的主题，如果没有则跟随系统偏好
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme =
  localStorage.getItem("theme") ||
  (prefersDarkScheme.matches ? "dark" : "light");

document.documentElement.setAttribute("data-theme", currentTheme);

themeSwitch.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  let switchToTheme = theme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", switchToTheme);
  localStorage.setItem("theme", switchToTheme);
});

// 3. 滚动进入视口动画 (灵动感)
const revealElements = document.querySelectorAll(".reveal");

const revealCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      // 如果你希望元素只动画一次，可以取消注释下面这行：
      // observer.unobserve(entry.target);
    }
  });
};

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
revealElements.forEach((el) => revealObserver.observe(el));

// 4. 极简几何背景鼠标跟随逻辑
document.addEventListener("mousemove", (e) => {
  const shapes = document.querySelectorAll(".shape");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  shapes.forEach((shape, index) => {
    // 为不同的形状设置不同的速度，增加层次感
    const speed = (index + 1) * 20;
    shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

// 5. 自定义鼠标跟随与悬停效果 (灵动双层鼠标)
const cursorDot = document.querySelector(".custom-cursor-dot");
const cursorRing = document.querySelector(".custom-cursor-ring");

// 仅在非触屏（有精细指针）的设备上执行
if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
  // 初始化坐标，放在屏幕外避免初始闪烁
  let mouseX = -100,
    mouseY = -100;
  let ringX = -100,
    ringY = -100;

  // 监听鼠标移动
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 小圆点实时跟随，注意这里保留了 translate(-50%, -50%) 来保证绝对居中
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // 大圆环使用缓动算法 (Lerp) 实现顺滑的延迟跟随
  const renderCursor = () => {
    // 0.15 是缓动系数，越小越慢，越大越快
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    // 大圆环同样保留 translate(-50%, -50%) 保证中心点重合
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor); // 保持 60帧 的丝滑动画
  };
  requestAnimationFrame(renderCursor);

  // 为所有需要交互的元素添加悬停效果
  const hoverElements = document.querySelectorAll(
    "a, button, .art-card, .lang-menu li, #lang-toggle",
  );

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("hover");
    });
  });

  // 为所有纯文本元素添加艺术性文本光标效果
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, span, .logo, .art-overlay",
  );

  textElements.forEach((el) => {
    // 排除掉已经是可点击的元素（比如按钮里面的文字），防止效果冲突
    if (
      el.closest("a") ||
      el.closest("button") ||
      el.classList.contains("active")
    )
      return;

    el.addEventListener("mouseenter", () => {
      cursorRing.classList.add("text-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("text-hover");
    });
  });
}
