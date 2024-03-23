export type Constructor<T = {}> = new (...args: any[]) => T;

export type PluginConfiguration = {
  name: string;
  displayName: string;
  selector: string;
  description?: string;
};
