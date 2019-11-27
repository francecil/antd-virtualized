export const util = 'test';
export function defaultFilterFn(this: any, input: string, option: any): boolean {
  if (option.disabled) {
    return false;
  }
  const { optionFilterProp } = this.props;
  const value = option[optionFilterProp];
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}

export function toArray<T>(value: T | T[] | undefined): T[] {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value as T];
  }
  return ret as T[];
}
