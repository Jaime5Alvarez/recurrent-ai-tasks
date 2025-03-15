import { Schedule, TaskSchedulerRepository, TaskSchedulerUseCase } from "../domain/interfaces";
import { FactoryAwsEventBridgeScheduler } from "../infraestructure.ts/aws-event-bridge-scheduler";

class ScheduleTasksUseCases implements TaskSchedulerUseCase {
  constructor(private readonly taskSchedulerRepository: TaskSchedulerRepository) {}

  async createSchedule(schedule: Schedule): Promise<void> {
    await this.taskSchedulerRepository.createSchedule(schedule);
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await this.taskSchedulerRepository.deleteSchedule(scheduleId);
  }

  async updateSchedule(schedule: Schedule): Promise<void> {
    await this.taskSchedulerRepository.updateSchedule(schedule);
  }
}

export function FactoryScheduleTasksUseCases(): TaskSchedulerUseCase {
  const taskSchedulerRepository = FactoryAwsEventBridgeScheduler();
  return new ScheduleTasksUseCases(taskSchedulerRepository);
}
