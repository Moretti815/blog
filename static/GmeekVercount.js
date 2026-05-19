function createVercount() {
  // 文章页面浏览量 - 插入到 post-meta-footer 中
  var pageViewContainer = document.getElementById("busuanzi_container_page_pv");
  if (pageViewContainer) {
    pageViewContainer.style.display = "block";
  }
  // 网站总浏览量 - 插入到页脚
  var runday = document.getElementById("runday");
  if (runday) {
    runday.insertAdjacentHTML(
      "afterend",
      '<span id="busuanzi_container_site_pv" style="display:none">总浏览量<span id="busuanzi_value_site_pv"></span>次 • </span>',
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
