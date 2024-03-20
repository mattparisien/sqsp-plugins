class StringUtils {
  static pascalToKebab(inputString) {
    return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  static pascalToCamel(str) {
    if (!str) return "";

    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}

export default StringUtils;
