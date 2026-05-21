# 给 Gmeek 博客添加 AI 文章总结

前段时间折腾博客的时候，发现有些文章比较长，想给每篇文章加个自动生成的摘要。研究了一下文章，最后给 Gmeek 博客加上了 AI 总结功能。记录一下实现过程，方便以后回顾。

## 整体思路

AI 总结功能的流程其实很简单：

1. 文章发布/更新时，把文章内容发给 AI API
2. AI 返回一段摘要
3. 把摘要显示在文章页面顶部

## 具体实现

### 1. 准备 AI 接口模块

先写了个 `Summary.py`，用来调用 AI API：

```python
import os
import requests
import json
import random

def generate_summary(text):
    api_url = os.environ.get("API_URL")
    api_key = os.environ.get("API_KEY")
    api_model = os.environ.get("API_MODEL")

    if not api_url or not api_model:
        return ""

    # 支持配置多个 key 和 model，随机选一个
    if api_key and ',' in api_key:
        api_key = random.choice(api_key.split(','))
    if api_model and ',' in api_model:
        api_model = random.choice(api_model.split(','))

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    prompt = "你是总结生成器。你的任务是以简洁、完整的语句总结用户提供的文本..."

    payload = {
        "model": api_model,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": text}
        ],
        "temperature": 0.5,
        "max_tokens": 1500
    }

    try:
        response = requests.post(url=api_url, headers=headers, 
                                data=json.dumps(payload), timeout=10)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"生成摘要失败: {e}")
    
    return ""
```

这个模块从环境变量读取配置，支持多个 API key 和 model（用逗号分隔），失败时返回空字符串。

### 2. 集成到 Gmeek.py

在 `Gmeek.py` 里导入这个模块：

```python
from Summary import generate_summary
```

然后在处理每篇文章的地方，调用生成摘要：

```python
# 原来的代码是用文章第一句作为摘要
# self.blogBase[listJsonName][postNum]["description"] = issue.body.split(period)[0]

# 改成调用 AI 生成
ai_summary = generate_summary(issue.body)
if ai_summary:
    self.blogBase[listJsonName][postNum]["description"] = ai_summary
else:
    # AI 失败时回退到原来的方式
    self.blogBase[listJsonName][postNum]["description"] = issue.body.split(period)[0] + period
```

### 3. 前端显示

在 `post.html` 模板里，加上摘要的显示区域：

```html
{%- if blogBase['description'] and blogBase['description'] != '' -%}
<div style="border: 1px dashed #ccc; padding: 10px; margin-bottom: 20px;">
    <strong>AI总结:</strong> {{ blogBase['description'] }}
</div>
{%- endif %}
```

放在文章标题下面、正文上面，读者一眼就能看到。

### 4. GitHub Actions 配置

因为博客是用 GitHub Actions 自动构建的，需要在 workflow 文件里把 API 配置传给环境变量：

```yaml
- name: Generate new html
  env:
    API_URL: ${{ secrets.API_URL }}
    API_KEY: ${{ secrets.API_KEY }}
    API_MODEL: ${{ secrets.API_MODEL }}
  run: |
    python Gmeek.py ...
```

然后在仓库的 Settings > Secrets 里添加这三个变量：
- `API_URL`: AI 接口地址，比如 `https://models.inference.ai.azure.com/chat/completions`
- `API_KEY`: 你的 API 密钥
- `API_MODEL`: 模型名称，比如 `gpt-4o`

## 踩过的坑

**环境变量没传过去**

最开始在 Secrets 里配置了变量，但构建日志显示 "未配置"。排查半天发现是 workflow 文件里没写 `env` 部分，Secrets 不会自动变成环境变量，必须显式传递。

**API 调用超时**

有些文章很长，AI 处理比较慢。加了 10 秒超时，超时就回退到原来的摘要方式，避免构建卡住。

**摘要太长**

一开始没限制 token 数，返回的摘要有时候比文章还长。加了 `max_tokens: 1500` 限制，同时 prompt 里要求简洁。

## 效果

现在每篇新文章发布时，会自动生成一段 AI 摘要，显示在文章顶部。如果 AI 服务不可用，会自动回退到原来的方式（取第一句），不影响正常发布。

摘要质量取决于用的 AI 模型，我试了几个免费的 API，效果都还可以。读者反馈说摘要帮他们快速判断这篇文章值不值得细读。

## 后续优化方向

- 支持自定义每篇文章是否生成 AI 摘要（通过 issue 标签控制）
- 缓存摘要结果，避免每次构建都重新生成
- 支持手动编辑 AI 生成的摘要

---

实现过程中参考了 [anaer/blog](https://github.com/anaer/blog) 的做法，感谢前辈踩坑。
