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

// ----------------------------------------------------------------------

export default function AppView() {
  const axiosPrivate = useAxiosPrivate();

  const [graphCount, setGraphCount] = useState({
    users: 0,
    groups: 0,
    bots: 0,
    activeBots: 0,
  });

  const [groups, setGroups] = useState([]);

  const [successRates, setSuccessRates] = useState([]);
  const [userEngagement, setUserEngagement] = useState([]);
  const [groupContributions, setGroupContributions] = useState([]);
  const [usersInEachGroup, setUsersInEachGroup] = useState([]);

  const [mostRunBots, setMostRunBots] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([
    //from 2024 to current year
    ...Array.from(
      { length: new Date().getFullYear() - 2023 },
      (_, i) => 2024 + i,
    ),
  ]);
  const [messages, setMessages] = useState([]);

  const fetchMostRunBots = async (year) => {
    try {
      const response = await axiosPrivate.get(`/stats/mostRunBots/${year}`);
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

  const fetchMessages = async () => {
    try {
      const response = await axiosPrivate.get(
        `/adminmessage?page=${1}&limit=${5}&search=${''}&searchOption=${'all'}&orderBy=${'sentAt'}&order=${'asc'}`,
      );
      console.log(response.data?.messages);
      if (!response.data.messages) setMessages([]);
      else setMessages(response.data.messages);
    } catch (err) {
      console.error(err);
    }
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
      .get('/stats/usersInEachGroup')
      .then((response) => setUsersInEachGroup(response.data.usersInEachGroup))
      .catch((error) => console.error(error));

    axiosPrivate
      .get('/stats/users')
      .then((response) =>
        setGraphCount((prev) => ({ ...prev, users: response.data.users })),
      )
      .catch((error) => console.error(error));

    axiosPrivate
      .get('/stats/groups')
      .then((response) =>
        setGraphCount((prev) => ({ ...prev, groups: response.data.groups })),
      )
      .catch((error) => console.error(error));

    axiosPrivate
      .get('/stats/bots')
      .then((response) =>
        setGraphCount((prev) => ({ ...prev, bots: response.data.bots })),
      )
      .catch((error) => console.error(error));

    axiosPrivate
      .get('/stats/activebots')
      .then((response) =>
        setGraphCount((prev) => ({
          ...prev,
          activeBots: response.data.activeBots,
        })),
      )
      .catch((error) => console.error(error));

    /*     axiosPrivate
      .get('/stats/successrateovertime')
      .then((response) => console.log(response.data.successRates))
      .catch((error) => console.error(error)); */

    axiosPrivate
      .get('/stats/userEngagement')
      .then((response) => setUserEngagement(response.data.userEngagement))
      .catch((error) => console.error(error));

    axiosPrivate
      .get('/stats/groupContributions')
      .then((response) =>
        setGroupContributions(response.data.groupContributions),
      )
      .catch((error) => console.error(error));

    fetchMessages();
  }, [axiosPrivate]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Admin Dashboard 🔑
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Groups"
            total={graphCount.groups}
            color="success"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_group.png" />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Users"
            total={graphCount.users}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
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
            title="Users per group"
            chart={{
              series: [...usersInEachGroup],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Group Contribution"
            chart={{
              series: [...groupContributions],
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
        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="recent messages"
            list={messages.map((message) => ({
              id: message._id,
              title:
                message.sender.firstname +
                ' ' +
                message.sender.lastname +
                ' sent a message',
              subject: message.subject,
              description: message.message,
              image: `/assets/images/covers/messageIcon.jpg`,
              postedAt: message.sentAt,
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
