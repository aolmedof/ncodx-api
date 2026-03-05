import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { router } from './router';
import { authenticate } from './middleware/auth';
import { handleError } from './middleware/error';
import { getCorsHeaders } from './middleware/cors';
import { AppContext } from './types';

export const handler = async (
  event: APIGatewayProxyEventV2,
  lambdaContext: Context,
): Promise<APIGatewayProxyResultV2> => {
  const startTime = Date.now();
  const requestId = lambdaContext.awsRequestId;
  const origin = event.headers?.origin ?? event.headers?.Origin;
  const corsHeaders = getCorsHeaders(origin);

  const http = event.requestContext.http;
  const method = http.method.toUpperCase();
  const rawPath = event.rawPath ?? '/';

  // CORS preflight
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const ctx: AppContext = { event, requestId, startTime };

  try {
    const matched = router.match(method, rawPath);
    if (!matched) {
      return respond(404, { error: 'Not found', statusCode: 404 }, corsHeaders);
    }

    const { route, params } = matched;

    if (route.auth) {
      ctx.userId = await authenticate(ctx);
    }

    const result = await route.handler(ctx, params);
    const duration = Date.now() - startTime;

    console.log(
      JSON.stringify({
        requestId,
        method,
        path: rawPath,
        userId: ctx.userId,
        statusCode: result.statusCode,
        duration,
      }),
    );

    return respond(result.statusCode, result.body, corsHeaders);
  } catch (err) {
    const { statusCode, body } = handleError(err);
    const duration = Date.now() - startTime;

    console.error(
      JSON.stringify({
        requestId,
        method,
        path: rawPath,
        userId: ctx.userId,
        statusCode,
        duration,
        error: body.error,
      }),
    );

    return respond(statusCode, body, corsHeaders);
  }
};

function respond(
  statusCode: number,
  body: unknown,
  headers: Record<string, string>,
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === null ? '' : JSON.stringify(body),
  };
}
