import StringUtils from "./StringUtils";
import uniqueId from "lodash/uniqueId";

class Module {
  static modules = [];
  static list = [];

  constructor(id) {
    this.id = id;
    this.name = this.constructor.name;
    this.container = document.querySelector(
      `[data-module-${StringUtils.pascalToKebab(this.name)}=${this.id}]`
    );

    console.log(
      `[data-module-${StringUtils.pascalToKebab(this.name)}=${this.id}]`
    );
    this.attributes = this.container.dataset;

    // this.setContainerId();
    this.addToModules();
  }

  static get(name) {
    return Module.modules.filter((x) => x.name == name);
  }

  addToModules() {
    Module.modules.push(this);
  }

  static generateID() {
    return uniqueId("m");
  }

  getAttr(key) {
    return this.attributes?.[key];
  }

  setContainerId() {
    // this.container.dataset[StringUtils.pascalToCamel(this.name)] = uniqueId("m");
  }

  destroy() {
    delete this;
  }
}

export default Module;
