import React, { PureComponent, useState } from "react";
import {
  PanelProps,
  ThemeContext,
} from "@grafana/ui";

interface Props extends PanelProps<{}> { }

export class GanttChartPanel extends PureComponent<Props> {

  double(x: number) {
    return x * 2;
  }

  render() {
    const {
      options,
      timeRange,
      width,
      height,
    } = this.props;

    useState(0);

    return (
      <ThemeContext.Consumer>
        {theme => {
          console.log("ToanVQ: ComboPanel -> render -> theme",
            theme,
            options,
            timeRange,
            width,
            height
          );
          return (
            <div>Hello Granfana Panel</div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
