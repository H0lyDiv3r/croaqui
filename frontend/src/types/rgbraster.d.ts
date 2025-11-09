declare module "rgbaster" {
  interface ColorResult {
    color: string;
    count: number;
  }

  function analyze(image: string): Promise<ColorResult[]>;

  export default analyze;
}
