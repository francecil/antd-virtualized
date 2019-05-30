import React, { useState, useEffect } from 'react';
import styles from './App.module.css'
import { Select as VirtualizedSelect} from './components/'
import './components/select/index.less'
import { Select } from 'antd'

function App() {

  const [virtualizedValue, setVirtualizedValue] = useState(undefined);
  const [commonValue, setCommonValue] = useState(undefined);
  const [options, setOptions] = useState(Array.from({ length: 2000 }).map((v, i) => ({ id: i, name: 'test' + i })))
  const arr = Array.from({ length: 200 }).map((v, i) => ({ id: i, name: 'test' + i }))
  useEffect(() => {
    console.log(666)
    return () => {
      console.log(777)
    }
  })
  return (
    <div className={styles.App} >
      <header className={styles.AppHeader}>
        <div className={styles.AppLogo}>666</div>
        <VirtualizedSelect
          allowClear
          placeholder="支持大数据的Select"
          className={styles.select}
          labelKey='name'
          onChange={(v) => setVirtualizedValue(v)}
          options={options}
          showSearch
          value={virtualizedValue}
          valueKey='id'
          filterOption={(input, option) => option.name.indexOf(input) >= 0}
        />
        <Select
          allowClear
          placeholder="原生Select"
          className={styles.select}
          onChange={(v: any) => setCommonValue(v)}
          showSearch
          value={commonValue}
          style={{ marginTop: '100px' }}
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

export default App;
