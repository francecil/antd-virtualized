export default function getPrefixCls(
  this: any,
  suffixCls: string,
  customizePrefixCls?: string,
): string {
  const { prefixCls = 'ant-virtualized' } = this.props;

  if (customizePrefixCls) return customizePrefixCls;

  return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
}
