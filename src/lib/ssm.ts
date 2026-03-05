import {
  SSMClient,
  GetParameterCommand,
  GetParameterCommandInput,
} from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: process.env.AWS_REGION ?? 'eu-west-3' });
const cache = new Map<string, string>();

export async function getParam(name: string, envFallback: string): Promise<string> {
  const envValue = process.env[envFallback];
  if (envValue) return envValue;

  if (cache.has(name)) return cache.get(name)!;

  const input: GetParameterCommandInput = { Name: name, WithDecryption: true };
  const resp = await ssmClient.send(new GetParameterCommand(input));
  const value = resp.Parameter?.Value;
  if (!value) throw new Error(`SSM parameter ${name} not found`);
  cache.set(name, value);
  return value;
}
