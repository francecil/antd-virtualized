export function defaultFilterFn(this: any, input: string, option: any): boolean {
  if (option.disabled) {
    return false;
  }
  const { optionFilterProp } = this.props;
  const value = option[optionFilterProp];
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}

/**
 * 计算节点总个数
 *
 * @export
 * @param {Array<any>} treeData
 * @returns {number}
 */
export function calcNodeTotal(treeData: Array<any>): number {
  let num = 0;
  type C = { children: Array<any> | undefined };
  const calsChildren = ({ children }: C): number => {
    if (!children || children.length === 0) {
      return 1;
    }
    return 2;
  };
  for (let i = 0; i < treeData.length; i++) {
    num += calsChildren(treeData[i]);
  }
  return num;
}

export function convertTreeToList(tree: Array<any>): Array<any> {
  const list: Array<any> = [];
  const dfs = (treeData: any) => {
    list.push({
      ...treeData,
      children: undefined,
    });
    if (treeData.children && treeData.children.length > 0) {
      for (let i = 0; i < treeData.children.length; i++) {
        dfs(treeData.children[i]);
      }
    }
  };
  for (let i = 0; i < tree.length; i++) {
    dfs(tree[i]);
  }
  return list;
}
