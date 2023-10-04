import React from "react";
import ReactDOM from "react-dom";
import './i18n';
import { createRoot } from 'react-dom/client';
//import { Dapp } from "./components/Dapp";
import Dapp from './components/Dapp';

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import './i18n';
// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

/*
ReactDOM.render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>,
  document.getElementById("root")
);
*/

const root = createRoot(document.getElementById('root'));
root.render(
  <Dapp />
);