import "./styles.css";
import Map from "./components/Map.jsx";
import Navbar from "./components/Navbar.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

export default function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Map />
      </Container>
    </div>
  );
}
