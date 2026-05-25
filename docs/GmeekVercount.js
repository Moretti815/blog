function createVercount() {
  // 文章页面浏览量 - 插入到 post-meta-footer 中
  var pageViewContainer = document.getElementById("busuanzi_container_page_pv");
  if (pageViewContainer) {
    pageViewContainer.style.display = "block";
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
