---
title: 正则表达式的基本规则
date: 2021-10-08
cover: 
---

# 正则表达式的基本规则
- . &nbsp; - &nbsp; 除换行符以外的所有字符。
- ^ &nbsp; - &nbsp; 字符串开头。
- $ &nbsp; - &nbsp; 字符串结尾。
- \d,\w,\s &nbsp; - &nbsp; 匹配数字、字符、空格。
- \D,\W,\S &nbsp; - &nbsp; 匹配非数字、非字符、非空格。
- [abc] &nbsp; - &nbsp; 匹配 a、b 或 c 中的一个字母。
- [a-z] &nbsp; - &nbsp; 匹配 a 到 z 中的一个字母。
- [^abc] &nbsp; - &nbsp; 匹配除了 a、b 或 c 中的其他字母。
- aa|bb &nbsp; - &nbsp; 匹配 aa 或 bb。
- ?  &nbsp; - &nbsp; 0 次或 1 次匹配。
- \* &nbsp; - &nbsp; 匹配 0 次或多次。
- \+ &nbsp; - &nbsp; 匹配 1 次或多次。
- {n} &nbsp; - &nbsp; 匹配 n次。
- {n,} &nbsp; - &nbsp; 匹配 n次以上。
- {m,n} &nbsp; - &nbsp; 最少 m 次，最多 n 次匹配。
- (expr) &nbsp; - &nbsp; 捕获 expr 子模式,以 \1 使用它。
- (?:expr) &nbsp; - &nbsp; 忽略捕获的子模式。
- (?=expr) &nbsp; - &nbsp; 正向预查模式 expr。
- (?!expr) &nbsp; - &nbsp; 负向预查模式 expr。