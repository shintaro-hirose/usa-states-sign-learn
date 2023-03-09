import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Navbar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          USA Plate Quiz
        </Typography>
        <Button color="inherit">説明</Button>
        <Button color="inherit">変更履歴</Button>
        <Button color="inherit">ナンプレ一覧</Button>
      </Toolbar>
    </AppBar>
  );
}
