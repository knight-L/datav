import Chart from "@/components/chart";
import useRafInterval from "@/hooks/useRafInterval";
import { BarChart } from "echarts/charts";
import type { EChartsType } from "echarts/core";
import { useRef } from "react";

const data = [2000, 3000, 4000, 5000];
const colors = ["#91AC9A", "#6E918C"];
const xData = ["Q1", "Q2", "Q3", "Q4"];
export default function Chart3() {
  const chartRef = useRef<EChartsType>(null);
  const tipIndex = useRef(0);

  useRafInterval(
    () => {
      if (chartRef.current) {
        chartRef.current?.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: tipIndex.current,
        });
        tipIndex.current = (tipIndex.current + 1) % data.length;
      }
    },
    3_000,
    true
  );

  return (
    <Chart
      ref={chartRef}
      use={[BarChart]}
      option={{
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(110,145,140,0.3)",
          borderColor: colors[1],
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: "#fff",
            fontSize: 13,
            align: "left",
          },
          axisPointer: {
            type: "line",
            lineStyle: {
              width: 1,
              type: "dotted",
              color: "#6E918C",
            },
          },
        },
        grid: {
          top: "20%",
          bottom: "5%",
          left: 10,
          right: 10,
          outerBoundsMode: "same",
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          axisLabel: {
            interval: 0,
            color: "rgba(255, 255, 255, 0.6)",
          },
          axisTick: {
            show: false,
          },
          data: xData,
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "rgba(255, 255, 255, 0.6)",
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            barWidth: 30,
            label: {
              show: true,
              position: "top",
              color: "#fff",
            },
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: colors.map((color, index) => ({
                  offset: index,
                  color: color,
                })),
                global: false,
              },
            },
            data: data,
          },
        ],
      }}
    />
  );
}
