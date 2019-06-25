import React, { Component } from 'react';
import { Select } from 'antd';
import { AbstractSelectProps } from 'antd/lib/select';
import memoize from 'memoize-one';
import { defaultFilterFn, convertTreeToList } from '../tree/util';
import getPrefixCls from '../_util/getPrefixCls';
import Tree, { IProps as TreeProps } from '../tree/Tree';
// import omit from 'omit.js';
export interface IProps extends AbstractSelectProps {
  titleField: string;
}

export interface IState {
  open: boolean;
}

export default class TreeSelect extends Component<IProps, IState> {
  // lock = null;

  static defaultProps = {
    titleField: 'title',
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
    // console.log('componentDidMount....')
  }

  public componentDidUpdate(prevProps: any, prevState: Partial<IState>) {
    // console.log('componentDidUpdate....')
    // const { open } = this.state;
    // if (!prevState.open && open) {
    //   this.scrollActiveItemToView();
    // }
  }

  private avSelect: any;

  private tree: any;

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
    };
    this.tree = React.createRef();
  }

  public saveSelect = (node: any) => {
    this.avSelect = node;
  };

  // scrollActiveItemToView = () => {
  //   // console.log('scrollActiveItemToView')
  //   const { treeData, valueField } = this.props;
  //   const { value } = this.state;
  //   const nodeList = this.nodeList(treeData);
  //   const focusedOptionIndex = nodeList.findIndex(
  //     (option: any) => option[valueField] === (value || {}).key,
  //   );
  //   if (this.avList.current) {
  //     this.avList.current.scrollToItem(focusedOptionIndex);
  //   }
  // };

  handleSearch = (v: any) => {
    this.setState({});
  };

  // 清空的时候触发 v为 undefined
  handleChange = (v: any) => {
    // const { onChange } = this.props;
    // if (onChange) {
    //   onChange(v);
    // }
    this.setState({});
  };

  handleDropdownVisibleChange = (open: boolean) => {
    this.setState({ open });
  };

  handleBlur = () => {
    this.setState({});
  };

  handleEventPrevent = (e: any) => e.preventDefault();

  renderMenu = (menu: any) => {
    const { ...rest } = this.props;
    return <Tree {...rest} ref={this.tree} />;
  };

  render() {
    const { open } = this.state;
    const { titleField, ...restProps } = this.props;
    // 去除 antdSelect 中会影响 VirtualizedSelect 的prop
    // 通过控制 rest的写入位置也可以实现
    // const rest = omit(restProps, ['dropdownRender']);
    return (
      <Select
        {...restProps}
        ref={this.saveSelect}
        open={open}
        onSearch={(v: string) => this.handleSearch(v)}
        onChange={this.handleChange}
        onBlur={() => this.handleBlur()}
        labelInValue
        optionLabelProp={titleField}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
        dropdownRender={this.renderMenu}
        dropdownStyle={{ overflow: 'hidden' }}
      />
    );
  }
}
