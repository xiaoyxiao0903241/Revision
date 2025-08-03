// 任务奖励数据接口
export interface CommonResponse<T> {
  code: number;
  message: string;
  data: T;
}
