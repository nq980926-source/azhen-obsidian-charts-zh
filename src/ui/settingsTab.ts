import {
  DEFAULT_SETTINGS,
} from './../constants/settingsConstants';
import {
  App,
  PluginSettingTab,
  Setting,
} from 'obsidian';
import type ChartPlugin from '../main';
import Picker from 'vanilla-picker';

export class ChartSettingTab extends PluginSettingTab {
  plugin: ChartPlugin;

  constructor(app: App, plugin: ChartPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  isColor(strColor: string) {
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
  }

  display(): void {
    let { containerEl, plugin } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: '图表设置' });

    containerEl.createEl('h3', { text: '常规' });

    new Setting(containerEl)
      .setName('在右键菜单中显示按钮')
      .setDesc(
        '启用后，编辑器右键菜单中会显示打开图表创建器的按钮。'
      )
      .addToggle((cb) => {
        cb.setValue(this.plugin.settings.contextMenu).onChange(
          async (value) => {
            plugin.settings.contextMenu = value;
            await plugin.saveSettings();
          }
        );
      });
    new Setting(containerEl)
      .setName('支持作者')
      .setDesc('如果这个插件对你有帮助，可以考虑支持后续开发：')
      .addButton((bt) => {
        bt
          .setButtonText('支持作者')
          .onClick(() => window.open('https://ko-fi.com/phibr0', '_blank'));
      });

    containerEl.createEl('h3', {
      text: '颜色',
      attr: {
        style: 'margin-bottom: 0',
      },
    });
    const desc = containerEl.createEl('p', { cls: 'setting-item-description' });
    desc.append(
      '设置图表使用的颜色。边框使用所选颜色，填充色使用相同颜色但降低不透明度，以更好地兼容深色和浅色主题。',
      '你可以使用任何',
      desc.createEl('a', {
        href: 'https://www.w3schools.com/cssref/css_colors.asp',
        text: '有效的 CSS 颜色。',
      })
    );

    new Setting(containerEl)
      .setName('启用主题颜色')
      .setDesc(
        '如果 Obsidian 主题或 CSS 片段提供图表颜色，可以改用这些颜色。'
      )
      .addToggle((cb) => {
        cb.setValue(plugin.settings.themeable).onChange(async (value) => {
          plugin.settings.themeable = value;
          await plugin.saveSettings();
          this.display();
        });
      });

    if (!plugin.settings.themeable) {
      plugin.settings.colors.forEach((color, idx) => {
        const nameEl = document.createDocumentFragment();
        nameEl.createSpan({ text: '●', attr: { style: `color: ${color}` } });
        nameEl.appendText(` 颜色 #${idx + 1}`);
        new Setting(containerEl)
          .setName(nameEl)
          .setDesc('创建图表时使用此颜色作为边框颜色。')
          .addButton((btn) => {
            btn.setButtonText('更改颜色');
            new Picker({
              parent: btn.buttonEl,
              onDone: async (color) => {
                this.plugin.settings.colors[idx] = color.hex;
                await this.plugin.saveSettings();
                this.display();
              },
              popup: 'left',
              color: color,
              alpha: false,
            });
          })
          .addExtraButton((btn) => {
            btn
              .setIcon('trash')
              .setTooltip('删除')
              .onClick(async () => {
                this.plugin.settings.colors.remove(color);
                await this.plugin.saveSettings();
                this.display();
              });
            if (this.plugin.settings.colors.length === 1) {
              btn.setDisabled(true);
            }
          })
          .addExtraButton((btn) => {
            btn
              .setIcon('reset')
              .setTooltip('恢复默认')
              .onClick(async () => {
                this.plugin.settings.colors[idx] =
                  DEFAULT_SETTINGS.colors[idx] ?? '#ffffff';
                await this.plugin.saveSettings();
                this.display();
              });
          });
      });

      new Setting(containerEl).addButton((btn) => {
        btn.setButtonText('添加颜色').onClick(async () => {
          this.plugin.settings.colors.push('#ffffff');
          await this.plugin.saveSettings();
          this.display();
        });
      });
    }

    containerEl.createEl('h3', { text: '图表转图片' });

    const detailEl = containerEl.createEl('details');
    detailEl.createEl('summary', { text: '使用方法' });
    detailEl.createEl('p', {
      text: '在 Markdown 中选择完整的 chart 代码块，然后运行“从图表创建图片”命令。',
    });

    new Setting(containerEl)
      .setName('图片格式')
      .setDesc('从图表生成图片时使用的文件格式。')
      .addDropdown((cb) => {
        cb.addOptions({
          'image/jpeg': 'jpeg',
          'image/png': 'png',
          'image/webp': 'webp',
        });
        cb.setValue(plugin.settings.imageSettings.format);
        cb.onChange(async (value) => {
          (plugin.settings.imageSettings.format as any) = value;
          await plugin.saveSettings();
        });
      });
    new Setting(containerEl)
      .setName('图片质量')
      .setDesc('使用有损格式时，设置生成图片的质量。')
      .addSlider((cb) => {
        cb.setDynamicTooltip()
          .setLimits(0.01, 1, 0.01)
          .setValue(plugin.settings.imageSettings.quality)
          .onChange(async (value) => {
            plugin.settings.imageSettings.quality = value;
            await plugin.saveSettings();
          });
      });
  }
}
