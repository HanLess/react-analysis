```
class Store {
  @observable dataMap = {
      data1：'',
      data2: ''
  }

}
```

dataMap 为被监听对象，data1 与 data2 被修改时，会触发重新渲染，但是！如果 data1 与 data2 有联动关系，即修改 data1 会自动计算 data2，则 mobx 会报错






