import fs from 'fs';
import path from 'path';

type LoginCredentials = {
  username: string;
  password: string;
};

function loadEnvFile(filePath = path.resolve(process.cwd(), '.env')) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const envFile = fs.readFileSync(filePath, 'utf-8');

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getRequiredEnv(key: string) {
  loadEnvFile();

  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getLoginCredentials(): LoginCredentials {
  return {
    username: getRequiredEnv('ROBOT_USERNAME'),
    password: getRequiredEnv('ROBOT_PASSWORD'),
  };
}

export function getInvalidLoginCredentials(): LoginCredentials {
  return {
    username: getRequiredEnv('ROBOT_USERNAME'),
    password: getRequiredEnv('ROBOT_INVALID_PASSWORD'),
  };
}
