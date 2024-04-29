import { ResponsivePie } from "@nivo/pie";

interface IconProps {
  className?: string;
}

export default function PieChart(props: IconProps) {
  return (
    <div {...props}>
      <ResponsivePie
        data={[
          { id: "1", value: 111 },
          { id: "2", value: 157 },
          { id: "3", value: 129 },
          { id: "4", value: 150 },
          { id: "5", value: 119 },
        ]}
        sortByValue
        margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={2}
        borderWidth={1}
        arcLinkLabelsThickness={1}
        enableArcLabels={false}
        colors={["#2563eb"]}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}