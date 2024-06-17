import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data, colors }) => {
  const chartData = data.map((item) => ({
    id: item.subcategory,
    label: item.subcategory,
    value: item.percentage,
    color: colors[item.subcategory],
  }));

  return (
    <div className="chart-container" style={{ height: 400 }}>
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 60, bottom: 20, left: 60 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ datum: "data.color" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: "color" }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        // legends={[
        //   {
        //     anchor: "bottom",
        //     direction: "row",
        //     justify: false,
        //     translateX: 0,
        //     translateY: 56,
        //     itemsSpacing: 0,
        //     itemWidth: 100,
        //     itemHeight: 18,
        //     itemTextColor: "#999",
        //     itemDirection: "left-to-right",
        //     itemOpacity: 1,
        //     symbolSize: 18,
        //     symbolShape: "circle",
        //     effects: [
        //       {
        //         on: "hover",
        //         style: {
        //           itemTextColor: "#000",
        //         },
        //       },
        //     ],
        //   },
        // ]}
      />
    </div>
  );
};

export default PieChart;
