import axios from 'axios';

// --- Type Definitions for Log Parameters (as per requirements) ---
type TStack = 'frontend' | 'backend';
type TLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type TFrontendPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';
type TSharedPackage = 'auth' | 'config' | 'middleware' | 'utils';
type TPackage = TFrontendPackage | TSharedPackage;

// --- API Endpoint ---
const LOGGING_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// ❗️❗️❗️ PASTE YOUR API KEY OR TOKEN HERE ❗️❗️❗️
// It's better to store this in an environment variable, but for simplicity, we'll place it here.
const API_AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN 
// Note: In a real application, you should never hardcode sensitive information like API keys.';

interface LogPayload {
  stack: TStack;
  level: TLevel;
  package: TPackage;
  message: string;
}

/**
 * Sends a log to the remote logging service.
 * This is the mandatory logging function to be used across the application.
 *
 * @param stack - The application stack ('frontend').
 * @param level - The log level.
 * @param pkg - The package/module where the log originates.
 * @param message - The log message.
 */
export const Log = async (stack: TStack, level: TLevel, pkg: TPackage, message:string): Promise<void> => {
  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    // ✅ ADDED HEADERS CONFIGURATION HERE
    const response = await axios.post(LOGGING_API_URL, payload, {
      headers: {
        // The header name might be 'Authorization', 'api-key', 'x-api-key', etc.
        // 'Authorization' with a 'Bearer' token is the most common.
        // Check your instructions for the exact header name required.
        'Authorization': `Bearer ${API_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('CRITICAL: Logging middleware failed to send log.', {
      originalPayload: payload,
      error,
    });
  }
};