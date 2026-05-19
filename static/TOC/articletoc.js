function loadResource(type, attributes) {
  if (type === "style") {
    const style = document.createElement("style");
    style.textContent = attributes.css;
    document.head.appendChild(style);
  }
}

function createTOC() {
  const tocElement = document.createElement("div");
  tocElement.className = "toc";
  const contentContainer = document.querySelector(".markdown-body");

  const headings = contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");

  // 如果没有标题元素，则不创建TOC
  if (headings.length === 0) {
    return;
  }

  // 添加目录标题
  tocElement.insertAdjacentHTML(
    "afterbegin",
    '<div class="toc-title">文章目录</div>',
  );

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id = heading.textContent
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    }
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    link.className = "toc-link";
    link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
    tocElement.appendChild(link);
  });

  // 添加返回顶部
  tocElement.insertAdjacentHTML(
    "beforeend",
    '<a class="toc-end" onclick="window.scrollTo({top:0,behavior: \'smooth\'});">Top</a>',
  );

  contentContainer.prepend(tocElement);
}

function createMobileTOC() {
  const tocElement = document.createElement("div");
  tocElement.className = "toc";
  const contentContainer = document.querySelector(".markdown-body");

  const headings = contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");

  if (headings.length === 0) {
    return;
  }

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id = heading.textContent
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    }
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    link.className = "toc-link";
    link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
    tocElement.appendChild(link);
  });

  contentContainer.appendChild(tocElement);

  // 创建悬浮按钮
  const tocIcon = document.createElement("div");
  tocIcon.className = "toc-icon";
  tocIcon.textContent = "☰";
  tocIcon.onclick = (e) => {
    e.stopPropagation();
    toggleTOC();
  };
  document.body.appendChild(tocIcon);

  document.addEventListener("click", (e) => {
    if (
      tocElement.classList.contains("show") &&
      !tocElement.contains(e.target) &&
      !e.target.classList.contains("toc-icon")
    ) {
      toggleTOC();
    }
  });
}

function toggleTOC() {
  const tocElement = document.querySelector(".toc");
  const tocIcon = document.querySelector(".toc-icon");
  if (tocElement) {
    tocElement.classList.toggle("show");
    tocIcon.classList.toggle("active");
    tocIcon.textContent = tocElement.classList.contains("show") ? "✖" : "☰";
  }
}

// 检测是否为移动端
function isMobile() {
  return window.innerWidth <= 768;
}

document.addEventListener("DOMContentLoaded", function () {
  const isMobileDevice = isMobile();

  const css = `
    :root {
      --toc-bg: #fff;
      --toc-border: #e1e4e8;
      --toc-text: #24292e;
      --toc-hover: #f6f8fa;
      --toc-title-color: #24292e;
      --toc-icon-bg: #fff;
      --toc-icon-color: #ad6598;
      --toc-icon-active-bg: #813c85;
      --toc-icon-active-color: #fff;
    }

    /* 适配博客的暗色模式 - 通过 data-color-mode 属性 */
    [data-color-mode="dark"] {
      --toc-bg: #2d333b;
      --toc-border: #444c56;
      --toc-text: #adbac7;
      --toc-hover: #373e47;
      --toc-title-color: #adbac7;
      --toc-icon-bg: #22272e;
      --toc-icon-color: #ad6598;
      --toc-icon-active-bg: #813c85;
      --toc-icon-active-color: #adbac7;
    }

    /* 系统暗色模式作为后备 */
    @media (prefers-color-scheme: dark) {
      :root:not([data-color-mode="light"]) {
        --toc-bg: #2d333b;
        --toc-border: #444c56;
        --toc-text: #adbac7;
        --toc-hover: #373e47;
        --toc-title-color: #adbac7;
        --toc-icon-bg: #22272e;
        --toc-icon-color: #ad6598;
        --toc-icon-active-bg: #813c85;
        --toc-icon-active-color: #adbac7;
      }
    }

    /* ========== 桌面端样式 ========== */
    @media (min-width: 769px) {
      .toc {
        position: fixed;
        top: 130px;
        left: 50%;
        transform: translateX(50%) translateX(320px);
        width: 220px;
        max-height: 70vh;
        background-color: var(--toc-bg);
        border: 1px solid var(--toc-border);
        border-radius: 8px;
        padding: 12px;
        overflow-y: auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 100;
      }

      .toc-title {
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid var(--toc-border);
        padding-bottom: 8px;
        margin-bottom: 8px;
        color: var(--toc-title-color);
        font-size: 15px;
      }

      .toc-end {
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid var(--toc-border);
        color: var(--toc-text);
        font-size: 13px;
      }

      .toc a {
        display: block;
        color: var(--toc-text);
        text-decoration: none;
        padding: 6px 0;
        font-size: 13px;
        line-height: 1.5;
        border-bottom: 1px solid var(--toc-border);
        transition: background-color 0.2s ease, padding-left 0.2s ease;
      }

      .toc a:last-child {
        border-bottom: none;
      }

      .toc a:hover {
        background-color: var(--toc-hover);
        padding-left: 5px;
      }

      /* 隐藏移动端按钮 */
      .toc-icon {
        display: none !important;
      }
    }

    /* ========== 移动端样式 ========== */
    @media (max-width: 768px) {
      .toc {
        position: fixed;
        bottom: 60px;
        right: 20px;
        width: 250px;
        max-height: 70vh;
        background-color: var(--toc-bg);
        border: 1px solid var(--toc-border);
        border-radius: 6px;
        padding: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow-y: auto;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.9);
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      }

      .toc.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .toc-title {
        display: none;
      }

      .toc-end {
        display: none;
      }

      .toc a {
        display: block;
        color: var(--toc-text);
        text-decoration: none;
        padding: 5px 0;
        font-size: 14px;
        line-height: 1.5;
        border-bottom: 1px solid var(--toc-border);
        transition: background-color 0.2s ease, padding-left 0.2s ease;
      }

      .toc a:last-child {
        border-bottom: none;
      }

      .toc a:hover {
        background-color: var(--toc-hover);
        padding-left: 5px;
      }

      .toc-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        cursor: pointer;
        font-size: 24px;
        background-color: var(--toc-icon-bg);
        color: var(--toc-icon-color);
        border: 2px solid var(--toc-icon-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        z-index: 1001;
        transition: all 0.3s ease;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        outline: none;
      }

      .toc-icon:hover {
        transform: scale(1.1);
      }

      .toc-icon:active {
        transform: scale(0.9);
      }

      .toc-icon.active {
        background-color: var(--toc-icon-active-bg);
        color: var(--toc-icon-active-color);
        border-color: var(--toc-icon-active-bg);
        transform: rotate(90deg);
      }
    }
  `;
  loadResource("style", { css: css });

  // 根据设备类型创建不同的 TOC
  if (isMobileDevice) {
    createMobileTOC();
  } else {
    createTOC();

    // 桌面端添加滚动监听显示/隐藏返回顶部
    window.onscroll = function () {
      const backToTopButton = document.querySelector(".toc-end");
      if (backToTopButton) {
        if (
          document.body.scrollTop > 100 ||
          document.documentElement.scrollTop > 100
        ) {
          backToTopButton.style.visibility = "visible";
        } else {
          backToTopButton.style.visibility = "hidden";
        }
      }
    };
  }

  console.log(
    "\n %c ArticleTOC Plugins https://github.com/Meekdai/Gmeek \n",
    "padding:5px 0;background:#ad6598;color:#fff",
  );
});
