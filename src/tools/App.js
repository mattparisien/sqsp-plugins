import MagneticComponent from "./MagneticComponent";
import Module from "./Module";
import StringUtils from "./StringUtils";

class App {
  static modules = {};
  constructor() {
    this.addAttributes();
    this.init();
  }

  addAttributes() {
    const target = ".sqs-block-button";
    const buttons = Array.from(document.querySelectorAll(target));

    buttons.forEach((button) => {
      button.dataset.moduleMagneticComponent = Module.generateID();
      button.dataset.strength = 100;
    });
  }

  init() {
    //Order of classes in this array matters
    const modules = [MagneticComponent];

    modules.forEach((m) => {
      const name = m.name;
      const attr = `[data-module-${StringUtils.pascalToKebab(name)}]`;

      const els = Array.from(document.querySelectorAll(attr));

      if (els.length) {
        els.forEach((el) => {
          const mod = modules.find((x) => x.name == m.name);

          new mod(el.dataset.moduleMagneticComponent);
        });
      }
    });
  }
}

export default App;
