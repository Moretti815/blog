function createVercount() {
  // 文章页面浏览量 - 显示 vercount_container_page_pv
  var pageViewContainer = document.getElementById("vercount_container_page_pv");
  if (pageViewContainer) {
    pageViewContainer.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createVercount();
  // 使用 Vercount 官方推荐的脚本地址
  var element = document.createElement("script");
  element.src = "https://events.vercount.one/js";
  element.defer = true;
  document.head.appendChild(element);
  console.log(
    "\n %c GmeekVercount Plugins https://github.com/Meekdai/Gmeek \n",
    "padding:5px 0;background:#bc4c00;color:#fff",
  );
});
