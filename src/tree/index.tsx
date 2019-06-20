import React, { Component } from 'react';
// eslint-disable-next-line
import { SelectProps } from 'antd/lib/select';
import { VariableSizeList as List } from 'react-window';
import memoize from 'memoize-one';
import { defaultFilterFn, convertTreeToList } from './util';
import getPrefixCls from '../_util/getPrefixCls';
import TreeNode from './TreeNode';
// import omit from 'omit.js';
export interface IProps extends SelectProps {
  /** 下拉菜单高度 */
  height: number;
  /** 元素高度 */
  optionHeight: (param: object) => number | number;
  /** 代表 label 的 option 属性  */
  labelField: string;
  /** 代表 value 的 option 属性  */
  valueField: string;
  filterOption?: boolean | ((inputValue: string, option: object) => any);
  treeData: Array<object>;
  onChange: (v: any) => any;
}
export interface IState {
  value: any;
}

export default class VirtualizedTree extends Component<IProps, IState> {
  // lock = null;

  static defaultProps = {
    // async: false,
    height: 256,
    optionHeight: 32,
    labelField: 'label',
    valueField: 'value',
    treeData: [],
  };

  public static getDerivedStateFromProps(nextProps: any) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value || undefined,
      };
    }
    return null;
  }

  public componentDidMount() {
    // console.log('componentDidMount....')
  }

  private avSelect: any;

  private avList: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
    };
    this.avList = React.createRef();
  }

  public saveSelect = (node: any) => {
    this.avSelect = node;
  };

  nodeList = memoize((treeData: Array<any>) => convertTreeToList(treeData));

  scrollActiveItemToView = () => {
    // console.log('scrollActiveItemToView')
    const { treeData, valueField } = this.props;
    const { value } = this.state;
    const nodeList = this.nodeList(treeData);
    const focusedOptionIndex = nodeList.findIndex(
      (option: any) => option[valueField] === (value || {}).key,
    );
    if (this.avList.current) {
      this.avList.current.scrollToItem(focusedOptionIndex);
    }
  };

  handleSelect = (e: any, option: any) => {
    const { onChange, valueField, labelField } = this.props;
    const value = {
      key: option[valueField],
      label: option[labelField],
    };
    if (onChange) {
      onChange(value);
    }
    this.setState({
      value,
    });
  };

  handleNodeExpand = (treeNode: any) => {
    console.log('treeNode', treeNode);
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
      onChange(v);
    }
    this.setState({
      value: v,
    });
  };

  _getItemSize = (index: number) => {
    const { optionHeight, treeData } = this.props;
    const nodeList = this.nodeList(treeData);
    return optionHeight instanceof Function ? optionHeight(nodeList[index]) : optionHeight;
  };

  /**
   *  计算List应该显示的高度
   *
   * @param {Array<object>} treeData
   * @returns
   * @memberof VirtualizedSelect
   */
  _calculateListHeight(nodeList: Array<object>) {
    const { height: maxHeight } = this.props;

    let height = 0;
    for (let optionIndex = 0; optionIndex < nodeList.length; optionIndex++) {
      height += this._getItemSize(optionIndex);
      if (height > maxHeight) {
        return maxHeight;
      }
    }
    return height;
  }

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
    const { valueField, labelField, prefixCls: customizePrefixCls, treeData } = this.props;
    const { value } = this.state;
    const nodeList = this.nodeList(treeData);

    const height = this._calculateListHeight(nodeList);

    const prefixCls = getPrefixCls.call(this, 'tree', customizePrefixCls);
    const valueArray = value ? [value] : null;
    const wrappedRowRenderer = ({ index, style }: any) => {
      const option = nodeList[index];
      const props = {
        onSelect: this.handleSelect,
        onNodeExpand: this.handleNodeExpand,
        labelField,
        option,
        ...option,
        style,
        valueArray: value ? [value] : null,
        valueField,
        prefixCls,
        selected: valueArray && valueArray.some((v: any) => v.key === option[valueField]),
      };
      return <TreeNode {...props} />;
    };
    return (
      <div onMouseDown={this.handleEventPrevent} className={prefixCls}>
        <List
          ref={this.avList}
          className={`${prefixCls}-menu`}
          height={height}
          itemCount={this.nodeList(treeData).length}
          itemSize={this._getItemSize}
          width=""
        >
          {wrappedRowRenderer}
        </List>
      </div>
    );
  }
}
