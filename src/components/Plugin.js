import uniqueId from "lodash/uniqueId";
import StringUtils from "../lib/utils/StringUtils";

class Plugin {
  static instances = [];

  constructor(el) {
    this.id = uniqueId("c");
    this.name = StringUtils.pascalToCamel(this.constructor.name);
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
