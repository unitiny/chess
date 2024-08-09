

# 中国象棋

一款h5及小程序版的中国象棋，支持人机对战，双人对战。

下棋中允许聊天，申请悔棋，棋局重开等功能。

该仓库为中国象棋的前端仓库，使用Vue3，Uniapp，Typescript开发。

后端仓库地址：https://github.com/unitiny/chess-back


## 目录

- [上手指南](#上手指南)
  - [安装步骤](#安装步骤)
- [文件目录说明](#文件目录说明)
- [部署](#部署)

### 上手指南

###### **安装步骤**

1. 克隆项目到本地
```sh
git clone https://github.com/unitiny/chess-front.git
```

```shell
cd chess
```
2. 安装依赖
```shell
npm install
```
3. 可选择编译为h5或小程序，选择其中一种命令启动
```shell
npm run dev:h5
npm run dev:mp-weixin
```

### 文件目录说明

```
chess 
├── /dist/ #打包后的静态目录
├── /src/  #源码
│  ├── /api/ #api接口
│  ├── /class/ #聊天，象棋，游戏类
│  ├── /config/ #配置
│  ├── /pages/ #页面
│  ├── /static/ #资源文件目录
│  ├── /store/ #状态管理目录
│  ├── App.vue
│  ├── main.ts
├── package.json
├── vite.config.ts
├── Code.md #开发日志
└── README.md
```

### 项目亮点

- 优化局面重复计算的问题，提升棋局计算效率：
  - 使用Alpha-Beta算法，计算出当前层己方的最优分数，并对最大最小树进行剪枝。
  - 使用散列表算法，为局面生成唯一ID，对同样深度的重复局面能有效剪枝，提高了15%的搜索效率。
- 压缩棋子状态表示，提高编码灵活性：使用二进制代表棋子状态，通过位运算来判断、重置、转换棋子状态。
- 实现双人聊天，棋局同步功能：通过Websocket实现消息推送，配合Redis的发布/订阅，成功解决Serverless
  实例销毁而导致的内存释放问题。

### 部署

暂无

### 使用到的技术

- Vue3
- Uniapp
- Typescript


