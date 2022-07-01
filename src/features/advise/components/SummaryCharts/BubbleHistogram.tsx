import React, { useMemo, useState } from "react";

import {
    HorizontalRectSeries,
    XAxis,
    FlexibleWidthXYPlot,
    Highlight,
    HighlightArea,
    YAxis,
} from "react-vis";
import Color from "color";

function histogram(data: number[], size: number) {
    let min = Infinity;
    let max = -Infinity;

    for (const item of data) {
        if (item < min) min = item;
        else if (item > max) max = item;
    }

    const bins = Math.ceil((max - min + 1) / size);

    const histogram = new Array(bins).fill(0);

    for (const item of data) {
        histogram[Math.floor((item - min) / size)]++;
    }

    return histogram;
}

interface IBubbleHistogram {
    source?: {
        values: [string, number][];
        top_packages: [string, number][];
    };
    handleClick: (pkgs: [string, number][]) => void;
}

export const BubbleHistogram = ({ source, handleClick }: IBubbleHistogram) => {
    const [selectionStart, setSelectionStart] = useState<number | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

    const updateDragState = (area: HighlightArea | null) => {
        const start = (area && area.left) ?? null;
        const end = (area && area.right) ?? null;

        setSelectionStart(start);
        setSelectionEnd(end);

        if (start && end) {
            const selection: [string, number][] = [];
            data?.forEach(pkg => {
                const inX = pkg.x >= start && pkg.x <= end;
                const inX0 = pkg.x0 >= start && pkg.x0 <= end;
                const inStart = start >= pkg.x0 && start <= pkg.x;
                const inEnd = end >= pkg.x0 && end <= pkg.x;

                if (inStart || inEnd || inX || inX0) {
                    selection.push(...pkg.pkgs);
                }
            });

            handleClick(selection);
        } else {
            handleClick([]);
        }
    };

    const sourceMax = useMemo(() => {
        if (source) {
            return Math.max(...source.values.map(([, val]) => val));
        }
    }, [source]);

    const data = React.useMemo(() => {
        if (source && sourceMax) {
            return histogram(
                source.values.map(([, n]) => n),
                1,
            ).map((b, i) => {
                return {
                    color: Color.rgb(46, 125, 50)
                        .mix(Color.rgb(237, 108, 2), (i + 1) / sourceMax)
                        .lighten(0.25)
                        .hex(),
                    selectedColor: Color.rgb(46, 125, 50)
                        .mix(Color.rgb(237, 108, 2), (i + 1) / sourceMax)
                        .darken(0.25)
                        .hex(),
                    x: i,
                    y: 0,
                    x0: i + 1,
                    y0: b + 1,
                    index: i,
                    pkgs: source.values.filter(([, count]) => count === i + 1),
                };
            });
        }
    }, [source, sourceMax]);

    return (
        <div>
            <FlexibleWidthXYPlot margin={{ left: 8, right: 8 }} height={150} u>
                <XAxis
                    tickFormat={value => value.toString()}
                    tickTotal={(data?.length ?? 0) / 2}
                    style={{
                        ticks: { stroke: "#000000" },
                        text: { stroke: "none" },
                    }}
                />
                <YAxis />
                <HorizontalRectSeries
                    colorType="literal"
                    data={data}
                    getOpacity={d => {
                        if (selectionStart === null || selectionEnd === null) {
                            return 1;
                        }
                        const inX =
                            d.x >= selectionStart && d.x <= selectionEnd;
                        const inX0 =
                            d.x0 >= selectionStart && d.x0 <= selectionEnd;
                        const inStart =
                            selectionStart >= d.x0 && selectionStart <= d.x;
                        const inEnd =
                            selectionEnd >= d.x0 && selectionEnd <= d.x;

                        return inStart || inEnd || inX || inX0 ? 1 : 0.6;
                    }}
                />
                <Highlight
                    color="#829AE3"
                    drag
                    enableY={false}
                    onDrag={updateDragState}
                    onDragEnd={updateDragState}
                />
            </FlexibleWidthXYPlot>
        </div>
    );
};
