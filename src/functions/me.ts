import { APIGatewayProxyEventV2 } from "aws-lambda";

import { GetMeController } from "~/controller/GetMeController";
import { unauthorized } from "~/utils/http";
import { parseProtectedEvent } from "~/utils/parseProtectedEvent";
import { parseResponse } from "~/utils/parseResponse";

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event);
    const response = await GetMeController.handle(request);
    return parseResponse(response);
  } catch {
    return parseResponse(
      unauthorized({ error: 'Invalid Access Token.' })
    )
  }
}
