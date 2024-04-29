import { ResponsiveLine } from "@nivo/line"

interface IconProps {
  className?: string;
}

export default function LineChart(props: IconProps) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 98 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 70 },
              { x: "May", y: 26 },
              { x: "Jun", y: 96 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 82 },
              { x: "Feb", y: 45 },
              { x: "Mar", y: 58 },
              { x: "Apr", y: 80 },
              { x: "May", y: 99 },
              { x: "Jun", y: 96 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
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
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}
