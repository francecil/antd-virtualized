import React, { Component } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import omit from 'omit.js';
import Tree, { IProps as TreeProps } from '../tree/Tree';
import { TreeNode as TN } from '../tree/store';

export interface IState {
  open: boolean;
  selectValue: any;
}
// 整合两者，相同属性以TreeProps为主
type UnionProp = Omit<SelectProps<TN>, keyof TreeProps> & TreeProps;

type rewrite = 'onSelect' | 'onChange';
export interface IProp extends Omit<UnionProp, rewrite> {
  onSelect?: (value: any, node: TN, extra: any) => void;
  onChange?: (value: any, label: string, extra: any) => void;
}

export default class TreeSelect extends Component<IProp, IState> {
  // lock = null;

  static defaultProps = {
    titleField: 'title',
    keyField: 'id',
  };

  public componentDidMount() {
    // console.log('componentDidMount....')
  }

  public componentDidUpdate(prevProps: any, prevState: Partial<IState>) {
    const { open } = this.state;
    if (!prevState.open && open) {
      this.scrollActiveItemToView();
    }
  }

  private avSelect: any;

  private tree: any;

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      selectValue: undefined,
    };
    this.tree = React.createRef();
  }

  public saveSelect = (node: any) => {
    this.avSelect = node;
  };

  scrollActiveItemToView = () => {
    // console.log('scrollActiveItemToView')
    if (this.tree.current) {
      this.tree.current.scrollActiveItemToView();
    }
  };

  filterTree = (value: string) => {
    if (this.tree.current) {
      this.tree.current.filter(value);
    }
  };

  handleSearch = (value: string) => {
    this.filterTree(value);
  };

  // 清空的时候触发 v为 undefined
  handleChange = (v: any) => {
    // const { onChange } = this.props;
    // if (onChange) {
    //   onChange(v);
    // }
    console.log('change');
    this.filterTree('');
  };

  handleDropdownVisibleChange = (open: boolean) => {
    this.setState({ open });
  };

  handleBlur = () => {
    this.setState({});
  };

  handleSelect = (v: any, { node }: any) => {
    const { onSelect, keyField, titleField, onChange } = this.props;
    if (onSelect) {
      onSelect(node[keyField], node, null);
    }
    if (onChange) {
      onChange(node[keyField], node[titleField], null);
    }
    const value = {
      key: node[keyField],
      label: node[titleField],
    };
    this.setState(
      {
        selectValue: value,
        open: false,
      },
      () => {
        this.avSelect.rcSelect.setInputValue('');
        // console.log(this.select.rcSelect)
        this.avSelect.focus();
      },
    );
  };

  handleEventPrevent = (e: any) => e.preventDefault();

  renderMenu = (menu: any) => {
    const { ...restProps } = this.props;
    const rest = omit(restProps, ['onChange']);
    return (
      <div onMouseDown={this.handleEventPrevent}>
        <Tree {...rest} ref={this.tree} onSelect={this.handleSelect} />
      </div>
    );
  };

  render() {
    const { open, selectValue } = this.state;
    const { titleField, ...restProps } = this.props;
    // 去除 antdSelect 中会影响 VirtualizedSelect 的prop
    // 通过控制 rest的写入位置也可以实现
    const rest = omit(restProps, ['onSelect', 'labelInValue']);
    return (
      <Select
        {...rest}
        value={selectValue}
        ref={this.saveSelect}
        open={open}
        onSearch={this.handleSearch}
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
