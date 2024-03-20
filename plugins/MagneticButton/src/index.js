import MagneticButton from "./MagneticButton";
import "../../../common/styles/reset.css";
import "./assets/styles/main.css";

const init = () => {
  window.addEventListener("load", () => {
    const nodes = Array.from(document.querySelectorAll(".sqs-block-button"));
    nodes.forEach((node) => {
      new MagneticButton(node); 
    });
  });
};

init();
