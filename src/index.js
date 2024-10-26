import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from './App';
// import StarRating from "./StarRating.js";
import App2 from "./App2.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <StarRating maxRating={5} />
    <StarRating color="yellow" size={20} /> */}
    <App2 />
  </React.StrictMode>
);
