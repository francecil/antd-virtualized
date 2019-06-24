// eslint-disable-next-line
// import { NodeData } from './TreeNode';
export interface NodeData {
  _level: number;
  _id: string;
  _pid: string;
  isLeaf?: boolean;
  visible?: boolean;
  /** 父节点有效，节点展开状态 */
  expanded?: boolean;
}
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
  const list: Array<NodeData> = [];
  const dfs = (treeData: any, _level: number, _pid: string, _id: string) => {
    const isLeaf = !(treeData.children && treeData.children.length > 0);
    list.push({
      ...treeData,
      _level,
      _pid,
      _id,
      isLeaf,
      expanded: false,
      children: undefined,
      visible: true,
    });
    if (!isLeaf) {
      for (let i = 0; i < treeData.children.length; i++) {
        dfs(treeData.children[i], _level + 1, _id, `${_id}-${i}`);
      }
    }
  };
  for (let i = 0; i < tree.length; i++) {
    dfs(tree[i], 0, '0', `0-${i}`);
  }
  return list;
}
