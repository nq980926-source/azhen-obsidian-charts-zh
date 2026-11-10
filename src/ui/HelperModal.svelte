<script lang="ts" defer>
  import { debounce, Editor, parseYaml } from "obsidian";
  import type Renderer from "../chartRenderer";
  import { createEventDispatcher } from "svelte";
  import CollapsibleSection from './CollapsibleSection.svelte'
  import { renderError } from "src/util";
  import type { DataField } from "src/constants/settingsConstants";
import type { Chart } from "chart.js";

  export let editor: Editor;
  export let renderer: Renderer;

  const dispatch = createEventDispatcher();

  let chartType: string = "bar";
  let lastChart: Chart = null;
  let tension: number = 20;
  let width: number = 80;
  let fill: boolean = false;
  let labelColors: boolean = false;
  let startAtZero: boolean = false;
  let bestFit: boolean = false;
  let bestFitTitle: string;
  let bestFitNumber: string = "0";
  let labels: string = "";
  let data: DataField[] = [{ dataTitle: "", data: "" }];
  let chart: string;
  let previewElement: HTMLDivElement = null;
  const debouncedRenderChart = debounce(
    async (yaml: any, el: HTMLElement) => {
      if(lastChart) lastChart.destroy();
      previewElement.lastElementChild?.remove();
      lastChart = renderer.renderRaw(await renderer.datasetPrep(parseYaml(yaml), el), el);
    },
    500,
    true
  );

  $: chart = `type: ${chartType}
labels: [${labels}]
series:
${data
  .map((data) => `  - title: ${data.dataTitle}\n    data: [${data.data}]`)
  .join("\n")}
tension: ${tension / 100}
width: ${width}%
labelColors: ${labelColors}
fill: ${fill}
beginAtZero: ${startAtZero}
bestFit: ${bestFit}
bestFitTitle: ${bestFitTitle}
bestFitNumber: ${bestFitNumber}`;

  $: {
    if (previewElement) {
      try {
        debouncedRenderChart(chart, previewElement);
      } catch (error) {
        renderError(error, previewElement);
      }
    }
  }

  function insertChart() {
    let doc = editor.getDoc();
    let cursor = doc.getCursor();
    lastChart.destroy();

    doc.replaceRange("```chart\n" + chart + "\n```", cursor);
    dispatch("close");
  }
</script>

<div class="chart-modal">
  <h3>创建新图表</h3>
  <div class="modalColumn">
    <div>
      <table style="width:100%">
        <tr>
          <td class="desc"
            ><p class="mainDesc">图表类型</p>
            <p class="subDesc">选择图表类型</p></td
          ><td class="controlElement"
            ><select
              name="图表类型"
              id="chart-types"
              class="dropdown"
              bind:value={chartType}
            >
              <option value="bar">柱状图</option>
              <option value="line">折线图</option>
              <option value="pie">饼图</option>
              <option value="doughnut">环形图</option>
              <option value="radar">雷达图</option>
              <option value="polarArea">极坐标面积图</option>
            </select></td
          >
        </tr>
        <tr>
          <td class="desc"
            ><p class="mainDesc">平滑度</p>
            <p class="subDesc">调整图表曲线的平滑程度</p></td
          ><td class="controlElement"
            ><input
              type="range"
              min="0"
              max="100"
              class="slider"
              bind:value={tension}
            /></td
          >
        </tr>
        <tr>
          <td class="desc"
            ><p class="mainDesc">宽度</p>
            <p class="subDesc">调整图表的横向宽度</p></td
          ><td class="controlElement"
            ><input
              type="range"
              min="20"
              max="100"
              class="slider"
              bind:value={width}
            /></td
          >
        </tr>
        <tr>
          <td class="desc"
            ><p class="mainDesc">填充</p>
            <p class="subDesc">填充图表下方区域</p></td
          ><td class="controlElement"
            ><input
              type="checkbox"
              class="task-list-item-checkbox"
              style="width: 16px; height: 16px"
              bind:checked={fill}
            /></td
          >
        </tr>
        <tr>
          <td class="desc"
            ><p class="mainDesc">独立颜色</p>
            <p class="subDesc">为每个标签使用不同颜色</p></td
          ><td class="controlElement"
            ><input
              type="checkbox"
              class="task-list-item-checkbox"
              style="width: 16px; height: 16px"
              bind:checked={labelColors}
            /></td
          >
        </tr>
        <tr>
          <td class="desc"
            ><p class="mainDesc">从零开始</p>
            <p class="subDesc">不要截断图表底部</p></td
          ><td class="controlElement"
            ><input
              type="checkbox"
              class="task-list-item-checkbox"
              style="width: 16px; height: 16px"
              bind:checked={startAtZero}
            /></td
          >
        </tr>
      </table>
      <hr />
      <table style="width:100%">
        <tr>
          <td class="desc"
            ><p class="mainDesc">X 轴</p>
            <p class="subDesc">设置标签（以逗号分隔）</p></td
          >
          <td class="controlElement">
            <input
              type="text"
              placeholder="周一, 周二, ..."
              bind:value={labels}
            /><br />
          </td>
        </tr>
      </table>
      <hr />
      <table style="width:100%">
        {#each data as d}
          <tr>
            <td class="desc"
              ><p class="mainDesc">Y 轴</p>
              <p class="subDesc">设置数据序列（以逗号分隔）</p></td
            >
            <td class="controlElement">
              <input type="text" placeholder="名称" bind:value={d.dataTitle} />
              <br />
              <input
                type="text"
                placeholder="1, -2, 11, 5"
                style="margin-top: 3px;"
                bind:value={d.data}
              />
            </td>
          </tr>
        {/each}
        <div class="addMoreButtonContainer">
          <button
            on:click={() => (data = [...data, { data: "", dataTitle: "" }])}
            >添加序列</button
          >
        </div>
      </table>
      <hr />
      <CollapsibleSection headerText={'最佳拟合线（仅折线图）'} >
        <hr>
      <table style="width:100%">
        <tr>
          <td class="desc"
          ><p class="mainDesc">最佳拟合线</p>
            <p class="subDesc">创建最佳拟合线</p></td
          ><td class="controlElement"
        ><input
                type="checkbox"
                class="task-list-item-checkbox"
                style="width: 16px; height: 16px"
                bind:checked={bestFit}
        /></td
        >
        </tr>
        <tr>
          <td class="desc"
          ><p class="mainDesc">拟合线序列编号</p>
            <p class="subDesc">用于计算最佳拟合线的数据序列编号</p></td
          ><td class="controlElement"
        ><input
                type="text"
                placeholder="0"
                style="width: 26px; height: 32px"
                bind:value={bestFitNumber}
        /><br />
        </tr>
        <tr>
          <td class="desc"
          ><p class="mainDesc">最佳拟合线标题</p>
            <p class="subDesc">设置最佳拟合线显示的标题</p></td
          ><td class="controlElement">
          <input
                  type="text"
                  placeholder="最佳拟合线"
                  style="width: 96px; height: 32px"
                  bind:value={bestFitTitle}
          /><br />
        </tr>
      </table>
        </CollapsibleSection>
    </div>
    <div class="chartPreview">
      <div id="preview" bind:this={previewElement} />
    </div>
  </div>
  <hr />
</div>
<div style="display: flex; justify-content: center; align-items: center;">
  <button class="mod-cta" on:click={insertChart}>插入图表</button>
</div>

<style>
  .addMoreButtonContainer {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.4rem;
  }

  .subDesc {
    font-size: smaller;
    opacity: 0.5;
    margin: 0;
  }
  .desc {
    padding-right: 1em;
  }
  .mainDesc {
    margin: 0;
  }
  table {
    margin: auto;
  }
  .controlElement {
    text-align: center;
  }
  .chart-modal {
    overflow-y: auto;
  }
  .modalColumn {
    display: flex;
    gap: 2em;
  }
  .chartPreview {
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
