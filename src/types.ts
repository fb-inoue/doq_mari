export interface Medic {
  x_1: number;
  y_1: number;
  x_2: number;
  y_2: number;
}

export interface MoveFlags {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface MedicineAndBugType {
  move: boolean;
  color: number;
  pair_x: number | null;
  pair_y: number | null;
}

export type GameField = (MedicineAndBugType | null)[][];