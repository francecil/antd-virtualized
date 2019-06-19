import React from 'react';
import classnames from 'classnames';
import { Icon } from 'antd';

export interface IProps extends NodeData {
  onSelect: (e: any, node: NodeData) => any;
  [customProp: string]: any;
}
export interface NodeData {
  _level: number;
  _id: string;
  _pid: string;
  isLeaf?: boolean;
  expanded?: boolean;
}
const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

class TreeNode extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  // Isomorphic needn't load data in server side
  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  onSelectorClick = () => {};

  onSelectorDoubleClick = () => {};

  handleSelect = (e: any) => {
    const { onSelect, option } = this.props;
    if (onSelect) {
      onSelect(e, option);
    }
  };

  onCheck = () => {};

  onMouseEnter = () => {};

  onMouseLeave = () => {};

  // Disabled item still can be switch
  onExpand = () => {};

  isDisabled = () => {};

  isCheckable = () => {};

  renderSwitcherIcon = () => {
    const { prefixCls, isLeaf } = this.props;
    if (isLeaf) {
      return null;
    }
    return <Icon type="caret-down" className={`${prefixCls}-switcher-icon`} />;
  };

  // Switcher
  renderSwitcher = () => {
    const { expanded, prefixCls, isLeaf, switcherIcon } = this.props;

    if (isLeaf && switcherIcon) {
      return (
        <span className={classnames(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)}>
          {this.renderSwitcherIcon()}
        </span>
      );
    }

    const switcherCls = classnames(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`,
    );
    return (
      <span onClick={this.onExpand} className={switcherCls}>
        {this.renderSwitcherIcon()}
      </span>
    );
  };

  render() {
    const {
      value,
      style: mstyle,
      disabled,
      prefixCls,
      _level,
      expanded,
      isLeaf,
      selected,
    } = this.props;
    const className = classnames(`${prefixCls}-node-content-wrapper`, {
      [`${prefixCls}-node-disabled`]: disabled,
      [`${prefixCls}-node-switcher-${expanded ? 'open' : 'close'}`]: !isLeaf,
      [`${prefixCls}-node-selected`]: selected,
    });
    const marginLeft = 24 * _level;
    const style = {
      ...mstyle,
      marginLeft,
      width: `calc(100% - ${marginLeft}px)`,
    };
    const events = disabled
      ? {}
      : {
          onClick: this.handleSelect,
        };

    return (
      <div style={style} {...events} className={`${prefixCls}-node`}>
        {this.renderSwitcher()}
        <span className={className}>{value}</span>
      </div>
    );
  }
}

export default TreeNode;
