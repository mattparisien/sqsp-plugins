const selectorMap = new Map<string, string | null>([
  ["html", "html"],
  ["body", "body[id^='collection-']"],
  ["header", ".header-announcement-bar-wrapper"],
  ["menu", ".header-menu"],
  ["footer", "footer"],
  ["button", ".sqs-block-button"],
]);

export default selectorMap;
