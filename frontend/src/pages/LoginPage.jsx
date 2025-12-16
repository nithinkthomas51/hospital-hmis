import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginRequest(username, password);
      login(data.token, data.username, data.roles);

      const roles = data.roles || [];
      if (roles.some((r) => r.includes(ROLES.ADMIN))) {
        navigate(ROUTES.ADMIN_HOME);
      } else if (roles.some((r) => r.includes(ROLES.DOCTOR))) {
        navigate(ROUTES.DOCTOR_HOME);
      } else if (roles.some((r) => r.includes(ROLES.RECEPTIONIST))) {
        navigate(ROUTES.RECEPTION_HOME);
      } else if (roles.some((r) => r.includes(ROLES.PHARMACIST))) {
        navigate(ROUTES.PHARMACY_HOME);
      } else if (roles.some((r) => r.includes(ROLES.TECHNICIAN))) {
        navigate(ROUTES.LAB_HOME);
      } else if (roles.some((r) => r.includes(ROLES.PATIENT_HOME))) {
        navigate(ROUTES.PATIENT_HOME);
      } else {
        navigate(ROUTES.LOGIN);
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center">
          HMIS Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
