import { APIGatewayProxyEventV2 } from "aws-lambda";

import { GetMeController } from "~/controller/GetMeController";
import { parseProtectedEvent } from "~/utils/parseProtectedEvent";
import { parseResponse } from "~/utils/parseResponse";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseProtectedEvent(event);
  const response = await GetMeController.handle(request);
  return parseResponse(response);
}
