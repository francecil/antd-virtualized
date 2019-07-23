import React, { Component } from 'react';
import { TreeProps as AntdTreeProps } from 'antd/lib/tree';
import { VariableSizeList as List } from 'react-window';
// import memoize from 'memoize-one';
import defaultRenderEmpty, { RenderEmptyHandler } from 'antd/lib/config-provider/renderEmpty';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import TreeNode from './TreeNode';
import TreeSearch from './TreeSearch';
import TreeStore, { TreeNode as TN } from './store';
import { FilterFunctionType, IEventNames, ListenerType } from './store/tree-store';
import {
  TreeNodeKeyType,
  ignoreEnum,
  IgnoreType,
  RenderTreeNodeType,
  // verticalPositionEnum,
  // VerticalPositionType,
  // dragHoverPartEnum,
} from './const';
import { Indexable } from './store/tree-node';

const storeEvents: Array<keyof IEventNames> = [
  'expand',
  'select',
  'unselect',
  'selected-change',
  'check',
  'uncheck',
  'checked-change',
  'set-data',
];
export interface TreeProps extends Omit<AntdTreeProps, 'value'> {
  value?: any;
  /** 下拉菜单高度，当值为-1时为列表全展开 */
  height?: number;
  /** 元素高度 */
  optionHeight?: number;
  /** 代表 label 的 option 属性  */
  titleField?: string;
  /** 代表 value 的 option 属性  */
  keyField?: string;
  /** 树形数据 */
  treeData?: Array<object>;
  onChange?: (v: any, store: any) => any;
  prefixCls?: string;
  /** 忽略模式 */
  ignoreMode?: IgnoreType;
  /** 节点过滤方法 */
  filterMethod?: FilterFunctionType;
  /** 节点渲染 render 函数 */
  render?: RenderTreeNodeType;
  /** 数据为空时显示 */
  notFoundContent?: React.ReactNode | null;
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

class Tree extends Component<TreeProps, IState> {
  // lock = null;
  static Search: typeof TreeSearch;

  static TreeNode: typeof TreeNode;

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
    this.store.on('selected-change', this.emitSelectableInput);
    // this.attachStoreEvents()
    const { treeData } = this.props;
    this.store.setData(treeData!);
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
      keyField: keyField!,
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
      blockAreaHeight: optionHeight! * this.blockNodes.length,
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

  /**
   * 转发 store 所触发的事件，通过 vue 组件触发事件可被其他组件监听
   */
  // attachStoreEvents = (): void => {
  //   for (let event in this.$listeners) {
  //     if (storeEvents.indexOf(event as keyof IEventNames) > -1) {
  //       const e: keyof IEventNames = event as keyof IEventNames
  //       this.store.on(e, this.$listeners[event] as ListenerType<typeof e> | Array<ListenerType<typeof e>>)
  //     }
  //   }
  // }

  scrollActiveItemToView = () => {
    const node = this.store.getSelectedNode();
    if (node) {
      const index = this.store.findIndex(node);
      this.avList.current.scrollToItem(index);
    }
  };

  /**
   * 触发单选 input 事件
   */
  emitSelectableInput = (selectedNode: TN | null, selectedKey: TreeNodeKeyType | null): void => {
    const { selectable, checkable, onSelect } = this.props;
    if (selectable && !checkable) {
      // 单选
      const emitValue: TreeNodeKeyType = selectedKey || '';
      if (onSelect) {
        onSelect([emitValue as string], {
          selected: true,
          selectedNodes: [],
          node: selectedNode,
          event: null,
        } as any);
      }
    }
  };

  handleNodeSelect = (e: any, data: TN) => {
    const { onChange, keyField } = this.props;
    // const value = {
    //   key: option[keyField],
    //   label: option[titleField],
    // };
    this.setSelected((data as Indexable)[keyField!], !data.selected);
    if (onChange) {
      onChange((data as Indexable)[keyField!], data);
    }
    // this.setState({
    //   value,
    // });
  };

  handleNodeExpand = (nodeKey: string): void => {
    const node = this.getNode(nodeKey) as TN;
    const { keyField } = this.props;
    this.store.setExpand((node as Indexable)[keyField!], !node.expand);
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

  // handleEventPrevent = (e: any) => e.preventDefault();

  getRrenderHeight = (): number => {
    const { blockAreaHeight } = this.state;
    const height = this.props.height!;
    if (height === -1) {
      return blockAreaHeight;
    }
    // 最大为height
    return blockAreaHeight > height ? height : blockAreaHeight;
  };

  renderTree = ({
    // getPopupContainer: getContextPopupContainer,
    getPrefixCls,
  }: ConfigConsumerProps) => {
    // console.log('render...');
    const {
      keyField,
      titleField,
      prefixCls: customizePrefixCls,
      optionHeight,
      render,
    } = this.props;
    const { renderNodes, blockLength } = this.state;
    // console.log('renderNodes:', renderNodes);
    // const { value } = this.state;
    // const nodeList = this.store.flatData;
    // const nodeList = this.visibleNodes(this.store.flatData)

    const prefixCls = getPrefixCls('tree', customizePrefixCls);
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
        render,
        fullData: this.getNode((data as Indexable)[keyField!]),
        // selected: valueArray && valueArray.some((v: any) => v.key === (data as Indexable)[keyField]),
      };
      // console.log('props:', props)
      return <TreeNode {...props} />;
    };
    return (
      <div className={prefixCls}>
        {blockLength ? (
          <List
            ref={this.avList}
            className={`${prefixCls}-menu`}
            height={this.getRrenderHeight()}
            itemCount={blockLength}
            itemSize={() => optionHeight!}
            width=""
          >
            {wrappedRowRenderer}
          </List>
        ) : (
          this.getNotFoundContent(defaultRenderEmpty)
        )}
      </div>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderTree}</ConfigConsumer>;
  }

  filter(keyword: string, filterMethod?: FilterFunctionType): void {
    const { titleField, filterMethod: mFilterMethod } = this.props;
    const defaultFilterMethod = (mKeyword: string, node: TN) => {
      const title = (node as Indexable)[titleField!];
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

  getNotFoundContent(renderEmpty: RenderEmptyHandler) {
    const { notFoundContent } = this.props;
    if (notFoundContent !== undefined) {
      return notFoundContent;
    }

    // if (this.isCombobox()) {
    //   return null;
    // }

    return renderEmpty('Select');
  }
}
export default Tree;
