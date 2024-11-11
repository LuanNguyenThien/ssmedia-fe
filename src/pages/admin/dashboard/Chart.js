import React, { useState } from 'react';
import { Box, Heading, Stat, StatLabel, StatNumber, SimpleGrid } from '@chakra-ui/react';
import { Bar, Line, Doughnut, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  // Dữ liệu biểu đồ mẫu
  const chartDataBar = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Số lượng người dùng mới',
        data: [50, 30, 60, 40, 80, 75],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  const chartDataLine = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu ($)',
        data: [1500, 3000, 2500, 4000, 5000, 4500],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true
      }
    ]
  };

  const chartDataDoughnut = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Tỉ lệ người dùng',
        data: [20, 25, 30, 10, 10, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  };

  const chartDataPie = {
    labels: ['Dịch vụ A', 'Dịch vụ B', 'Dịch vụ C', 'Dịch vụ D'],
    datasets: [
      {
        label: 'Doanh số theo dịch vụ',
        data: [300, 50, 100, 200],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  const chartDataRadar = {
    labels: ['Khách hàng mới', 'Tương tác', 'Bình luận', 'Lượt chia sẻ', 'Lượt xem'],
    datasets: [
      {
        label: 'Tháng 1',
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)'
      },
      {
        label: 'Tháng 2',
        data: [28, 48, 40, 19, 96],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)'
      }
    ]
  };

  return (
    <Box maxHeight="calc(100vh - 110px)" overflowY="auto">
      <Heading size="lg" mb={6}>
        Dashboard Charts
      </Heading>

      {/* Thống kê ngắn */}
      <SimpleGrid columns={[1, 2, 4]} spacing={4} mb={8}>
        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>1,250</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Online Users</StatLabel>
          <StatNumber>350</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>New Users</StatLabel>
          <StatNumber>120</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Sales</StatLabel>
          <StatNumber>$5,600</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Biểu đồ lớn */}
      <SimpleGrid columns={[1, 2]} spacing={6} mb={6}>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading size="md" mb={4}>
            User Growth (Bar)
          </Heading>
          <Bar
            data={chartDataBar}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } }
            }}
            height={400} // Tăng chiều cao của biểu đồ
            width={700} // Tăng chiều rộng của biểu đồ
          />
        </Box>

        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading size="md" mb={4}>
            Revenue Growth (Line)
          </Heading>
          <Line
            data={chartDataLine}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } }
            }}
            height={400} // Tăng chiều cao của biểu đồ
            width={700} // Tăng chiều rộng của biểu đồ
          />
        </Box>
      </SimpleGrid>

      {/* Biểu đồ nhỏ trên 1 hàng, fill đầy với kích thước lớn */}
      <SimpleGrid columns={3} spacing={6}>
        <Box p={4} bg="white" shadow="md" borderRadius="md" height="450px">
          <Heading size="sm" mb={4}>
            User Ratio (Doughnut)
          </Heading>
          <Doughnut
            data={chartDataDoughnut}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } }
            }}
            height={300} // Tăng chiều cao của biểu đồ
            width={500} // Tăng chiều rộng của biểu đồ
          />
        </Box>

        <Box p={4} bg="white" shadow="md" borderRadius="md" height="450px">
          <Heading size="sm" mb={4}>
            Service Sales (Pie)
          </Heading>
          <Pie
            data={chartDataPie}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } }
            }}
            height={300} // Tăng chiều cao của biểu đồ
            width={500} // Tăng chiều rộng của biểu đồ
          />
        </Box>

        <Box p={4} bg="white" shadow="md" borderRadius="md" height="450px">
          <Heading size="sm" mb={4}>
            User Engagement (Radar)
          </Heading>
          <Radar
            data={chartDataRadar}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } }
            }}
            height={300} // Tăng chiều cao của biểu đồ
            width={500} // Tăng chiều rộng của biểu đồ
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Charts;
