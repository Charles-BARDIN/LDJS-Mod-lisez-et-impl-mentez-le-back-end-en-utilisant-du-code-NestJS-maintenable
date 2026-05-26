import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// Normalise toutes les réponses d'erreur au format { message }, comme l'API mockée.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const extracted =
        typeof body === 'string'
          ? body
          : (body as { message?: string | string[] }).message;
      // Les erreurs de validation renvoient un tableau : on garde le premier message.
      message = Array.isArray(extracted)
        ? extracted[0]
        : (extracted ?? message);
    }

    response.status(status).json({ message });
  }
}
