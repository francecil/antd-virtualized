const vlanList = Array.from({ length: 1000 }).map((v, i) => ({
  title: `vlan-${i}`,
  key: `vlan-${i}`,
  type: '1',
}));
const labelList = Array.from({ length: 1000 }).map((v, i) => ({
  title: `label-${i}`,
  key: `label-${i}`,
  type: '2',
}));
const netList = Array.from({ length: 1000 }).map((v, i) => ({
  title: `net-${i}`,
  key: `net-${i}`,
  type: '3',
}));
const data = [
  {
    title: '网点',
    key: 'vlan',
    children: vlanList,
  },
  {
    title: `标签`,
    key: `label`,
    children: labelList,
  },
  {
    title: `网段`,
    key: `net`,
    children: netList,
  },
];
export default data;
