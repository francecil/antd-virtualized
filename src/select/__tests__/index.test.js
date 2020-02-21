import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Select from '..';
import mountTest from '../../../tests/shared/mountTest';

// 原 antd ui 相关的测试

describe('Select', () => {
  mountTest(Select);
  function toggleOpen(wrapper) {
    act(() => {
      wrapper.find('.ant-select-selection').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
  }
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have default notFoundContent', () => {
    const wrapper = mount(<Select />);
    toggleOpen(wrapper);
    expect(wrapper.find('.ant-virtualized-select-menu').length).toBeFalsy();
    expect(wrapper.find('.ant-empty').length).toBeTruthy();
  });

  it('should support set notFoundContent to null', () => {
    const wrapper = mount(<Select notFoundContent={null} />);
    toggleOpen(wrapper);
    const dropdownWrapper = mount(
      wrapper
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    // 连默认的 No Data menu-item 也不出现
    expect(dropdownWrapper.find('MenuItem').length).toBe(0);
  });

  it('should support set notFoundContent to string item', () => {
    const wrapper = mount(<Select notFoundContent="数据为空" />);
    toggleOpen(wrapper);
    expect(wrapper.find('.ant-virtualized-select-menu').length).toBeFalsy();
    expect(wrapper.find('.ant-select-dropdown-menu-item').length).toBe(1);
  });

  it('should open dropdown by defaultOpen', () => {
    const wrapper = mount(<Select defaultOpen></Select>);
    let dropdownWrapper = mount(
      wrapper
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    expect(dropdownWrapper.props().visible).toBe(true);
  });
});
