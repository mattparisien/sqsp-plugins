import { MagneticButton } from "../components";

const init = () => {
  window.addEventListener("load", () => {
    const nodes = Array.from(document.querySelectorAll(".sqs-block-button"));
    nodes.forEach((node) => {
      new MagneticButton(node);
    });
  });
};

init();
