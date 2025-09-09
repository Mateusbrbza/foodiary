import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { SignUpController } from '../controller/SignUpController';
import { parseEvent } from '../utils/parseEvent';

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);
  await SignUpController.handle(request);
}
