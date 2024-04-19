import { type Coord, type Polygon, booleanPointInPolygon } from "@turf/turf";

export const pointInsidePolygon = (point: Coord, polygon: Polygon) =>
  booleanPointInPolygon(point, polygon);
