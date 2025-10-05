import { useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { Greet } from "../wailsjs/go/main/App";
import { LoadMusic } from "../wailsjs/go/player/Player";
import Player from "./features/Player";
import { Box } from "@chakra-ui/react";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇",
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  return (
    <Box bg={"neutral.dark.900"} id="App">
      <Player />
    </Box>
  );
}

export default App;
