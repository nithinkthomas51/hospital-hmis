import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export function HomeButton({ route }) {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="contained"
        component={Link}
        to={route}
        sx={{ marginLeft: "auto" }}
      >
        Home
      </Button>
    </Box>
  );
}
