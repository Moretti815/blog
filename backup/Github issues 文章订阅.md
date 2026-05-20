博客写久了，总会想：读者怎么知道我更新了？

RSS 是个老方案，但现在的邮箱服务商越来越严格，RSS 转邮件的通知经常被丢进垃圾箱。自建邮件订阅又麻烦，还要处理 SMTP、退订逻辑，搞不好整域都被标记成垃圾邮件发送者。

最近看到一个思路：用 GitHub Issues 做订阅。

## 原理很简单

GitHub Issues 自带订阅功能。你创建一个专门的通知 Issue，每次博客更新时自动往下面发一条评论，订阅了这个 Issue 的人就会收到 GitHub 的邮件通知。

好处很明显：

- 零成本，用 GitHub 自带功能
- GitHub 的邮件可信度远高于第三方服务，基本不会被拦截
- 读者只需要点一下 Subscribe，有 GitHub 账号就行
- 所有更新历史都在 Issue 评论里，一目了然

## 具体怎么搞

### 第一步：创建订阅 Issue

在你的博客仓库里新建一个 Issue，标题随便写，比如「博客更新订阅」。内容可以写清楚这是干嘛用的：

```
订阅本 Issue，每当博客有新文章发布时，你将收到 GitHub 邮件通知。

点击右侧 Subscribe 按钮即可订阅。
```

创建后记住 Issue 编号，比如 `#2`。

### 第二步：写 GitHub Actions 工作流

在 `.github/workflows/` 下创建一个 `notify-subscribe.yml`：

```yaml
name: Notify Blog Update

on:
  workflow_dispatch:
  issues:
    types: [opened, edited, labeled]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.repository.owner.id == github.event.sender.id || github.event_name == 'workflow_dispatch' }}
    permissions:
      issues: write
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Get Issue Info and Post Notification
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const issue = context.payload.issue;
            const labels = issue.labels.map(l => l.name);
            
            // 跳过已关闭的 issue 和 talk 标签
            if (issue.state === 'closed' || labels.includes('talk')) {
              console.log('Skipping notification.');
              return;
            }
            
            // 生成文章预览
            let preview = '';
            if (issue.body) {
              preview = issue.body
                .replace(/^#+\s+/gm, '')
                .replace(/!\[.*?\]\(.*?\)/g, '[图片]')
                .replace(/\[.*?\]\(.*?\)/g, '$1')
                .replace(/[*_~`#]/g, '')
                .replace(/\n+/g, ' ')
                .trim()
                .substring(0, 150);
              if (issue.body.length > 150) preview += '...';
            }
            
            // 构建通知内容
            const title = issue.title;
            const issueUrl = issue.html_url;
            const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
            
            let body = '## 🎉 博客更新啦！\n\n';
            body += `**${title}**\n\n`;
            if (preview) body += `> ${preview}\n\n`;
            body += `💬 [查看原文](${issueUrl})\n\n`;
            if (labels.length > 0) body += `🏷️ ${labels.join(', ')}\n\n`;
            body += `📅 ${timeStr}\n\n`;
            body += '---\n*自动发布*';
            
            // 这里填你的订阅 Issue 编号
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: 2,
              body: body
            });
```

### 第三步：配置博客显示订阅入口

在博客页脚或者其他显眼位置加个订阅链接，指向你创建的订阅 Issue。

比如在我的 Gmeek 博客里，修改 `config.json`：

```json
{
  "subscribeIssue": 2,
  "subscribeUrl": "https://github.com/moretti815/blog/issues/2"
}
```

然后在模板里读取这个配置生成链接。

## 一些细节

**关于触发时机**

Gmeek 这类基于 GitHub Issues 的博客，文章就是 Issue。所以工作流监听 `issues` 事件，新文章发布时自动触发。

如果你用的是 Hexo、VitePress 这类静态博客，文章是 Markdown 文件，那就改成监听 `push` 事件，检测 `src/content/posts/` 目录的变更。

**关于过滤**

- `talk` 标签的 Issue 通常是短内容/说说，不需要发通知
- 已关闭的 Issue 不发通知
- 可以根据自己的需求加其他过滤条件

**关于邮件内容**

GitHub 的邮件通知会包含评论的完整内容，所以读者在邮件里就能看到文章标题和预览，决定要不要点进去看全文。

## 总结

这个方案最大的优点就是简单。不需要第三方服务，不需要维护邮件列表，不需要处理退订逻辑。GitHub 帮你做了所有脏活累活，你只需要写几行工作流配置。

对于个人博客来说，完全够用了。
