function createVercount() {
  // 文章页面浏览量 - 插入到 post-meta-footer 中
  var pageViewContainer = document.getElementById("busuanzi_container_page_pv");
  if (pageViewContainer) {
    pageViewContainer.style.display = "block";
  }
  // 网站统计信息 - 插入到 site-stats 中
  var siteStats = document.getElementById("site-stats");
  if (siteStats) {
    siteStats.innerHTML =
      '总浏览量<span id="busuanzi_value_site_pv">0</span>次 • 访客量<span id="busuanzi_value_site_uv">0</span>人 • ';
  }
  // 在 runday 后添加总访客数容器（类似 busuanzi_container_site_pv）
  var runday = document.getElementById("runday");
  if (runday) {
    runday.insertAdjacentHTML(
      "afterend",
      '<span id="busuanzi_container_site_uv" style="display:none">总访客数<span id="busuanzi_value_site_uv"></span>人 • </span>',
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createVercount();
  var element = document.createElement("script");
  element.src = "https://vercount.one/js";
  document.head.appendChild(element);
  console.log(
    "\n %c GmeekVercount Plugins https://github.com/Meekdai/Gmeek \n",
    "padding:5px 0;background:#bc4c00;color:#fff",
  );
});
