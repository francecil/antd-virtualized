import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Icon } from 'antd';
import { TreeNode as TN } from './store';
import { RenderTreeNodeType } from './const';

export interface IProps {
  /** 节点数据，注意！！为了性能，不让 Vue 监听过多属性，这个 data 不是完整的 TreeNode ，不包括 _parent 和 children 属性 */
  data: TN;
  /** 节点标题字段 */
  titleField: string;

  /** 节点唯一标识字段 */
  keyField: string;

  /** 节点渲染 render 函数 */
  render?: RenderTreeNodeType;

  /** 是否可多选 */
  checkable?: Boolean;

  /** 是否可单选 */
  selectable?: Boolean;

  /** 是否禁用所有节点 */
  disableAll?: Boolean;

  /** 是否可拖拽 */
  draggable?: Boolean;

  /** 是否可放置 */
  droppable?: Boolean;
  /** 自定义图标 */
  icon?: ReactNode | ((props: IProps) => ReactNode);
  // onSelect: (e: any, node: NodeData) => any;
  [customProp: string]: any;
}
export interface IState {
  /** 节点拖拽 dragover */
  dragoverBody: boolean;

  /** 节点前拖拽 dragover */
  dragoverBefore: boolean;

  /** 节点后拖拽 dragover */
  dragoverAfter: boolean;
}
const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

class TreeNode extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      // dragoverBody:false,
      // dragoverBefore: false,
      // dragoverAfter: false,
    };
  }

  // Isomorphic needn't load data in server side
  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  onSelectorClick = () => {};

  onSelectorDoubleClick = () => {};

  handleSelect = (e: any) => {
    const { onSelect, data } = this.props;
    if (onSelect) {
      onSelect(e, data);
    }
  };

  onCheck = () => {};

  onMouseEnter = () => {};

  onMouseLeave = () => {};

  // Disabled item still can be switch
  onExpand = () => {
    const { data, onNodeExpand, keyField } = this.props;
    if (data.isLeaf) return;
    onNodeExpand((data as any)[keyField]);
  };

  isDisabled = () => {};

  isCheckable = () => {};

  renderFunction = (): RenderTreeNodeType | null => {
    const { data, render } = this.props;
    return data.render || render || null;
  };

  renderSwitcherIcon = () => {
    const { prefixCls, data } = this.props;
    if (data.isLeaf) {
      return null;
    }
    return <Icon type="caret-down" className={`${prefixCls}-switcher-icon`} />;
  };

  // Switcher
  renderSwitcher = () => {
    const { prefixCls, data } = this.props;

    if (data.isLeaf) {
      return (
        <span className={classnames(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)}>
          {this.renderSwitcherIcon()}
        </span>
      );
    }

    const switcherCls = classnames(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${data.expand ? ICON_OPEN : ICON_CLOSE}`,
    );
    return (
      <span onClick={this.onExpand} className={switcherCls}>
        {this.renderSwitcherIcon()}
      </span>
    );
  };

  render() {
    const { style: mstyle, prefixCls, data, titleField } = this.props;
    const { disabled, expand, selected, isLeaf, _level, visible } = data;
    const className = classnames(`${prefixCls}-node-content-wrapper`, {
      [`${prefixCls}-node-disabled`]: disabled,
      // [`${prefixCls}-node-switcher-${expand ? 'open' : 'close'}`]: !isLeaf,
      [`${prefixCls}-node-selected`]: selected,
    });
    const paddingLeft = _level > 0 ? 24 * (_level - 1) + 18 : 0;
    const style = {
      ...mstyle,
      padding: `0 0 0 ${paddingLeft}px`,
    };
    const events = disabled
      ? {}
      : {
          onClick: this.handleSelect,
        };
    const nodeClassname = classnames(`${prefixCls}-node`, {
      [`${prefixCls}-node-open`]: visible,
    });
    const renderFunction = this.renderFunction();
    return (
      <div style={style} className={nodeClassname}>
        {this.renderSwitcher()}
        <span {...events} className={className}>
          {renderFunction ? renderFunction(data) : (data as any)[titleField]}
        </span>
      </div>
    );
  }
}

export default TreeNode;
