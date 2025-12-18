import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export function AdminHomeButton() {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="contained"
        component={Link}
        to={ROUTES.ADMIN_HOME}
        sx={{ marginLeft: "auto" }}
      >
        Admin Home
      </Button>
    </Box>
  );
}
