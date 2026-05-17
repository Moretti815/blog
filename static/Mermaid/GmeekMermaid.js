/**
 * Gmeek Mermaid Plugin
 * 支持 Mermaid 图表渲染，适配明暗模式和多端布局
 * @author Gmeek Plugin
 * @version 1.0.0
 */

(function() {
    'use strict';

    // Mermaid 配置
    const mermaidConfig = {
        startOnLoad: false,
        theme: 'default',
        themeVariables: {
            // 默认亮色主题变量
            primaryColor: '#e1f5fe',
            primaryTextColor: '#01579b',
            primaryBorderColor: '#0288d1',
            lineColor: '#0288d1',
            secondaryColor: '#fff3e0',
            tertiaryColor: '#e8f5e9',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
        },
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
        },
        sequence: {
            useMaxWidth: true,
            diagramMarginX: 50,
            diagramMarginY: 10
        },
        gantt: {
            useMaxWidth: true
        },
        journey: {
            useMaxWidth: true
        },
        timeline: {
            useMaxWidth: true
        }
    };

    // 暗色主题配置
    const darkThemeVariables = {
        primaryColor: '#1f2937',
        primaryTextColor: '#e5e7eb',
        primaryBorderColor: '#4b5563',
        lineColor: '#9ca3af',
        secondaryColor: '#374151',
        tertiaryColor: '#111827',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        // 额外的暗色主题变量
        nodeBorder: '#4b5563',
        clusterBkg: '#1f2937',
        clusterBorder: '#4b5563',
        titleColor: '#e5e7eb',
        edgeLabelBackground: '#1f2937',
        nodeTextColor: '#e5e7eb'
    };

    // 亮色主题变量
    const lightThemeVariables = {
        primaryColor: '#e1f5fe',
        primaryTextColor: '#01579b',
        primaryBorderColor: '#0288d1',
        lineColor: '#0288d1',
        secondaryColor: '#fff3e0',
        tertiaryColor: '#e8f5e9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        nodeBorder: '#0288d1',
        clusterBkg: '#e1f5fe',
        clusterBorder: '#0288d1',
        titleColor: '#01579b',
        edgeLabelBackground: '#ffffff',
        nodeTextColor: '#01579b'
    };

    // 加载 Mermaid.js CDN
    function loadMermaidScript() {
        return new Promise((resolve, reject) => {
            if (window.mermaid) {
                resolve(window.mermaid);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
            script.async = true;
            script.onload = () => resolve(window.mermaid);
            script.onerror = () => reject(new Error('Failed to load Mermaid'));
            document.head.appendChild(script);
        });
    }

    // 获取当前主题模式
    function getCurrentTheme() {
        const colorMode = document.documentElement.getAttribute('data-color-mode');
        if (colorMode === 'dark') return 'dark';
        if (colorMode === 'light') return 'light';
        // 如果是 auto，检测系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // 更新 Mermaid 主题为当前主题
    function updateMermaidTheme() {
        const isDark = getCurrentTheme() === 'dark';
        const themeVars = isDark ? darkThemeVariables : lightThemeVariables;

        if (window.mermaid) {
            window.mermaid.initialize({
                ...mermaidConfig,
                theme: isDark ? 'dark' : 'default',
                themeVariables: themeVars
            });
        }

        // 更新已渲染图表的样式
        updateRenderedCharts(isDark);
    }

    // 更新已渲染的图表样式
    function updateRenderedCharts(isDark) {
        const charts = document.querySelectorAll('.mermaid-chart');
        charts.forEach(chart => {
            const svg = chart.querySelector('svg');
            if (svg) {
                // 设置背景透明，让图表继承页面背景
                svg.style.background = 'transparent';

                // 更新文本颜色
                const textElements = svg.querySelectorAll('text');
                textElements.forEach(text => {
                    text.style.fill = isDark ? '#e5e7eb' : '#24292f';
                });

                // 更新线条颜色
                const pathElements = svg.querySelectorAll('path, line');
                pathElements.forEach(path => {
                    if (!path.getAttribute('stroke') || path.getAttribute('stroke') === '#000' || path.getAttribute('stroke') === '#000000') {
                        path.style.stroke = isDark ? '#9ca3af' : '#24292f';
                    }
                });
            }
        });
    }

    // 渲染 Mermaid 图表
    async function renderMermaidCharts() {
        // 查找所有代码块中包含 mermaid 的 pre 元素
        const codeBlocks = document.querySelectorAll('pre');
        let hasMermaid = false;

        codeBlocks.forEach(pre => {
            const code = pre.querySelector('code');
            if (!code) return;

            // 检查是否是 mermaid 代码块
            const classList = code.classList;
            const isMermaid = classList.contains('language-mermaid') ||
                             classList.contains('mermaid') ||
                             code.textContent.trim().startsWith('graph ') ||
                             code.textContent.trim().startsWith('flowchart ') ||
                             code.textContent.trim().startsWith('sequenceDiagram') ||
                             code.textContent.trim().startsWith('classDiagram') ||
                             code.textContent.trim().startsWith('stateDiagram') ||
                             code.textContent.trim().startsWith('erDiagram') ||
                             code.textContent.trim().startsWith('journey') ||
                             code.textContent.trim().startsWith('gantt') ||
                             code.textContent.trim().startsWith('pie') ||
                             code.textContent.trim().startsWith('timeline') ||
                             code.textContent.trim().startsWith('mindmap') ||
                             code.textContent.trim().startsWith('gitGraph');

            if (isMermaid || classList.contains('language-mermaid')) {
                hasMermaid = true;

                // 创建容器
                const container = document.createElement('div');
                container.className = 'mermaid-chart';
                container.style.cssText = `
                    margin: 16px 0;
                    padding: 16px;
                    border: 1px solid var(--color-border-default, #d0d7de);
                    border-radius: 8px;
                    background: var(--color-canvas-default, #ffffff);
                    overflow-x: auto;
                    text-align: center;
                `;

                // 获取 mermaid 代码
                let mermaidCode = code.textContent;

                // 移除可能的 ```mermaid 标记
                mermaidCode = mermaidCode.replace(/^```mermaid\n?/, '').replace(/```$/, '').trim();

                // 创建 mermaid div
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.textContent = mermaidCode;

                container.appendChild(mermaidDiv);

                // 替换原始代码块
                pre.parentNode.replaceChild(container, pre);
            }
        });

        if (hasMermaid && window.mermaid) {
            try {
                await window.mermaid.run({
                    querySelector: '.mermaid'
                });
                updateRenderedCharts(getCurrentTheme() === 'dark');
            } catch (error) {
                console.error('Mermaid rendering error:', error);
            }
        }
    }

    // 监听主题变化
    function setupThemeListener() {
        // 监听 data-color-mode 属性变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-color-mode') {
                    updateMermaidTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-color-mode']
        });

        // 监听 localStorage 变化（Gmeek 使用 localStorage 存储主题）
        window.addEventListener('storage', (e) => {
            if (e.key === 'meek_theme') {
                setTimeout(updateMermaidTheme, 100);
            }
        });

        // 监听点击主题切换按钮
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[onclick*="modeSwitch"]') ||
                          e.target.closest('#themeSwitch') ||
                          e.target.closest('[title*="切换主题"]') ||
                          e.target.closest('[title*="switchTheme"]');
            if (target) {
                setTimeout(updateMermaidTheme, 100);
            }
        });
    }

    // 添加响应式样式
    function addResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mermaid 图表容器样式 */
            .mermaid-chart {
                margin: 16px 0;
                padding: 16px;
                border: 1px solid var(--color-border-default, #d0d7de);
                border-radius: 8px;
                background: var(--color-canvas-default, #ffffff);
                overflow-x: auto;
                text-align: center;
            }

            /* 暗色模式下的图表容器 */
            [data-color-mode="dark"] .mermaid-chart {
                background: var(--color-canvas-default, #0d1117);
                border-color: var(--color-border-default, #30363d);
            }

            /* Mermaid SVG 样式 */
            .mermaid-chart svg {
                max-width: 100%;
                height: auto;
                display: inline-block;
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .mermaid-chart {
                    padding: 8px;
                    margin: 12px 0;
                }

                .mermaid-chart svg {
                    max-width: 100% !important;
                    min-width: auto !important;
                }
            }

            /* 小屏幕手机适配 */
            @media (max-width: 480px) {
                .mermaid-chart {
                    padding: 4px;
                    border-radius: 4px;
                }

                .mermaid-chart svg {
                    font-size: 12px;
                }
            }

            /* 图表加载时的占位样式 */
            .mermaid-chart .mermaid:not([data-processed="true"]) {
                min-height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-fg-muted, #656d76);
            }

            /* 错误提示样式 */
            .mermaid-chart .mermaid-error {
                color: var(--color-danger-fg, #cf222e);
                padding: 16px;
                background: var(--color-danger-subtle, #ffebe9);
                border-radius: 6px;
                text-align: left;
            }

            [data-color-mode="dark"] .mermaid-chart .mermaid-error {
                color: var(--color-danger-fg, #f85149);
                background: var(--color-danger-subtle, rgba(248, 81, 73, 0.1));
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化函数
    async function init() {
        // 检查页面是否有 mermaid 代码块
        const hasMermaidCode = Array.from(document.querySelectorAll('pre code')).some(code => {
            const text = code.textContent.trim();
            return code.classList.contains('language-mermaid') ||
                   code.classList.contains('mermaid') ||
                   text.startsWith('graph ') ||
                   text.startsWith('flowchart ') ||
                   text.startsWith('sequenceDiagram') ||
                   text.startsWith('classDiagram') ||
                   text.startsWith('stateDiagram') ||
                   text.startsWith('erDiagram') ||
                   text.startsWith('journey') ||
                   text.startsWith('gantt') ||
                   text.startsWith('pie') ||
                   text.startsWith('timeline') ||
                   text.startsWith('mindmap') ||
                   text.startsWith('gitGraph');
        });

        if (!hasMermaidCode) {
            return; // 如果没有 mermaid 代码块，不加载
        }

        // 添加样式
        addResponsiveStyles();

        // 加载 Mermaid
        try {
            const mermaid = await loadMermaidScript();

            // 初始化配置
            const isDark = getCurrentTheme() === 'dark';
            mermaid.initialize({
                ...mermaidConfig,
                theme: isDark ? 'dark' : 'default',
                themeVariables: isDark ? darkThemeVariables : lightThemeVariables
            });

            // 渲染图表
            await renderMermaidCharts();

            // 设置主题监听
            setupThemeListener();

            console.log('\n %c GmeekMermaid Plugin Loaded https://github.com/Meekdai/Gmeek \n', 'padding:5px 0;background:#02d81d;color:#fff');
        } catch (error) {
            console.error('GmeekMermaid Plugin Error:', error);
        }
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
