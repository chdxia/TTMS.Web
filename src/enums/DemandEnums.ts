export enum DemandPriority {
  P0 = 0,
  P1 = 1,
  P2 = 2,
  P3 = 3
}

export enum DemandState {
  待规划 = 0,
  开发中 = 1,
  测试中 = 2,
  验收通过 = 3,
  已上线 = 4,
  已拒绝 = 100,
  暂不处理 = 200
}

export enum DemandType {
  项目需求 = 0,
  项目BUG = 1,
  非项目任务 = 2
}
