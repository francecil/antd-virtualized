export const util = 'test';
export function defaultFilterFn(this: any, input: string, option: any): boolean {
  if (option.disabled) {
    return false;
  }
  const { optionFilterProp } = this.props;
  const value = option[optionFilterProp];
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}
