import { RiceType } from '../enums';
import { MealGroup } from '../models';
import { Reply } from '../models/message';

export function analyzeReplies(replies: Reply[]): MealGroup[] {
  const mealGroups: MealGroup[] = [];

  replies.forEach((reply) => {
    const message =
      reply.message
        .split('\n')?.[0]
        // filter out the user ID
        .replace(/(<@U[A-Z0-9]+>)+/g, '')
        // filter out the emoji
        .replace(/(:[a-zA-Z0-9\-_+]+:)+/g, '') || '';
    const mealNo = analyzeMealNo(message);
    const appetite = analyzeAppetite(message);
    const specialRequirement = analyzeSpecialRequirement(message);
    let riceType = analyzeRiceType(message);

    if (riceType === undefined && [1, 2].includes(mealNo)) {
      riceType = RiceType.PurpleRice;
    }

    const mealGroup = mealGroups.find(
      (g) =>
        g.mealNo === mealNo &&
        g.riceType === riceType &&
        g.lessRice === appetite &&
        g.specialRequirement === specialRequirement,
    );

    if (!mealGroup) {
      mealGroups.push({
        mealNo,
        count: 1,
        riceType,
        lessRice: appetite,
        specialRequirement,
        replies: [{ ...reply }],
      });
      return;
    }

    mealGroup.count += 1;
    mealGroup.replies.push({ ...reply });
  });

  return mealGroups;
}

function analyzeAppetite(message: string): boolean | undefined {
  const patterns = ['飯少', '少飯', '飯一半', '半飯'];

  if (patterns.some((p) => message.includes(p))) {
    return true;
  }

  return undefined;
}

function analyzeMealNo(message: string): number {
  const matches = message.match(/[1-5]/g);

  if (matches && matches.length === 1) {
    return Number.parseInt(matches[0], 10);
  }

  if (message.includes('1）')) {
    return 1;
  }

  if (message.includes('2）')) {
    return 2;
  }

  if (message.includes('3）')) {
    return 3;
  }

  if (message.includes('4）')) {
    return 4;
  }

  if (message.includes('5）')) {
    return 5;
  }

  return -1;
}

function analyzeRiceType(message: string): RiceType | undefined {
  if (message.includes('白飯')) {
    return RiceType.WhiteRice;
  }

  if (message.includes('紫米')) {
    return RiceType.PurpleRice;
  }

  return undefined;
}

function analyzeSpecialRequirement(message: string): boolean | undefined {
  const patterns = ['不吃', '不要', '勿'];
  const hasSpecialRequirement = patterns.some((pattern) =>
    message.includes(pattern),
  );

  if (hasSpecialRequirement) {
    return true;
  }

  return undefined;
}
