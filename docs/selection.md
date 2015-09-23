## 怎么处理selection相关的: cursor, selection, input
### 设想
* cursor: moudown时定位, move时更新
* selection: down时开始, move时更新
* input up时focus


### 最终实现
* 鼠标指针: mousedown时定位, 但由于selection的创建时机没有文档说明, 立即调用是取不到rect的, 所以加了raf; mousemove时更新位置, 同样用raf优化
* selection: down时开始sync, 也是raf; move时更新, raf优化; click时同步, 如果只有click, 就会消失, 如果是移动后的click, selection是不变的
* input-focus: 在click发生时执行, 而且是在selection-sync之后
