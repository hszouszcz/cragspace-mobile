export type SvgPathConfig = {
  id: string;
  d: string;
  color: string;
};

export type TopoSvgData = {
  paths: SvgPathConfig[];
  viewBox?: string;
};

export type RouteData = {
  strokeWidth: number;
  name: string;
  length: number;
  bolts: number;
  grade: string;
  type: string;
  description: string;
};

export type RouteConfig = SvgPathConfig & RouteData;
