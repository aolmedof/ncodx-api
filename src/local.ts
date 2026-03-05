/**
 * Local dev server — wraps Lambda handler with a plain HTTP server.
 * Usage: npm run dev
 */
import http from 'http';
import { handler } from './handler';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

const PORT = process.env.PORT ?? 3001;

const fakeContext: Context = {
  awsRequestId: 'local-' + Date.now(),
  functionName: 'ncodx-api',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'local',
  memoryLimitInMB: '512',
  logGroupName: '/aws/lambda/ncodx-api',
  logStreamName: 'local',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
  callbackWaitsForEmptyEventLoop: false,
};

const server = http.createServer(async (req, res) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const bodyStr = Buffer.concat(chunks).toString();

  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const qs: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { qs[k] = v; });

  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string') headers[k] = v;
  }

  const event: APIGatewayProxyEventV2 = {
    version: '2.0',
    routeKey: '$default',
    rawPath: url.pathname,
    rawQueryString: url.search.slice(1),
    headers,
    queryStringParameters: Object.keys(qs).length ? qs : undefined,
    requestContext: {
      accountId: 'local',
      apiId: 'local',
      domainName: 'localhost',
      domainPrefix: 'localhost',
      requestId: fakeContext.awsRequestId,
      routeKey: '$default',
      stage: '$default',
      time: new Date().toISOString(),
      timeEpoch: Date.now(),
      http: {
        method: req.method ?? 'GET',
        path: url.pathname,
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: req.headers['user-agent'] ?? '',
      },
    },
    body: bodyStr || undefined,
    isBase64Encoded: false,
  };

  const result = await handler(event, fakeContext);
  if (typeof result === 'object' && result !== null && 'statusCode' in result) {
    res.writeHead(result.statusCode as number, result.headers as Record<string, string>);
    res.end(result.body ?? '');
  } else {
    res.writeHead(200);
    res.end(JSON.stringify(result));
  }
});

server.listen(PORT, () => {
  console.log(`ncodx-api local dev server running at http://localhost:${PORT}`);
});
