export class ForbiddenError {
  message: string;
  route: string;
  status: number = 403;

  constructor(options: Omit<ForbiddenError, 'status'>) {
    Object.assign(this, options);
  }
}
