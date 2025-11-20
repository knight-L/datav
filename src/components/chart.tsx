import React, { type Ref, useEffect, useImperativeHandle, useRef } from "react";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import styled from "styled-components";
import useSize from "@/hooks/useSize";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";

echarts.use(CanvasRenderer);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export interface ChartProps {
  ref?: Ref<echarts.EChartsType>;
  option: echarts.EChartsCoreOption;
  use: Parameters<typeof echarts.use>[0];
  notMerge?: boolean;
  lazyUpdate?: boolean;
  style?: React.CSSProperties;
  theme?: string | object | undefined;
}

function Chart(props: ChartProps) {
  const chartBox = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.EChartsType | null>(null);
  const size = useSize(chartBox);

  echarts.use(props.use);

  useImperativeHandle(props.ref, () => chart.current!);

  useEffect(() => {
    chart.current = echarts.init(chartBox.current as HTMLElement);

    return () => {
      chart.current?.dispose();
      chart.current = null;
      chartBox.current = null;
    };
  }, []);

  useDebounceEffect(
    () => {
      if (size?.width !== 0 && size?.height !== 0) chart.current?.resize();
    },
    [size],
    300
  );

  useEffect(() => {
    chart.current?.setOption(props.option, props.notMerge, props.lazyUpdate);
  }, [props.option, props.notMerge, props.lazyUpdate]);

  return <Wrapper ref={chartBox} style={props.style} />;
}

export default Chart;
