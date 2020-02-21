const OLD_NODE_ENV = process.env.NODE_ENV;
process.env.NODE_ENV = 'development';
const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
const antdv = require('..');

describe('antdv', () => {
  afterAll(() => {
    process.env.NODE_ENV = OLD_NODE_ENV;
  });

  it('exports modules correctly', () => {
    console.log(antdv)
    expect(Object.keys(antdv)).toMatchSnapshot();
  });

  it('should hint when import all components in dev mode', () => {
    // 通过是否调用 console.warn(xxxx) 进行判断
    expect(warnSpy).toHaveBeenCalledWith(
      'You are using a whole package of antd virtualized, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
    );
    warnSpy.mockRestore();
  });
});