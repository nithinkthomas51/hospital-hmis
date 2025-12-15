import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../context/AuthContext";

export default function TopBar({ title }) {
  const { username } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title || "HMIS"}
        </Typography>
        <Box sx={{ mr: 2 }}>
          <Typography variant="body1">{username}</Typography>
        </Box>
        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
