import { Button, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import { ROUTES } from "../constants/routes";

export default function ReceptionistDashboard() {
  return (
    <>
      <TopBar title="Doctor Dashboard" />
      <Container sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to={ROUTES.DOCTOR_VISIT_QUEUE}
          >
            Show OPD Visits
          </Button>
        </Box>
      </Container>
    </>
  );
}
