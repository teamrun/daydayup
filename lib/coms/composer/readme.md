# 简单的编辑器

## 策略
- [x] 数据结构: `{id, text}`
- [x] 自动新建空行: 初始时有默认的空行, enter时自动新建下一行

## input
- [x] input随着内容的增加, 正确的向下定位
- [x] 点击line, 定位到某一行, 并且接收数据
- [x] input高度自动, 随文字内容变更
- [ ] back space到空, 编辑上一行
- [ ] 新建行, after某一行
- [ ] 点击/编辑/新建时的鼠标定位

**注意**
* ghost-input的空格和换行要实现 √


## line render
- [ ] 坑: 由index传下来的到line的props, 如果用对象传, 会因为对象引用问题, 造成: 在shouldUpdate的时候判断出错

## 如何实现cmd+z
存储每一行的edit记录, stack结构, 然后再把每一行的历史记录存起来.
cmd+z时, 先pop当前行的历史, pop干净之后...
啊 没想清楚
