import Wowza from "./Wowza";
import "../_lib/styles/reset.css"
import "./assets/styles/main.css";

const init = () => {
  window.addEventListener("load", () => {
    const nodes = Array.from(document.querySelectorAll(".sqs-wowza"));
    nodes.forEach((node) => {
      new Wowza(node);
    });
  });
};

init();