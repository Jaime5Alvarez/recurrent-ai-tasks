export interface Schedule {
  data: {
    timestamp: string;
    scheduleId: string;
    scheduleExpression: string;
  };
}

export interface TaskSchedulerUseCase {
  createSchedule(schedule: Schedule): Promise<void>;
  deleteSchedule(scheduleId: string): Promise<void>;
  updateSchedule(schedule: Schedule): Promise<void>;
}

export interface TaskSchedulerRepository {
  createSchedule(schedule: Schedule): Promise<void>;
  deleteSchedule(scheduleId: string): Promise<void>;
  updateSchedule(schedule: Schedule): Promise<void>;
}
