import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';

import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function AppView() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [graphCount, setGraphCount] = useState({
    users: 0,
    groups: 0,
    bots: 0,
    activeBots: 0,
  });

  const [userEngagement, setUserEngagement] = useState([]);
  const [usersInEachGroup, setUsersInEachGroup] = useState([]);
  const [botsRanByUser, setBotsRanByUser] = useState([]);
  const [averageExecutionTime, setAverageExecutionTime] = useState([]);

  const [botSuccessRate, setBotSuccessRate] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([
    ...Array.from(
      { length: new Date().getFullYear() - 2023 },
      (_, i) => 2024 + i,
    ),
  ]);

  const fetchMostRunBots = async (year) => {
    try {
      const response = await axiosPrivate.get(
        `/userStats/mostRunBots/${year}/${auth.user.userId}`,
      );
      const data = response.data.botRuns.map((bot) => {
        const monthlyData = new Array(12).fill(0);
        bot.monthlyCounts.forEach(({ month, count }) => {
          monthlyData[month - 1] = count;
        });
        return {
          name: bot.botName,
          type: 'column', // or 'line', 'area', etc.
          fill: 'solid',
          data: monthlyData,
        };
      });
      setChartData(data);
    } catch (error) {
      console.error('Error fetching most run bots:', error);
    }
  };
  useEffect(() => {
    fetchMostRunBots(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {
    axiosPrivate
      .get(`/userStats/getUsersInGroup/${auth.user.groupId}`)
      .then((response) =>
        setGraphCount((prev) => ({ ...prev, users: response.data.users })),
      )
      .catch((error) => console.error(error));

    axiosPrivate
      .get(`/userStats/botsByUser/${auth.user.groupname}`)
      .then((response) =>
        setGraphCount((prev) => ({ ...prev, bots: response.data.bots })),
      )
      .catch((error) => console.error(error));

    axiosPrivate
      .get(`/userStats/activeBots/${auth.user.userId}`)
      .then((response) =>
        setGraphCount((prev) => ({
          ...prev,
          activeBots: response.data.activeBots,
        })),
      )
      .catch((error) => console.error(error));

    axiosPrivate
      .get(`/userStats/getEveryBotRanByUser/${auth.user.userId}`)
      .then((response) => setBotsRanByUser(response.data));

    axiosPrivate
      .get(`/userStats/averageExecutionTime/${auth.user.userId}`)
      .then((response) => setAverageExecutionTime(response.data))
      .catch((error) => console.error(error));
  }, [axiosPrivate]);

  const [selectedBot, setSelectedBot] = useState({
    botId: '',
    botName: '',
  });

  useEffect(() => {
    if (botsRanByUser.length > 0) setSelectedBot(botsRanByUser[0]);
  }, [botsRanByUser]);

  const fetchBotSuccessRate = async (bot) => {
    try {
      const response = await axiosPrivate.get(
        `/userStats/botSuccessRate/${auth.user.userId}/${bot.botId}`,
      );
      setBotSuccessRate(response.data);
    } catch (error) {
      console.error('Error fetching bot success rate:', error);
    }
  };

  const handleChangeBot = (bot) => {
    setSelectedBot(bot);
  };

  useEffect(() => {
    if (selectedBot) fetchBotSuccessRate(selectedBot);
  }, [selectedBot]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back {auth.user.firstname}
      </Typography>

      <Grid container spacing={3}>
        <Grid>
          <AppWidgetSummary
            title="Users in Group"
            total={graphCount.users}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_group.png" />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bots"
            total={graphCount.bots}
            color="warning"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_robot.png" />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active"
            total={graphCount.activeBots}
            color="warning"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_robot.png" />
            }
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Bot Usage Statistics"
            years={years}
            onYearChange={handleYearChange}
            subheader={`Year: ${selectedYear}`}
            chart={{
              labels: months,
              series: chartData,
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Success rate for each bot"
            onBotChange={handleChangeBot}
            bots={botsRanByUser}
            selectedBot={selectedBot}
            chart={{
              series: [...botSuccessRate],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Average execution time for each bot in Milliseconds"
            chart={{
              series: [...averageExecutionTime],
            }}
          />
        </Grid>
        {/* <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}
