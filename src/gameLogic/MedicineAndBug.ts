import { MedicineAndBugType } from '../types';

export class MedicineAndBug implements MedicineAndBugType {
  move = false;
  color = 0;
  pair_x: number | null = null;
  pair_y: number | null = null;

  constructor(i?: number) {
    this.color = i === undefined ? Math.floor(Math.random() * 3 + 1) : i;
  }
}