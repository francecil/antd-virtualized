import React, { Component } from 'react';
import { Input } from 'antd';
import { VariableSizeList as List } from 'react-window';
import Tree, { IProps as TreeProps } from './Tree';
// import memoize from 'memoize-one';
import { defaultFilterFn } from './util';
import getPrefixCls from '../_util/getPrefixCls';
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

const { Search } = Input;
export interface IProps extends TreeProps {
  /** 支持搜索 */
  showSearch: boolean;
  filterOption?: boolean | ((inputValue: string, option: object) => any);
}
export interface IState {}

export default class TreeSearch extends Component<IProps, IState> {
  // lock = null;

  static defaultProps = {
    showSearch: true,
  };

  public componentDidMount() {}

  // 更新renderNodes
  public componentDidUpdate() {}

  private tree: any;

  constructor(props: any) {
    super(props);
    this.state = {};
    this.tree = React.createRef();
  }

  handleChange = (e: any) => {
    const keyword = e.target.value;
    this.filterTree(keyword);
  };

  handleSearch = (value: string, e: any): void => {
    this.filterTree(value);
  };

  filterTree = (value: string) => {
    if (this.tree.current) {
      this.tree.current.filter(value);
    }
  };

  render() {
    const { showSearch, ...rest } = this.props;
    return (
      <div>
        {showSearch && (
          <Search
            style={{ marginBottom: 8 }}
            placeholder="Search"
            onChange={this.handleChange}
            onSearch={this.handleSearch}
          />
        )}
        <Tree {...rest} ref={this.tree} />
      </div>
    );
  }
}
