import {
  DeleteRuleCommand,
  RemoveTargetsCommand,
  EventBridgeClient,
  ListTargetsByRuleCommand,
  PutRuleCommand,
  PutTargetsCommand,
} from "@aws-sdk/client-eventbridge";

import { Schedule, TaskSchedulerRepository } from "../domain/interfaces";
import { API_DESTINATION_ARN, AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, ROLE_ARN } from "src/config";

class AwsEventBridgeScheduler implements TaskSchedulerRepository {
  private client: EventBridgeClient;
  private roleArn: string;
  private apiDestinationArn: string;

  constructor() {
    this.client = new EventBridgeClient({
      region: AWS_REGION!,
      logger: console,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.roleArn = ROLE_ARN!;
    this.apiDestinationArn = API_DESTINATION_ARN!;
  }

  async createSchedule(
    schedule: Schedule,
  ): Promise<void> {
    // 1. Crear la regla que se ejecuta cada minuto
    await this.client.send(
      new PutRuleCommand({
        Name: schedule.data.scheduleId,
        ScheduleExpression: "rate(1 minute)",
        State: "ENABLED",
        Description: `Regla que se ejecuta cada minuto y llama al API Destination existente`,
      })
    );

    // 2. Configurar el API Destination existente como target de la regla
    await this.client.send(
      new PutTargetsCommand({
        Rule: schedule.data.scheduleId,
        Targets: [
          {
            Id: `${schedule.data.scheduleId}-target`,
            Arn: this.apiDestinationArn,
            RoleArn: this.roleArn,
            Input: JSON.stringify(schedule.data),
          },
        ],
      })
    );

    console.log(
      `Schedule ${schedule.data.scheduleId} creada exitosamente para ejecutarse cada minuto`
    );
  }

  async deleteSchedule(id: string): Promise<void> {
    // 1. Primero obtener los targets asociados a la regla
    const listTargetsResponse = await this.client.send(
      new ListTargetsByRuleCommand({
        Rule: id,
      })
    );

    // 2. Si hay targets, eliminarlos primero
    if (listTargetsResponse.Targets && listTargetsResponse.Targets.length > 0) {
      const targetIds = listTargetsResponse.Targets.map((target) => target.Id);

      await this.client.send(
        new RemoveTargetsCommand({
          Rule: id,
          Ids: targetIds.filter((id): id is string => id !== undefined),
        })
      );

      console.log(`Targets de la regla ${id} eliminados exitosamente`);
    }

    // 3. Ahora sí podemos eliminar la regla
    await this.client.send(new DeleteRuleCommand({ Name: id }));
    console.log(`Regla ${id} eliminada exitosamente`);
  }

  async updateSchedule(schedule: Schedule): Promise<void> {
    await this.client.send(
      new PutRuleCommand({
        Name: schedule.data.scheduleId,
        ScheduleExpression: schedule.data.scheduleExpression,
      })
    );

    console.log(
      `Expresión de programación de la regla ${schedule.data.scheduleId} actualizada a: ${schedule.data.scheduleExpression}`
    );
  }
}

export function getAwsEventBridgeScheduler(): TaskSchedulerRepository {
  return new AwsEventBridgeScheduler();
}
