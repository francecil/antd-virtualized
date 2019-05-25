import React from 'react';
import logo from './logo.svg';
import { Button } from 'antd';
import styles from './App.module.css'
import Select from './Select'
const initialState = {
  filtersSerial: undefined,
  options: Array.from({ length: 2000 }).map((v, i) => ({ id: i, name: 'test' + i }))
};
type IState = Readonly<typeof initialState>;
class App extends React.Component<{}, IState> {
  private handleChange = (v: any) => {
    console.log(v)
    this.setState({
      filtersSerial:v
    })
  }
  readonly state: IState = initialState;
  render() {
    const { filtersSerial, options } = this.state
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <Select
            allowClear
            placeholder="请输入，并选择"
            className={styles.select}
            labelKey='name'
            onChange={(v: any) => this.handleChange(v)}
            options={options}
            showSearch
            value={filtersSerial}
            valueKey='id'
            filterOption={(input, option) => option.name.indexOf(input) >= 0}
          />
        </header>
      </div>
    )
  }
}

export default App;
