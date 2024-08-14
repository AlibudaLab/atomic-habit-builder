/**
 * Where is this application currently running?
 * This will be used to drive configurations for the application
 * based on the environment.
 */
export enum Environment {
  localhost = 'localhost', // Development & Testing Environment
  testnet = 'testnet', // Testnet env
  mainnet = 'mainnet', // Mainnet
}

export enum EnvironmentKeys {
  environment = 'ENVIRONMENT',
}

export function getCurrentEnvironment(): Environment {
  const stage: string | undefined = process.env[EnvironmentKeys.environment];

  if (stage === undefined) {
    return Environment.testnet;
  }

  // Convert string to ReleaseStage enum value
  const releaseStageValue = Object.values(Environment).find((value) => value === stage);

  return releaseStageValue ?? Environment.localhost;
}
