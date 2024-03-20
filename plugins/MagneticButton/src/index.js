import MagneticButton from "./MagneticButton";
import "../../../common/styles/reset.css";
import "./assets/styles/main.css";

const init = () => {
  console.log('yo!');
  window.addEventListener("load", () => {
    console.log('hi!');
    const nodes = Array.from(document.querySelectorAll(".sqs-block-button"));
    nodes.forEach((node) => {
      console.log('Hello!');
      new MagneticButton(node); 
    });
  });
};

init();
