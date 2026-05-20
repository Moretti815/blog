# 📬 博客更新订阅功能

本博客支持通过 GitHub Issues 实现零成本、零配置的更新订阅功能。

## 原理

利用 GitHub Issues 的原生订阅机制：
1. 创建一个专门的订阅 Issue
2. 每当有新文章发布时，自动在该 Issue 下发布评论
3. 订阅了该 Issue 的用户会收到 GitHub 邮件通知

## 优点

- ✅ **零成本**：完全免费，使用 GitHub 自带功能
- ✅ **不会被当垃圾邮件**：GitHub 邮件可信度高
- ✅ **零配置**：读者只需点击 Subscribe 即可
- ✅ **可追溯**：所有更新历史都在 Issue 评论中

## 使用方法

### 对于读者

1. 点击博客页脚中的 **🔔 订阅更新** 链接
2. 跳转到 GitHub Issue 页面
3. 点击右上角的 **Subscribe** 按钮（或评论任意内容自动订阅）
4. 以后每当有新文章，你会收到 GitHub 邮件通知

### 对于博主

#### 1. 创建订阅 Issue

在博客仓库中创建一个新的 Issue：
- **标题**：`🎉 Moretti's Blog 更新订阅`（或其他你喜欢的标题）
- **内容**：
  ```markdown
  ## 订阅说明

  订阅本 Issue，每当博客有新文章发布时，你将收到 GitHub 邮件通知。

  ### 如何订阅

  点击右侧的 **Subscribe** 按钮即可。

  ### 如何取消订阅

  再次点击 **Subscribe** 按钮取消订阅。

  ---

  *此 Issue 仅用于发布博客更新通知，请勿在此讨论其他话题。*
  ```

#### 2. 获取 Issue 编号

创建后，记下 Issue 的编号（URL 中的数字，如 `#1`）。

#### 3. 更新配置

在 `config.json` 中添加：

```json
{
  "subscribeIssue": 1,
  "subscribeTitle": "🎉 Moretti's Blog 更新订阅",
  "subscribeDesc": "订阅本 Issue，每当博客有新文章发布时，你将收到 GitHub 邮件通知。"
}
```

将 `subscribeIssue` 的值修改为你创建的 Issue 编号。

#### 4. 触发构建

推送更新后，Gmeek 会自动重新构建博客，页脚会显示订阅链接。

## 工作流程

```
发布新文章 (GitHub Issue)
    ↓
触发 Gmeek 构建
    ↓
触发 notify-subscribe.yml 工作流
    ↓
在订阅 Issue 下发布评论
    ↓
订阅者收到 GitHub 邮件通知
```

## 注意事项

1. **talk 标签的文章不会触发通知**（用于短内容/说说）
2. **已关闭的 Issue 不会触发通知**
3. 确保订阅 Issue 保持 **Open** 状态
4. 订阅 Issue 的编号必须正确配置在 `config.json` 中

## 自定义通知内容

可以修改 `.github/workflows/notify-subscribe.yml` 中的通知模板，自定义评论格式。

## 参考

- 灵感来源：[基于 GitHub Issues 的博客更新订阅方案](https://upxuu.com/posts/blog-subscribe/)
