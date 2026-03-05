import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';

export type LambdaEvent = APIGatewayProxyEventV2;
export type LambdaContext = Context;
export type LambdaResult = APIGatewayProxyResultV2;

export interface AppContext {
  event: LambdaEvent;
  userId?: string;
  requestId: string;
  startTime: number;
}

export interface RouteHandler {
  (ctx: AppContext, params: Record<string, string>): Promise<ApiResponse>;
}

export interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
  auth: boolean;
}

export interface ApiResponse {
  statusCode: number;
  body: unknown;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
