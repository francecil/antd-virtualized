import React from 'react';
import styles from './App.module.css'
import VirtualizedSelect from './Select'
import { Select } from 'antd'
const initialState = {
  filtersSerial: undefined,
  filtersSerial2: undefined,
  options: Array.from({ length: 2000 }).map((v, i) => ({ id: i, name: 'test' + i }))
};
type IState = Readonly<typeof initialState>;
class App extends React.Component<{}, IState> {
  private handleChange = (v: any) => {
    console.log(v)
    this.setState({
      filtersSerial: v
    })
  }
  readonly state: IState = initialState;
  render() {
    const { filtersSerial,filtersSerial2, options } = this.state
    const arr = Array.from({ length: 200 }).map((v, i) => ({ id: i, name: 'test' + i }))
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <VirtualizedSelect
            allowClear
            placeholder="支持大数据的Select"
            className={styles.select}
            labelKey='name'
            onChange={(v: any) => this.handleChange(v)}
            options={options}
            showSearch
            value={filtersSerial}
            valueKey='id'
            filterOption={(input, option) => option.name.indexOf(input) >= 0}
          />
          <Select
            allowClear
            placeholder="原生Select"
            className={styles.select}
            // onChange={(v: any) => this.handleChange(v)}
            showSearch
            value={filtersSerial2}
            style={{marginTop:'100px'}}
          >
            {
              arr.map((v) => (
                <Select.Option key={v.id}>{v.name}</Select.Option>
              ))
            }
          </Select>
        </header>
      </div>
    )
  }
}

export default App;
