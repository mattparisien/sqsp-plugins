import uniqueId from "lodash/uniqueId";
import StringUtils from "./StringUtils";

class Plugin {
  static instances = [];

  constructor(el) {
    this.id = uniqueId("p");
    this.name = StringUtils.pascalToCamel("Plugin" + this.constructor.name);
    this.container = el;
    this.attributes = this.container.dataset;

    this.container.dataset[this.name] = this.id;
    Plugin.instances.push(this);
  }

  static get(name) {
    return Plugin.instances.filter((x) => x.name == name);
  }

  getAttr(key) {
    return this.container.dataset[key];
  }

  setAttr(key, value) {
    this.container.dataset[key] = value;
  }

  destroy() {
    delete this;
  }
}

export default Plugin;
