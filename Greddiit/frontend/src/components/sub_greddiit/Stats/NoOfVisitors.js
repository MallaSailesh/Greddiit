import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";

const NoOfVisitors = (props) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:5000/sub-greddiit/stats/Visitors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: props.Details._id }),
        }
      );

      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      } else {
        setData(json.data);
      }
    };
    fetchData();
  }, []);

  const labels = Object.keys(data);
  const values = Object.values(data);

  const FollowerData = {
    labels: labels,
    datasets: [
      {
        label: "Number of Visitors",
        data: values,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", height: "400px" }}>
      <Line
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Visitors",
              },
            },
            x:{
                title: {
                    display: true,
                    text: "Date",
                },
            }
          },
        }}
        data={FollowerData}
      />
    </div>
  );
};

export default NoOfVisitors;
