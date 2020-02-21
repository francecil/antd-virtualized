import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, mount } from 'enzyme';
import Select from '..';

// 测试多选

describe('Select.Multiple', () => {
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

  describe('render', () => {
    function genSelect(props) {
      return (
        <Select
          className="select-test"
          options={Array.from({ length: 20 }).map((v, i) => ({ id: i, title: 'test' + i }))}
          mode="multiple"
          style={{ width: 120 }}
          showArrow
          allowClear
          showSearch
          {...props}
        ></Select>
      );
    }

    it('renders correctly', () => {
      const wrapper = render(genSelect());
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should default select the right option', () => {
    const wrapper = mount(
      <Select
        defaultValue={[2, 4]}
        mode="multiple"
        options={Array.from({ length: 20 }).map((v, i) => ({ id: i, title: 'test' + i }))}
      ></Select>,
    );
    toggleOpen(wrapper);
    expect(wrapper.find('.ant-select-selection__choice').length).toBe(2);
  });
});
