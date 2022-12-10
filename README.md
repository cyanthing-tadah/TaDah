# TaDah H5 应用

> TaDah 是一个拟声词，意为对某事表示惊喜。这个项目的立意也是为了能在一些生活的细节处能产生给人惊喜的便利快捷感。

![cover](https://headimage-1259237065.cos.ap-hongkong.myqcloud.com/WechatIMG224.png)

TaDah 本身建立在微信公众号上，我们开发的服务对接至微信公众号，根据用户对微信公众号发送的消息（指令）来进行具体的操作服务。例如天气查询、物流查询、日常记账、备忘录提醒、纪念日记录、饮食记录等等，都可以使用发送消息的形式进行。

如上列举的功能，常常分散在各个具体的 APP 里，具有一个统一的问题，即就是操作对于使用者来说比较麻烦，不够直接。例如：

- 课表查询场景：仅仅需要知道某一天什么课程安排，如果在 APP 中则需要打开 APP ，聚焦到具体的日期对着表格信息查看。而我们在 TaDah 中预想的场景则是，给微信公众号发送消息：今日课表（or 某日课表），立即返回目标日期几点到几点什么课程在什么教室。
- 记账场景：通常记账 APP 流程：打开 APP ，选择类目，输入花费和具体内容，选择保存。可以看出操作流出较为繁琐，对于记账这样需要持之以恒的事情容易因为犯懒造成漏记。而我们在 TaDah 中预想的场景则依然是给微信公众号发送消息：星巴克花费50元 咖啡。一条账目则被以：类目：咖啡、消费内容：星巴克、消费金额：50元，被计入帐中。随发随记，无需打开额外的应用，仅在微信里进行。这种快捷的行动，不容易因为繁琐而造成犯懒导致不能持久进行。

如下图所示

<img src="https://headimage-1259237065.cos.ap-hongkong.myqcloud.com/img.png" alt="demo show" width="430">

虽然上面所举例子都可以脱离 UI 进行，但好的 UI 与图形交互也可以带来高效的信息传递和效率提升。因此，TaDah 本身也支持使用 UI 操作。我会开发诸多与功能完全匹配的简约高效的 UI 界面，并且 UI 界面应该支持更丰富的操作和数据展示，方便用户进行更完整的操作（修改账单数据，调整定制课表，修改备忘录时间等），方便用户查看自己的数据（例如记账数据，完整课表，备忘录历史等等）。

服务承担两个客户端，一是微信公众号客户端，处理用户通过微信发送来的 message，解析并由对应模块应用处理。二是 H5 应用客户端，通过 API 调用来对接服务。二者数据互通，交互逻辑上互补

以上就是 TaDah 项目的基本描述，往后 TaDah 会按下图的结构进行一个模块一个模块的拓展：

![流程](https://headimage-1259237065.cos.ap-hongkong.myqcloud.com/TaDah%E6%B5%81%E7%A8%8B.jpg)

## 已实现功能

- [x] 指令-记账
- [x] 指令-查询账单情况
- [x] 应用-天气查询
- [x] 应用-物流查询
- [x] 应用-账户系统

## Todo List

- [ ] 应用-记账
- [ ] 应用-查询账单情况
- [ ] 应用-增删改查每一笔记账
- [ ] 指令-天气查询
- [ ] 指令-物流查询

## 相关链接

[TaDah H5 应用](https://github.com/AqingCyan/TaDah.Application)

## 鸣谢

陈宇思女士提供的封面设计


