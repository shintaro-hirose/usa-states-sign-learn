import "./styles.css";
import Map from "./components/Map.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Switch, Route } from "react-router-dom";
import Updates from "./components/Updates.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Switch>
          <Route path="/updates">
            <Updates />
          </Route>
          <Route path="/">
            <Map />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}
