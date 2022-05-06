import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Layout } from "antd";
import Web3Wrapper from "./Web3Wrapper";
import { useAppDispatch } from "./hooks";
import { setDebugMode } from "./actions";

import "./App.less";

function App() {
  const dispatch = useAppDispatch();
  dispatch(setDebugMode(process.env.REACT_APP_DEBUG));
  return (
    <div className="App text-center">
      <Layout className="app-layout">
        <Web3Wrapper />
      </Layout>
      <ToastContainer />
    </div>
  );
}

export default App;
