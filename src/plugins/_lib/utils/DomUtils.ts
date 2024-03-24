class DomUtils {
  /**
   * Gets an element by its ID.
   * @param id The ID of the element to find.
   * @returns The HTMLElement found, or null if none exists with the given ID.
   */
  static getElementById(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  /**
   * Creates a new element with the specified tag.
   * @param tagName The tag name of the element to create.
   * @returns The new HTMLElement.
   */
  static createElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  /**
   * Adds a class to an element.
   * @param element The element to add the class to.
   * @param className The class name to add.
   */
  static addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  /**
   * Removes a class from an element.
   * @param element The element to remove the class from.
   * @param className The class name to remove.
   */
  static removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  /**
   * Toggles a class on an element.
   * @param element The element to toggle the class on.
   * @param className The class name to toggle.
   */
  static toggleClass(element: HTMLElement, className: string): void {
    element.classList.toggle(className);
  }

  /**
   * Sets an attribute on an element.
   * @param element The element to set the attribute on.
   * @param name The name of the attribute to set.
   * @param value The value of the attribute.
   */
  static setAttribute(element: HTMLElement, name: string, value: string): void {
    element.setAttribute(name, value);
  }

  /**
   * Removes an attribute from an element.
   * @param element The element to remove the attribute from.
   * @param name The name of the attribute to remove.
   */
  static removeAttribute(element: HTMLElement, name: string): void {
    element.removeAttribute(name);
  }

  /**
   * Gets all elements within the document that match the specified selector.
   * @param selector The CSS selector to query for.
   * @returns A NodeList of all elements matching the selector.
   */
  static querySelectorAll(selector: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(selector));
  }
}

export default DomUtils;
