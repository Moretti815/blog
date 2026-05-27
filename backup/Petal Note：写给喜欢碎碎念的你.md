# Petal Note：写给喜欢碎碎念的你

*风吹落的花瓣，和那些无处安放的碎碎念。*

---

如果你也在找一个地方记录日常的零碎想法，不想被复杂的博客系统束缚，那 Petal Note 可能正合你意。

## 它是什么

Petal Note 是一个极简的日记框架，简单到只需要一个 TXT 文件就能开始写。所有数据都是明文存储，人可以直接阅读和编辑，不需要数据库，不需要后端。

你可以把它部署在 Vercel、Cloudflare Pages 或者 GitHub Pages 上，完全免费。

官方演示站：[petal-note.vercel.app](https://petal-note.vercel.app/)

---

## 小白玩法：30 分钟搭好你的日记站

### 第一步：初始化项目

在一个空文件夹里运行这个命令，它会引导你创建基本结构：

```bash
curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/main/scripts/create-petal-app.sh | bash -e
```

### 第二步：改配置文件

打开 `public/config.toml`，只需要改几个关键项：

```toml
title = "你的日记"
header_title = "我的碎碎念"
header_subtitle = """
记录生活的小片段
"""

# 这个改成粉色、蓝色或者你喜欢的颜色
theme_color = "#FFB6C1"
```

### 第三步：开始写日记

打开 `public/data.txt`，按这个格式写：

```text
2025-05-27 下午
#日常 今天试着用 Petal Note 搭了个日记站，比想象中简单。
感觉不错，明天继续。

---
2025-05-27 晚上
#感想 写日记这件事，还是随心所欲比较好。
不用在意格式，不用在意字数。
```

格式说明：
- 每篇日记用 `---` 分隔
- 第一行是时间戳，随意写
- 正文里用 `#标签` 可以自动生成标签导航

### 第四步：部署

**方式一：传统静态托管**

把整个文件夹拖到 Vercel 或 Cloudflare Pages，完事。

**方式二：框架和内容分离（推荐）**

这种方式下，你的仓库只存日记内容，框架会自动从官方拉取最新版本。

1. 在 Vercel 新建项目，连接你的 GitHub 仓库
2. 设置 Build Command：
   ```bash
   curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/e310ca1/scripts/build.sh | bash -e -s -- index.html syntax.toml petal-parser.js
   ```
3. 设置 Output Directory 为 `public`

以后每次 push 代码，网站自动更新。

### 第五步：写密码保护的内容

想写一些不想让别人看的东西？创建一个 `private.txt` 文件，然后在 `config.toml` 里加上：

```toml
private_source = "./private.txt"
```

再创建一个 `.env` 文件：

```sh
KEY_private_source="你的密码"
```

这样私密日记会用密码保护，只有输入正确密码才能看到。

### 用网页编辑器写日记

配置好之后，左下角会出现一个小羽毛笔图标，点进去可以网页直接编辑。它会自动帮你推送到 GitHub。

如果想要上传图片功能，需要额外配置一个图床 API。

---

## 进阶玩法：打造专属体验

### 换个字体

把喜欢的字体文件放进 `public/assets/`，然后在 `config.toml` 里指定：

```toml
font = "./assets/你的字体.woff2"
```

### 自定义语法

Petal Note 支持自定义写作语法。比如想写高亮文字：

```toml
[[rules]]
prefix = "=="
suffix = "=="
replacement = "<mark>$1</mark>"
css = "mark { background: #fffacd; padding: 0 4px; border-radius: 3px; }"
```

这样输入 `==这段文字高亮==` 就会显示高亮效果。

编辑器工具栏会自动出现对应的按钮，点击就能插入格式。

### 做个 GitHub 风格的提示框

```toml
[[rules]]
prefix = ":::note\n"
suffix = "\n:::"
replacement = """<div class="gh-alert gh-alert-note"><div class="gh-alert-title">📝 Note</div><div class="gh-alert-body">$1</div></div>"""
css = """
.gh-alert { border-left: 4px solid; padding: 0.6rem 1rem; margin: 0.8rem 0; border-radius: 0 6px 6px 0; }
.gh-alert-note { border-left-color: #0969da; background: rgb(9 105 218 / 4%); }
"""
```

写日记时这样用：

```text
:::note
这是一个提示框，可以用来记录重要的事情。
:::
```

### 完全无服务器的写法

如果想每次保存后立即更新，不需要等部署，可以这样玩：

1. 建两个仓库：一个是内容仓库存日记，一个是托管仓库只放 `config.toml`
2. 用 Cloudflare Workers 代理 GitHub API
3. 在 `config.toml` 里直接写 API 地址

这样写完保存，网页立刻刷新，不用等 CI 构建。

---

## 一些碎碎念

用 Petal Note 写日记这几个月，感觉最舒服的是它的「轻」。不用想排版，不用想分类，想到什么就写什么。回头翻的时候，那些零碎的想法串起来，反而挺有意思的。

它的加密功能也很实用。有些日记确实不想被搜索引擎收录，用 AES-GCM 加密之后，至少多了一层保护。

如果你也想找个地方安放日常的碎碎念，不妨试试看。

---

> Stay gentle, stay pure.
