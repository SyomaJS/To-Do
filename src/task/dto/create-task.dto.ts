export class CreateTaskDto {
  user_id: string;
  task_name: string;
  project_name: string;
  start_date: Date;
  end_date: Date;
  category: string;
  steps: number;
  status: string;
}