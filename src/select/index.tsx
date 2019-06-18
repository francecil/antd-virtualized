import React, { Component } from 'react';
import { Select } from 'antd';
// eslint-disable-next-line
import { SelectProps } from 'antd/lib/select';
import classnames from 'classnames';
import { VariableSizeList as List } from 'react-window';
import { defaultFilterFn } from './util';
// import omit from 'omit.js';
export interface IProps extends SelectProps {
  /** 下拉菜单高度 */
  height: number | string;
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
  focusedOption: any;
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

  private avSelect: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
      searchValue: '',
      focusedOption: null,
      open: false,
    };
  }

  public saveSelect = (node: any) => {
    this.avSelect = node;
  };

  lockClose = (e: any) => {
    e.preventDefault();
    // clearTimeout(this.lock);
    // this.lock = setTimeout(() => {
    //   this.lock = null;
    // }, 100);
  };

  handleSearch = (v: any) => {
    this.setState({
      searchValue: v,
    });
  };

  handleFocus = (focusedOption: any) => {
    this.setState({
      focusedOption,
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
    // if (this.lock) {
    //   this.select.focus();
    //   return;
    // }
    this.setState({ open });
  };

  handleBlur = () => {
    this.setState({
      searchValue: '',
      focusedOption: null,
    });
  };

  /**
   *
   */
  _getItemSize = (index: number) => {
    const { optionHeight, options } = this.props;
    return optionHeight instanceof Function ? optionHeight(options[index]) : optionHeight;
  };

  _calculateListHeight(options: any) {
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

  _optionRenderer = ({
    focusedOption,
    handleSelect,
    key,
    labelKey,
    option,
    style,
    valueArray,
    valueKey,
  }: any) => {
    const className = classnames('ant-virtualized-select-item', option.className, {
      VirtualizedSelectFocusedOption: option[valueKey] === focusedOption,
      VirtualizedSelectDisabledOption: option.disabled,
      VirtualizedSelectSelectedOption:
        valueArray && valueArray.some((v: any) => v.key === option[valueKey]),
    });

    const events = option.disabled
      ? {}
      : {
          onClick: () => handleSelect(option),
          // onMouseEnter: () => handleFocus(option[valueKey])
        };

    return (
      <div className={className} key={key} style={style} title={option[labelKey]} {...events}>
        {option[labelKey]}
      </div>
    );
  };

  public filterOption = (input: string, option: any, defaultFilter = defaultFilterFn) => {
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
    const { valueKey, labelKey, filterOption, options: sourceOptions } = this.props;
    const { searchValue, focusedOption, value } = this.state;

    const options =
      filterOption && searchValue
        ? sourceOptions.filter((option: object) => this.filterOption(searchValue, option))
        : sourceOptions;
    if (options.length === 0) {
      return menu;
    }
    const height = this._calculateListHeight(options);
    // 当处于关闭状态时，调用该render时设置不滚动到对应元素，在open时才能自动滚动过去
    // const focusedOptionIndex = open ? options.findIndex(v => v[valueKey] === (value || {}).key) : undefined
    // console.log('focusedOptionIndex', focusedOptionIndex)
    const innerRowRenderer = this._optionRenderer;

    const wrappedRowRenderer = ({ index, key, style }: any) => {
      const option = options[index];

      return innerRowRenderer({
        focusedOption,
        // focusedOptionIndex,
        handleSelect: this.handleSelect,
        handleFocus: this.handleFocus,
        key,
        labelKey,
        option,
        optionIndex: index,
        options,
        style,
        valueArray: value ? [value] : null,
        valueKey,
      });
    };

    return (
      <div
        onMouseDown={e => e.preventDefault()}
        className="ant-virtualized-select"
        // onMouseDown={this.lockClose} onMouseUp={this.lockClose}
      >
        <List
          className="VirtualSelectGrid"
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
    // const SelectComponent = this._getSelectComponent()
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
        onSearch={(v: any) => this.handleSearch(v)}
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
