import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { SignInController } from '../controller/SignInController';
import { parseEvent } from '../utils/parseEvent';

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);
  const {statusCode, body } = await SignInController.handle(request);
}
