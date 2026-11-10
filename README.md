# Obsidian Charts 简体中文

这是 [phibr0/obsidian-charts](https://github.com/phibr0/obsidian-charts)
官方 **3.9.0** 的简体中文版本。

- 官方基线标签：`3.9.0`
- 官方基线提交：`663814645bbad2e47df2d151cb982fff24a2a0f7`
- 插件 ID：`obsidian-charts`
- 插件版本：`3.9.0`
- 许可证：AGPL-3.0-only

本版本只汉化用户可见界面文字，并补充必要的 TypeScript 和构建兼容处理。
图表计算、Chart.js 配置、数据解析、渲染方式、交互和样式逻辑保持与
官方 3.9.0 一致。

## 汉化范围

- 插件名称和描述
- 设置页标题、分组、选项、按钮和提示
- 图表创建向导
- 图表类型、字段标签和占位文字
- 最佳拟合线相关界面
- 编辑器右键菜单和命令名称
- 表格导入、图片导出和渲染错误提示

YAML 键名、图表类型值、代码块语言和 API 标识没有汉化，以免破坏现有
笔记和自动化流程。

## 阿斟 Agentic Chat 兼容性

插件保留：

- 插件 ID `obsidian-charts`
- `advanced-chart` Markdown 代码块注册
- Chart.js JSON 输入格式
- `chart` YAML 代码块格式
- 饼图、柱状图、折线图、环形图、雷达图、极坐标面积图和桑基图能力

因此 Agentic Chat 0.51.17 的 `FinanceFact → advanced-chart` 渲染链无需
修改。已有 `advanced-chart` 数据可以直接使用。

示例结构保持不变：

````markdown
```advanced-chart
{
  "type": "doughnut",
  "data": {
    "labels": ["餐饮", "交通"],
    "datasets": [{ "label": "支出", "data": [12.5, 8] }]
  },
  "options": {
    "responsive": true,
    "maintainAspectRatio": false
  }
}
```
````

## 兼容平台

- Obsidian 1.15.0
- Windows 桌面版
- Android 移动版
- Obsidian Charts 3.9.0 的原有支持范围

## 安装

手动安装时，将以下文件放入 Vault 的
`.obsidian/plugins/obsidian-charts/`：

- `main.js`
- `manifest.json`
- `styles.css`

然后在 Obsidian 社区插件列表中启用 **Charts 简体中文**。

本版本使用与官方相同的插件 ID 和版本号。替换前应备份原
`.obsidian/plugins/obsidian-charts/`，尤其是其中的 `data.json`。

## 构建

```bash
yarn install --frozen-lockfile
yarn typecheck
yarn build
```

构建产物为仓库根目录的 `main.js`。旧版 `esbuild-svelte` 在较新的 Node.js
环境中无法解析 Svelte 模块，因此构建脚本直接使用仓库锁定的 Svelte 3.49
编译器进行预处理，再交给 esbuild 打包。依赖版本没有升级。

## 许可证与来源

本项目依据 **GNU Affero General Public License v3.0** 发布，详见
[LICENSE](./LICENSE) 和 [NOTICE](./NOTICE)。

第三方组件和许可证见
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

官方英文 README 保存在 [UPSTREAM-README.md](./UPSTREAM-README.md)。
