### Context

可以发现 context 是一个 $$typeof 是 REACT_CONTEXT_TYPE react 组件

用 context 可以理解为创建一个全局组件，通过 props 专门用来传递数据

```
createContext<T>(
  defaultValue: T,
  calculateChangedBits: ?(a: T, b: T) => number,
): ReactContext<T> {

  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: (null: any),
    Consumer: (null: any),
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };

  context.Consumer = context;


  return context;
}
```

### ref

用 current 指向某个组件或 dom，可以随时读取，ref 属性会被 JSX 处理

```
createRef(): RefObject {
  const refObject = {
    current: null,
  };
  if (__DEV__) {
    Object.seal(refObject);
  }
  return refObject;
}
```
