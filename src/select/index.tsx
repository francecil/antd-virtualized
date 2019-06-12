import React, { Component } from 'react'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import classnames from 'classnames';

import { VariableSizeList as List } from 'react-window'

export interface IProps extends SelectProps {
  maxHeight: number,
  optionHeight: (param: Object) => number | number,
  showSearch: boolean,
  allowClear: boolean,
  labelKey: string,
  valueKey: string,
  filterOption?: (inputValue: any, option: any) => any | boolean;
  options: Array<any>,
  onChange: (v: any) => any,
}
export interface IState {
  value: any,
  open: boolean,
  searchValue: string,
  focusedOption: any
}
export default class VirtualizedSelect extends Component<IProps, IState> {
  // lock = null;

  public static defaultProps = {
    // async: false,
    maxHeight: 240,
    optionHeight: 30,
    overscanRowCount: 10,
    showSearch: false,
    allowClear: false,
    labelKey: 'label',
    valueKey: 'value',
    options: []
  };
  public static getDerivedStateFromProps(nextProps: any) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value || undefined,
      };
    }
    return null
  }
  public select: HTMLElement | any;
  constructor(props: any) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
      searchValue: '',
      focusedOption: null,
      open: false,
    }
  }
  public setRef = (select: any) => {
    this.select = select;
  };
  lockClose = (e: any) => {
    e.preventDefault()
    // clearTimeout(this.lock);
    // this.lock = setTimeout(() => {
    //   this.lock = null;
    // }, 100);
  };
  handleSearch = (v: any) => {
    this.setState({
      searchValue: v
    })
  }
  handleFocus = (focusedOption: any) => {
    this.setState({
      focusedOption
    })
  }
  handleSelect = (option: any) => {
    const { onChange, valueKey, labelKey } = this.props
    const value = {
      key: option[valueKey],
      label: option[labelKey]
    }
    if (onChange) {
      onChange(value)
    }
    this.setState({
      value: value,
      searchValue: '',
      open: false
    }, () => {
      this.select.rcSelect.setInputValue("")
      // console.log(this.select.rcSelect)
      this.select.focus()
    })

  }
  // 清空的时候触发 v为 undefined
  handleChange = (v: any) => {
    const { onChange, valueKey, labelKey } = this.props
    if (onChange) {
      onChange(v)
    }
    this.setState({
      value: v,
      searchValue: ''
    })
  }
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
    })
  }
  public render(): JSX.Element {
    // const SelectComponent = this._getSelectComponent()
    // const { }
    return (
      <Select
        {...this.props}
        value={this.state.value}
        ref={this.setRef}
        open={this.state.open}
        onSearch={(v: any) => this.handleSearch(v)}
        onChange={this.handleChange}
        onBlur={() => this.handleBlur()}
        labelInValue
        optionLabelProp={this.props.labelKey}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
        dropdownRender={this._renderMenu}
        dropdownStyle={{ overflow: 'hidden' }}
      />
    )
  }

  // See https://github.com/JedWatson/react-select/#effeciently-rendering-large-lists-with-windowing
  _renderMenu = (menu: any) => {
    const { valueKey, labelKey, filterOption } = this.props
    const { searchValue, focusedOption, value, open }: any = this.state
    const options = (filterOption && searchValue) ? this.props.options.filter((v: string) => filterOption(searchValue, v)) : this.props.options
    if (options.length === 0) {
      return (
        menu
      )
    }
    // 当处于关闭状态时，调用该render时设置不滚动到对应元素，在open时才能自动滚动过去
    // const focusedOptionIndex = open ? options.findIndex(v => v[valueKey] === (value || {}).key) : undefined
    // console.log('focusedOptionIndex', focusedOptionIndex)
    const height = this._calculateListHeight({ options })
    const innerRowRenderer = this._optionRenderer

    // react-select 1.0.0-rc2 passes duplicate `onSelect` and `selectValue` props to `menuRenderer`
    // The `Creatable` HOC only overrides `onSelect` which breaks an edge-case
    // In order to support creating items via clicking on the placeholder option,
    // We need to ensure that the specified `onSelect` handle is the one we use.
    // See issue #33

    const wrappedRowRenderer = ({ index, key, style }: any) => {
      const option = options[index]

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
        valueKey
      })
    }

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
          itemSize={({ index }: any) => this._getOptionHeight({
            option: options[index]
          })}
          width={300}
        >
          {wrappedRowRenderer}
        </List>
      </div>

    )
  }

  _calculateListHeight({ options }: any) {
    const { maxHeight } = this.props

    let height = 0

    for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
      let option = options[optionIndex]

      height += this._getOptionHeight({ option })

      if (height > maxHeight) {
        return maxHeight
      }
    }

    return height
  }

  _getOptionHeight({ option }: any) {
    const { optionHeight } = this.props

    return optionHeight instanceof Function
      ? optionHeight({ option })
      : optionHeight
  }

  _optionRenderer = ({ focusedOption, handleFocus, handleSelect, key, labelKey, option, style, valueArray, valueKey }: any) => {
    const className = classnames("ant-virtualized-select-item", option.className, {
      "VirtualizedSelectFocusedOption": option[valueKey] === focusedOption,
      "VirtualizedSelectDisabledOption": option.disabled,
      "VirtualizedSelectSelectedOption": valueArray && valueArray.some((v: any) => v.key === option[valueKey]),
    })

    const events = option.disabled
      ? {}
      : {
        onClick: () => handleSelect(option),
        // onMouseEnter: () => handleFocus(option[valueKey])
      }

    return (
      <div
        className={className}
        key={key}
        style={style}
        title={option[labelKey]}
        {...events}
      >
        {option[labelKey]}
      </div>
    )
  }


}