import { RiceType } from '../../enums';
import { Reply } from '../message';

export interface MealGroup {
  mealNo: number;
  count: number;
  riceType?: RiceType;
  lessRice?: boolean;
  moreRice?: boolean;
  specialRequirement?: boolean;
  replies: Reply[];
}
