import React, { Component } from 'react';
import { Input } from 'antd';
import Tree, { IProps as TreeProps } from '.';

const { Search } = Input;
export interface IProps extends TreeProps {
  /** 支持搜索 */
  showSearch: boolean;
}
export interface IState {}

class TreeSearch extends Component<IProps, IState> {
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
export default TreeSearch;
