const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    icon: 'question',
    children: [
      {
        icon: 'question',
        title: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
        children: Array.from(
          Array.from({ length: 50 }).map((v, i) => ({
            icon: 'info-circle',
            title: 'Child Node' + i,
            value: '0-0-2-' + i,
            key: '0-0-2-' + i,
          })),
        ),
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node1',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node2',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];
export default treeData;
