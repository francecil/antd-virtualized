import React, { Component } from 'react';
import { TreeProps } from 'antd/lib/tree';
import { VariableSizeList as List } from 'react-window';
// import memoize from 'memoize-one';
import { defaultFilterFn } from './util';
import getPrefixCls from '../_util/getPrefixCls';
import TreeNode from './TreeNode';
import TreeStore, { TreeNode as TN } from './store';
import { FilterFunctionType } from './store/tree-store';
import {
  TreeNodeKeyType,
  ignoreEnum,
  IgnoreType,
  // verticalPositionEnum,
  // VerticalPositionType,
  // dragHoverPartEnum,
} from './const';
import { Indexable } from './store/tree-node';

export interface IProps extends TreeProps {
  value?: any;
  /** 下拉菜单高度，当值为-1时为列表全展开 */
  height: number;
  /** 元素高度 */
  optionHeight: number;
  /** 代表 label 的 option 属性  */
  titleField: string;
  /** 代表 value 的 option 属性  */
  keyField: string;
  /** 树形数据 */
  treeData: Array<object>;
  onChange?: (v: any, store: any) => any;
  prefixCls?: string;
  /** 忽略模式 */
  ignoreMode?: IgnoreType;
  /** 节点过滤方法 */
  filterMethod?: FilterFunctionType;
}
export interface IState {
  // value: any;
  /** 渲染节点（实际渲染节点） */
  renderNodes: TN[];

  /** 可见节点个数 */
  blockLength: number;

  /** 可见节点总高度 */
  blockAreaHeight: number;
}

export default class Tree extends Component<IProps, IState> {
  // lock = null;

  static defaultProps = {
    // async: false,
    height: 256,
    optionHeight: 32,
    titleField: 'title',
    keyField: 'id',
    treeData: [],
    ignoreMode: ignoreEnum.none,
  };

  // treeData变动 数据重构
  // public static getDerivedStateFromProps(nextProps: any) {
  //   if ('treeData' in nextProps) {
  //     return {
  //       treeData: nextProps.treeData || undefined,
  //     };
  //   }
  //   return null;
  // }

  public componentDidMount() {
    // window.store = this.store
    this.store.on('visible-data-change', this.updateBlockNodes);
    this.store.on('render-data-change', this.updateRender);
    const { treeData } = this.props;
    this.store.setData(treeData);
  }

  // 更新renderNodes
  public componentDidUpdate() {}

  private avList: any;

  private store: TreeStore;

  // 所有可见节点
  private blockNodes: TN[];

  constructor(props: any) {
    super(props);
    this.state = {
      renderNodes: [],
      /** 可见节点个数 */
      blockLength: 0,

      /** 可见节点总高度 */
      blockAreaHeight: 0,
    };
    this.avList = React.createRef();
    const { keyField, ignoreMode, defaultExpandAll } = this.props;
    this.store = new TreeStore({
      keyField,
      ignoreMode,
      defaultExpandAll,
    });
    this.blockNodes = [];
    // this.store.on('checked-change', (checkedNodes: TreeNode[], checkedKeys: TreeNodeKeyType[]) => {
    //   this.emitCheckableInput(checkedNodes, checkedKeys)
    //   this.updateUnloadStatus()
    // })
    // this.store.on('selected-change', this.emitSelectableInput)
  }

  /**
   * 计算可见节点
   */
  updateBlockNodes = (): void => {
    this.blockNodes = this.store.flatData.filter(node => node.visible);
    this.updateBlockData();
    this.updateRender();
  };

  /**
   * 更新 block 数据相关信息
   */
  updateBlockData = (): void => {
    const { optionHeight } = this.props;
    this.setState({
      blockLength: this.blockNodes.length,
      blockAreaHeight: optionHeight * this.blockNodes.length,
    });
  };

  /**
   * 计算渲染节点数量，并计算渲染节点
   */
  updateRender = (): void => {
    // this.updateRenderAmount()
    this.updateRenderNodes();
  };

  /**
   * 应该渲染的节点，响应式
   */
  updateRenderNodes = (): void => {
    this.setState({
      renderNodes: this.blockNodes.map((node: TN) => {
        return Object.assign({}, node, {
          _parent: null,
          children: [],
        });
      }),
    });
  };

  scrollActiveItemToView = () => {
    // console.log('scrollActiveItemToView')
    const { value, keyField } = this.props;
    const nodeList = this.store.flatData;
    const focusedOptionIndex = nodeList.findIndex(
      (node: Indexable) => node[keyField] === (value || {}).key,
    );
    if (this.avList.current) {
      this.avList.current.scrollToItem(focusedOptionIndex);
    }
  };

  /**
   * 触发单选 input 事件
   */
  emitSelectableInput = (
    selectedNode: TreeNode | null,
    selectedKey: TreeNodeKeyType | null,
  ): void => {
    const { selectable, checkable, onSelect } = this.props;
    if (selectable && !checkable) {
      // 单选
      const emitValue: TreeNodeKeyType = selectedKey || '';
      // this.valueCache = emitValue
      // this.$emit('input', emitValue)
      if (onSelect) {
        onSelect([emitValue as string], null as any);
      }
    }
  };

  handleNodeSelect = (e: any, data: TN) => {
    const { onChange, keyField } = this.props;
    // const value = {
    //   key: option[keyField],
    //   label: option[titleField],
    // };
    this.setSelected((data as Indexable)[keyField], !data.selected);
    if (onChange) {
      onChange((data as Indexable)[keyField], data);
    }
    // this.setState({
    //   value,
    // });
  };

  handleNodeExpand = (nodeKey: string): void => {
    const node = this.getNode(nodeKey) as TN;
    const { keyField } = this.props;
    this.store.setExpand((node as Indexable)[keyField], !node.expand);
  };

  // 清空的时候触发 v为 undefined
  handleChange = (v: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(v, null);
    }
    // this.setState({
    //   value: v,
    // });
  };

  handleEventPrevent = (e: any) => e.preventDefault();

  getRrenderHeight = (): number => {
    const { blockAreaHeight } = this.state;
    const { height } = this.props;
    if (height === -1) {
      return blockAreaHeight;
    }
    // 最大为height
    return blockAreaHeight > height ? height : blockAreaHeight;
  };

  render() {
    // console.log('render...');
    const { keyField, titleField, prefixCls: customizePrefixCls, optionHeight } = this.props;
    const { renderNodes, blockLength } = this.state;
    console.log('renderNodes:', renderNodes);
    // const { value } = this.state;
    // const nodeList = this.store.flatData;
    // const nodeList = this.visibleNodes(this.store.flatData)

    const prefixCls = getPrefixCls.call(this, 'tree', customizePrefixCls);
    const wrappedRowRenderer = ({ index, style }: any) => {
      const data = renderNodes[index];
      const props = {
        onSelect: this.handleNodeSelect,
        onNodeExpand: this.handleNodeExpand,
        titleField,
        data,
        style,
        // valueArray: value ? [value] : null,
        keyField,
        prefixCls,
        // selected: valueArray && valueArray.some((v: any) => v.key === (data as Indexable)[keyField]),
      };
      // console.log('props:', props)
      return <TreeNode {...props} />;
    };
    return (
      <div onMouseDown={this.handleEventPrevent} className={prefixCls}>
        <List
          ref={this.avList}
          className={`${prefixCls}-menu`}
          height={this.getRrenderHeight()}
          itemCount={blockLength}
          itemSize={() => optionHeight}
          width=""
        >
          {wrappedRowRenderer}
        </List>
      </div>
    );
  }

  filter(keyword: string, filterMethod?: FilterFunctionType): void {
    const { titleField, filterMethod: mFilterMethod } = this.props;
    const defaultFilterMethod = (mKeyword: string, node: TN) => {
      const title = (node as Indexable)[titleField];
      if (title == null || !title.toString) return false;
      return (title.toString() as string).toLowerCase().indexOf(mKeyword.toLowerCase()) > -1;
    };
    filterMethod = filterMethod || mFilterMethod || defaultFilterMethod;
    // console.log('keyword, filterMethod',keyword, filterMethod)
    this.store.filter(keyword, filterMethod);
  }

  getNode = (key: TreeNodeKeyType): TN | null => {
    return this.store.getNode(key);
  };

  setSelected = (key: TreeNodeKeyType, value: boolean): void => {
    this.store.setSelected(key, value);
  };

  getNodesCount = (): number => {
    return this.store.flatData.length;
  };

  getCurrentVisibleNodes = (): TN[] => {
    return this.store.flatData.filter((node: any) => node.visible);
  };
}
