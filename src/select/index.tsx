import React, { Component } from 'react';
import { Select } from 'antd';
import { SelectProps as AntdSelectProps } from 'antd/lib/select';
import classnames from 'classnames';
import { VariableSizeList as List } from 'react-window';
import omit from 'omit.js';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { defaultFilterFn } from './util';

export interface Option {
  [key: string]: React.ReactNode;
}

export type ValueType = string | number | string[] | number[];

export interface SelectProps
  extends Omit<AntdSelectProps, 'defaultValue' | 'value' | 'filterOption'> {
  value?: ValueType;
  defaultValue?: ValueType;
  /** 下拉菜单高度 */
  height?: number;
  /** 元素高度 */
  optionHeight?: (param: object) => number | number;
  /** 代表 label 的 option 属性  */
  titleField?: string;
  /** 代表 value 的 属性  */
  keyField?: string;
  filterOption?: boolean | ((inputValue: string, option: Option) => boolean);
  options?: Option[];
  onChange?: (v: any) => void;
}

export interface IState {
  value?: Option | Option[];
  open: boolean;
  searchValue: string;
}

export default class VirtualizedSelect extends Component<SelectProps, IState> {
  // lock = null;

  static defaultProps = {
    // async: false,
    height: 256,
    optionHeight: 32,
    titleField: 'title',
    keyField: 'id',
    options: [],
    mode: 'default',
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
    // this.scrollActiveItemToView();
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

  private wrapValue = (value: Option | Option[]): Option | Option[] => {
    if (this.props.mode !== 'default' && !Array.isArray(value)) {
      return [value].filter(v => v && v.key !== undefined);
    }
    return value;
  };

  private toArray<T>(value: T | T[]): NonNullable<T>[] {
    return (Array.isArray(value) ? value : [value]).filter(
      (v): v is NonNullable<T> => v !== undefined,
    );
  }

  constructor(props: SelectProps) {
    super(props);
    const key = props.value || props.defaultValue;
    const options = props.options || [];
    const getOption = (): any => {
      if (options.length > 0 && key) {
        const nodes = options.filter(option => option[props.keyField!] === key);
        if (nodes[0]) {
          return this.wrapValue({
            key,
            label: nodes[0][props.titleField!],
          });
        }
      }
      return undefined;
    };
    this.state = {
      value: getOption(),
      searchValue: '',
      open: !!props.defaultOpen,
    };
    this.avList = React.createRef();
  }

  public saveSelect = (node: any) => {
    this.avSelect = node;
  };

  scrollActiveItemToView = () => {
    // console.log('scrollActiveItemToView')
    const { options = [], keyField } = this.props;
    const { value } = this.state;
    const arrayValue = this.toArray(value);
    // find one option
    const focusedOptionIndex = options.findIndex(option =>
      arrayValue.some(val => val.key === option[keyField!]),
    );
    if (this.avList.current) {
      this.avList.current.scrollToItem(focusedOptionIndex);
    }
  };

  handleSearch = (v: string) => {
    this.setState({
      searchValue: v,
    });
  };

  handleSelect = (option: Option) => {
    const { mode, onChange, keyField, titleField } = this.props;
    const currentValue = {
      key: option[keyField!],
      label: option[titleField!],
    };

    this.setState(
      state => {
        if (mode === 'default') {
          if (onChange) onChange(currentValue.key);
          return {
            value: currentValue,
            searchValue: '',
          };
        }
        const value = [...this.toArray(state.value)];
        const index = value.findIndex(item => item.key === currentValue.key);

        if (index === -1) {
          value.push(currentValue);
        } else {
          value.splice(index, 1);
        }
        if (onChange) {
          onChange(value.map(item => item.key));
        }
        return { value, searchValue: '' };
      },
      () => {
        this.avSelect.rcSelect.setInputValue('');
        // console.log(this.select.rcSelect)
        this.avSelect.focus();
        if (mode === 'default') {
          this.handleDropdownVisibleChange(false);
        }
      },
    );
  };

  // 清空的时候触发 v为 undefined
  handleChange = (v: Option | Option[]) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Array.isArray(v) ? v.map(vv => vv.key) : v.key);
    }
    this.setState({
      value: v,
      searchValue: '',
    });
  };

  handleDropdownVisibleChange = (open: boolean) => {
    const { onDropdownVisibleChange } = this.props;
    this.setState({ open });
    if (onDropdownVisibleChange) {
      onDropdownVisibleChange(open);
    }
  };

  handleBlur = () => {
    this.setState({
      searchValue: '',
    });
  };

  _getItemSize = (index: number): number => {
    const { optionHeight, options = [] } = this.props;
    return optionHeight instanceof Function ? optionHeight(options[index]) : optionHeight || 0;
  };

  /**
   *  计算List应该显示的高度
   *
   * @param {Array<object>} options
   * @returns
   * @memberof VirtualizedSelect
   */
  _calculateListHeight = (options: Array<object>): number => {
    const { height: maxHeight } = this.props;

    let height = 0;

    for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
      height += this._getItemSize(optionIndex);
      if (height > (maxHeight as number)) {
        return maxHeight as number;
      }
    }
    return height;
  };

  handleEventPrevent = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  _optionRenderer = ({
    handleSelect,
    titleField,
    option,
    style,
    valueArray,
    keyField,
    prefixCls,
  }: any) => {
    const className = classnames(`${prefixCls}-item`, {
      [`${prefixCls}-item-disabled`]: option.disabled,
      [`${prefixCls}-item-selected`]:
        valueArray && valueArray.some((v: any) => v.key === option[keyField]),
    });

    const events = option.disabled
      ? {}
      : {
          onClick: () => handleSelect(option),
        };

    return (
      <div className={className} style={style} {...events}>
        {option[titleField]}
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

  renderMenu = (menu: any, getPrefixCls: any) => {
    const {
      keyField,
      titleField,
      filterOption,
      prefixCls: customizePrefixCls,
      options: sourceOptions = [],
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

    const prefixCls = getPrefixCls('select', customizePrefixCls);
    const wrappedRowRenderer = ({ index, style }: any) => {
      const option = options[index];

      return this._optionRenderer({
        handleSelect: this.handleSelect,
        titleField,
        option,
        style,
        valueArray: this.toArray(value),
        keyField,
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

  renderSelect = ({
    // getPopupContainer: getContextPopupContainer,
    getPrefixCls,
  }: ConfigConsumerProps) => {
    const { value, open } = this.state;
    const { titleField, ...restProps } = this.props;
    // 去除 antdSelect 中会影响 VirtualizedSelect 的prop
    // 通过控制 rest的写入位置也可以实现
    const rest = omit(restProps, ['defaultValue', 'value']);
    return (
      <Select
        {...(rest as any)}
        value={value}
        ref={this.saveSelect}
        open={open}
        onSearch={(v: string) => this.handleSearch(v)}
        onChange={this.handleChange}
        onBlur={() => this.handleBlur()}
        labelInValue
        optionLabelProp={titleField}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
        dropdownRender={menu => this.renderMenu(menu, getPrefixCls)}
        dropdownStyle={{ overflow: 'hidden' }}
      />
    );
  };

  render() {
    return <ConfigConsumer>{this.renderSelect}</ConfigConsumer>;
  }
}
