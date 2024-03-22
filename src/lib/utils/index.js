export const onLoad = (callback) => {
  window?.addEventListener("load", () => {
    callback?.();
  });
};
