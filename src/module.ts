import { PanelPlugin } from "@grafana/ui";
import { GanttChartPanel } from "./GanttChartPanel";
import { GanttChartPanelEditor } from "./GanttChartPanelEditor";

export const plugin = new PanelPlugin(GanttChartPanel);

plugin.setEditor(GanttChartPanelEditor);
plugin.setDefaults({
  test: 1,
});
