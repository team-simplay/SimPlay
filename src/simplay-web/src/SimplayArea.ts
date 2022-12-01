export interface SimplayArea {
  id: string;
  name: string;
  color: number;
  gridDefinition: {
    width: number; // in colums
    height: number; // in rows
    x: number;
    y: number;
  };
}
