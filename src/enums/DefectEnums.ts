export enum DefectState {
  待处理 = 0,
  待验收 = 1,
  通过 = 2,
  已拒绝 = 100,
  挂起 = 200
}

export enum DefectType {
  致命 = 0,
  严重 = 1,
  一般 = 2,
  轻微 = 3
}
