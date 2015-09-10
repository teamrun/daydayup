# Immutable data for reversion/history

* 每一line都有自己的历史, 是一个stack
* 这些line的历史组合可以被保留在一个list里面
* 有一个类似array的, 负责记录line的顺序, line的stack弹出的顺序
* 弹完一个line, 去操作下一个line
* enhancement: mac的亮点功能 版本回溯
