import { Button, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import { ROUTES } from "../constants/routes";

export default function AdminDashboard() {
  return (
    <>
      <TopBar title="Admin Dashboard" />
      <Container sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to={ROUTES.ADMIN_DEPARTMENTS}
          >
            Manage Departments
          </Button>
          <Button variant="contained" component={Link} to={ROUTES.ADMIN_STAFF}>
            Manage Staff
          </Button>
          <Button
            variant="contained"
            component={Link}
            to={ROUTES.ADMIN_SCHEDULES}
          >
            Manage Schedules
          </Button>
        </Box>
      </Container>
      <div style={{ padding: 16 }}>
        <h2>Welcome, Admin</h2>
      </div>
    </>
  );
}
