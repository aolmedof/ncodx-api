import {
  SSMClient,
  GetParameterCommand,
  GetParameterCommandInput,
} from '@aws-sdk/client-ssm';

const DEMO_MODE = process.env.DEMO_MODE === 'true' || process.env.NODE_ENV !== 'production';

const DEMO_DEFAULTS: Record<string, string> = {
  '/ncodx/prod/jwt_secret': 'ncodx-demo-jwt-secret-2024-secure',
  '/ncodx/prod/encryption_key': 'ncodx-demo-encryption-key-32ch!',
};

const ssmClient = new SSMClient({ region: process.env.AWS_REGION ?? 'eu-west-3' });
const cache = new Map<string, string>();

export async function getParam(name: string, envFallback: string): Promise<string> {
  const envValue = process.env[envFallback];
  if (envValue) return envValue;

  if (DEMO_MODE) {
    const demo = DEMO_DEFAULTS[name];
    if (demo) return demo;
  }

  if (cache.has(name)) return cache.get(name)!;

  const input: GetParameterCommandInput = { Name: name, WithDecryption: true };
  const resp = await ssmClient.send(new GetParameterCommand(input));
  const value = resp.Parameter?.Value;
  if (!value) throw new Error(`SSM parameter ${name} not found`);
  cache.set(name, value);
  return value;
}
