import React, { Component } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import classnames from 'classnames';
import { VariableSizeList as List } from 'react-window';
import { defaultFilterFn } from './util';
import getPrefixCls from '../_util/getPrefixCls';
// import omit from 'omit.js';
export interface IProps extends SelectProps {
  /** 下拉菜单高度 */
  height: number;
  /** 元素高度 */
  optionHeight: (param: object) => number | number;
  /** 代表 label 的 option 属性  */
  labelKey: string;
  /** 代表 value 的 option 属性  */
  valueKey: string;
  filterOption?: boolean | ((inputValue: string, option: object) => any);
  options: Array<object>;
  onChange: (v: any) => any;
}
export interface IState {
  value: any;
  open: boolean;
  searchValue: string;
}

export default class VirtualizedSelect extends Component<IProps, IState> {
  // lock = null;

  static defaultProps = {
    // async: false,
    height: 256,
    optionHeight: 32,
    labelKey: 'label',
    valueKey: 'value',
    options: [],
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

  public componentDidUpdate(prevProps: any, prevState: Partial<IState>) {
    // console.log('componentDidUpdate....')
    const { open } = this.state;
    if (!prevState.open && open) {
      this.scrollActiveItemToView();
    }
  }

  private avSelect: any;

  private avList: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
      searchValue: '',
      open: false,
    };
    this.avList = React.createRef();
  }

  public saveSelect = (node: any) => {
    this.avSelect = node;
  };

  scrollActiveItemToView = () => {
    // console.log('scrollActiveItemToView')
    const { options, valueKey } = this.props;
    const { value } = this.state;
    const focusedOptionIndex = options.findIndex(
      (option: any) => option[valueKey] === (value || {}).key,
    );
    if (this.avList.current) {
      this.avList.current.scrollToItem(focusedOptionIndex);
    }
  };

  handleSearch = (v: any) => {
    this.setState({
      searchValue: v,
    });
  };

  handleSelect = (option: any) => {
    const { onChange, valueKey, labelKey } = this.props;
    const value = {
      key: option[valueKey],
      label: option[labelKey],
    };
    if (onChange) {
      onChange(value);
    }
    this.setState(
      {
        value,
        searchValue: '',
        open: false,
      },
      () => {
        this.avSelect.rcSelect.setInputValue('');
        // console.log(this.select.rcSelect)
        this.avSelect.focus();
      },
    );
  };

  // 清空的时候触发 v为 undefined
  handleChange = (v: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(v);
    }
    this.setState({
      value: v,
      searchValue: '',
    });
  };

  handleDropdownVisibleChange = (open: boolean) => {
    this.setState({ open });
  };

  handleBlur = () => {
    this.setState({
      searchValue: '',
    });
  };

  _getItemSize = (index: number) => {
    const { optionHeight, options } = this.props;
    return optionHeight instanceof Function ? optionHeight(options[index]) : optionHeight;
  };

  /**
   *  计算List应该显示的高度
   *
   * @param {Array<object>} options
   * @returns
   * @memberof VirtualizedSelect
   */
  _calculateListHeight(options: Array<object>) {
    const { height: maxHeight } = this.props;

    let height = 0;

    for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
      height += this._getItemSize(optionIndex);
      if (height > maxHeight) {
        return maxHeight;
      }
    }
    return height;
  }

  handleEventPrevent = (e: any) => e.preventDefault();

  _optionRenderer = ({
    handleSelect,
    labelKey,
    option,
    style,
    valueArray,
    valueKey,
    prefixCls,
  }: any) => {
    const className = classnames(`${prefixCls}-item`, {
      [`${prefixCls}-item-disabled`]: option.disabled,
      [`${prefixCls}-item-selected`]:
        valueArray && valueArray.some((v: any) => v.key === option[valueKey]),
    });

    const events = option.disabled
      ? {}
      : {
          onClick: () => handleSelect(option),
        };

    return (
      <div className={className} style={style} {...events}>
        {option[labelKey]}
      </div>
    );
  };

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

  renderMenu = (menu: any) => {
    const {
      valueKey,
      labelKey,
      filterOption,
      prefixCls: customizePrefixCls,
      options: sourceOptions,
    } = this.props;
    const { searchValue, value } = this.state;

    const options =
      filterOption && searchValue
        ? sourceOptions.filter((option: object) => this.filterOption(searchValue, option))
        : sourceOptions;
    if (options.length === 0) {
      return menu;
    }
    const height = this._calculateListHeight(options);

    const prefixCls = getPrefixCls.call(this, 'select', customizePrefixCls);
    const wrappedRowRenderer = ({ index, style }: any) => {
      const option = options[index];

      return this._optionRenderer({
        handleSelect: this.handleSelect,
        labelKey,
        option,
        style,
        valueArray: value ? [value] : null,
        valueKey,
        prefixCls,
      });
    };

    return (
      <div onMouseDown={this.handleEventPrevent} className={prefixCls}>
        <List
          ref={this.avList}
          className={`${prefixCls}-menu`}
          height={height}
          itemCount={options.length}
          itemSize={this._getItemSize}
          width=""
        >
          {wrappedRowRenderer}
        </List>
      </div>
    );
  };

  render() {
    const { value, open } = this.state;
    const { labelKey, ...restProps } = this.props;
    // 去除 antdSelect 中会影响 VirtualizedSelect 的prop
    // 通过控制 rest的写入位置也可以实现
    // const rest = omit(restProps, ['dropdownRender']);
    return (
      <Select
        {...restProps}
        value={value}
        ref={this.saveSelect}
        open={open}
        onSearch={(v: string) => this.handleSearch(v)}
        onChange={this.handleChange}
        onBlur={() => this.handleBlur()}
        labelInValue
        optionLabelProp={labelKey}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
        dropdownRender={this.renderMenu}
        dropdownStyle={{ overflow: 'hidden' }}
      />
    );
  }
}
