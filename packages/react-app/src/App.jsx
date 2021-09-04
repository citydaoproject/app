import React from "react";
import { useDispatch } from "react-redux";

import Web3Wrapper from "./Web3Wrapper";
import { setDebugMode } from "./actions";

import "antd/dist/antd.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  dispatch(setDebugMode(true));
  return (
    <div className="App">
      <Web3Wrapper />
    </div>
  );
}

export default App;
