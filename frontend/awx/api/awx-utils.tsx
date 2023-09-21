import { apiTag } from '../../hub/api/utils';

export function awxAPI(strings: TemplateStringsArray, ...values: string[]) {
  const base = process.env.AWX_API_PREFIX;
  return base + apiTag(strings, ...values);
}