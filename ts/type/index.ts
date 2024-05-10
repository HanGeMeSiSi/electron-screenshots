export interface WindowItemType {
  index: number;
  name: string;
  x?: number | undefined;
  y?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  id: number;
  processId: number;
  path: string;
  screenIndex?: {
    [id: string]: {
      index: number;
      id: number;
    };
  };
}

export interface ScreensType extends Electron.DesktopCapturerSource {
  display?: Electron.Display;
  png?: string;
}
