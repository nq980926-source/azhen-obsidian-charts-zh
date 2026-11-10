# Obsidian Charts 3.9.0 简体中文版

基于官方 `phibr0/obsidian-charts` 3.9.0：

- 官方提交：`663814645bbad2e47df2d151cb982fff24a2a0f7`
- 插件 ID：`obsidian-charts`
- 兼容 Obsidian 1.15.0、Windows 和 Android

## 主要变更

- 汉化插件名称和描述。
- 汉化设置页、颜色设置、图片导出设置。
- 汉化图表创建向导、图表类型、字段提示和最佳拟合线设置。
- 汉化命令、右键菜单、通知和渲染错误。
- 保留原始 YAML 键名、图表类型值、Chart.js 配置和数据协议。
- 保留 `chart` 和 `advanced-chart` Markdown 代码块行为。
- 补充 TypeScript 声明和 UTF-8 构建兼容处理。

## 兼容性

已使用 Obsidian 1.15.0 和 Agentic Chat 0.51.17 的
`FinanceFact → advanced-chart` 测试回归验证：

- 饼图
- 柱状图
- 折线图
- 聊天重新打开后的图表恢复
- 桌面尺寸
- 390×844 移动视口

## BRAT

BRAT 2.2.0 可以识别 `3.9.0-zh.1` 标签和清单版本。由于 SemVer
将带预发布后缀的 `3.9.0-zh.1` 排在正式 `3.9.0` 之前，BRAT 的普通
“检查更新”不会用本版本覆盖已安装的官方 3.9.0。

首次从官方 Charts 3.9.0 切换到本汉化版时，应先把本仓库加入 BRAT，
然后使用 BRAT 现有的“重新安装单个插件”命令强制重新安装。
此后同一仓库通过普通 BRAT 更新即可跟踪高于 `3.9.0-zh.1` 的新版本。

## 许可证

本项目依据 AGPL-3.0-only 发布。原项目作者为 phibr0 及贡献者。
第三方组件许可证见 `THIRD_PARTY_NOTICES.md` 和
`third-party-licenses/`。
