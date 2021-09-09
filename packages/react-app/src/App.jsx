import React from "react";
import { useDispatch } from "react-redux";

import Web3Wrapper from "./Web3Wrapper";
import { setDebugMode } from "./actions";
import { Layout } from "antd";

import "antd/dist/antd.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  dispatch(setDebugMode(true));
  return (
    <div className="App text-center">
      <Layout style={{ minHeight: "100vh" }}>
        <Web3Wrapper />
      </Layout>
    </div>
  );
}

export default App;
