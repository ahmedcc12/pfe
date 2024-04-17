import { Container, Typography } from '@mui/material';
import useLogout from '../hooks/useLogout';
import { Button } from '@mui/material';

export function Home() {
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container>
      <p className="text-center italic">This is the User dashboard page.</p>

      <Typography variant="h3" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="subtitle1"></Typography>
      <Button onClick={handleLogout} variant="contained">
        Logout
      </Button>
    </Container>
  );
}

export default Home;
