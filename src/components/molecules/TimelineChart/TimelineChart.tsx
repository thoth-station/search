import React from "react";

import { FlexibleWidthXYPlot, MarkSeries, XAxis } from "react-vis";

interface ITimeline {
  source?: [string, string | undefined][];
  selected?: string;
}

const TimelineChart = ({ source, selected }: ITimeline) => {
  const data = React.useMemo(() => {
    if (source) {
      return source.map(([id, timestamp]) => {
        return {
          x: (Date.now() - new Date(timestamp ?? Date.now()).getTime()) / 3.154e10,
          y: 0,
          opacity: 0.5,
          id: id,
        };
      });
    }
  }, [source]);

  return (
    <div>
      <FlexibleWidthXYPlot margin={{ left: 8, right: 8, bottom: 16 }} height={70}>
        <XAxis
          style={{
            ticks: { stroke: "#000000" },
            line: { stroke: "#000000", transform: "translateY(-44px)" },
            text: { stroke: "none", transform: "translateY(-20px)" },
          }}
        />
        <MarkSeries
          colorType="literal"
          data={data}
          getOpacity={point => {
            if (selected === point.id) {
              return 1;
            } else {
              return 0.5;
            }
          }}
          getColor={point => {
            if (selected === point.id) {
              return "#000000";
            }
          }}
        />
      </FlexibleWidthXYPlot>
    </div>
  );
};

export default TimelineChart;
