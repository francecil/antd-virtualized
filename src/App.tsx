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
  // handleChange = (v: any, type: string) => {
  //   console.log(v, type)
  // }
  readonly state: IState = initialState;
  render() {
    const { filtersSerial,options } = this.state
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <Button type="primary">Button</Button>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
        </p>
          <Select
            allowClear
            placeholder="请输入，并选择"
            className={styles.select}
            labelKey='name'
            onChange={(v: any) => console.log(v)}
            options={options}
            showSearch
            value={filtersSerial}
            valueKey='id'
          // filterOption={(input, option) => option.serialNo.indexOf(input) >= 0}
          />
          <a
            className={styles.AppLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React start
        </a>
        </header>
      </div>
    )
  }
}

export default App;
