import React, { Component } from 'react';
import { TreeProps } from 'antd/lib/tree';
import { VariableSizeList as List } from 'react-window';
// import memoize from 'memoize-one';
import { defaultFilterFn } from './util';
import getPrefixCls from '../_util/getPrefixCls';
import TreeNode from './TreeNode';
import TreeStore, { TreeNode as TN } from './store';
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
  value: any;
  /** 下拉菜单高度 */
  height: number;
  /** 元素高度 */
  optionHeight: number;
  /** 代表 label 的 option 属性  */
  titleField: string;
  /** 代表 value 的 option 属性  */
  keyField: string;
  filterOption?: boolean | ((inputValue: string, option: object) => any);
  treeData: Array<object>;
  onChange: (v: any, store: any) => any;
  prefixCls?: string;
  /** 忽略模式 */
  ignoreMode: IgnoreType;
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

  // public static getDerivedStateFromProps(nextProps: any) {
  //   if ('value' in nextProps) {
  //     return {
  //       value: nextProps.value || undefined,
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

  handleNodeExpand = (nodeKey: string) => {
    const node = this.getNode(nodeKey) as TN;
    const { keyField } = this.props;
    this.store.setExpand((node as Indexable)[keyField], !node.expand);
    // console.log('treeNode', treeNode);
    // let { expandedKeys } = this.state;
    // const { onExpand, loadData } = this.props;
    // const { eventKey, expanded } = treeNode.props;

    // // Update selected keys
    // const index = expandedKeys.indexOf(eventKey);
    // const targetExpanded = !expanded;

    // warning(
    //   (expanded && index !== -1) || (!expanded && index === -1),
    //   'Expand state not sync with index check',
    // );

    // if (targetExpanded) {
    //   expandedKeys = arrAdd(expandedKeys, eventKey);
    // } else {
    //   expandedKeys = arrDel(expandedKeys, eventKey);
    // }

    // this.setUncontrolledState({ expandedKeys });

    // if (onExpand) {
    //   onExpand(expandedKeys, {
    //     node: treeNode,
    //     expanded: targetExpanded,
    //     nativeEvent: e.nativeEvent,
    //   });
    // }

    // // Async Load data
    // if (targetExpanded && loadData) {
    //   const loadPromise = this.onNodeLoad(treeNode);
    //   return loadPromise ? loadPromise.then(() => {
    //     // [Legacy] Refresh logic
    //     this.setUncontrolledState({ expandedKeys });
    //   }) : null;
    // }

    return null;
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

  filterOption = (input: string, option: any, defaultFilter = defaultFilterFn) => {
    const { filterOption } = this.props;
    let filterFn = filterOption;
    if ('filterOption' in this.props) {
      if (filterOption === true) {
        filterFn = defaultFilter.bind(this);
      }
    } else {
      filterFn = defaultFilter.bind(this);
    }

    if (!filterFn) {
      return true;
    }
    if (typeof filterFn === 'function') {
      return filterFn.call(this, input, option);
    }
    if (option.disabled) {
      return false;
    }
    return true;
  };

  render() {
    console.log('render...');
    const { keyField, titleField, prefixCls: customizePrefixCls, optionHeight } = this.props;
    const { renderNodes, blockAreaHeight, blockLength } = this.state;
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
          height={blockAreaHeight}
          itemCount={blockLength}
          itemSize={() => optionHeight}
          width=""
        >
          {wrappedRowRenderer}
        </List>
      </div>
    );
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
