import axios from 'axios';

// --- Type Definitions for Log Parameters (as per requirements) ---
type TStack = 'frontend' | 'backend';
type TLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type TFrontendPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';
type TSharedPackage = 'auth' | 'config' | 'middleware' | 'utils';
type TPackage = TFrontendPackage | TSharedPackage;

// --- API Endpoint ---
const LOGGING_API_URL = 'http://20.244.56.144/evaluation-service/logs';

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
export const Log = async (stack: TStack, level: TLevel, pkg: TPackage, message: string): Promise<void> => {
  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await axios.post(LOGGING_API_URL, payload);
    // Avoid console logging as per requirements.
    // The success of a log submission is implicitly handled.
  } catch (error) {
    // This is the one place where console logging is acceptable
    // to debug the logger itself if it fails.
    console.error('CRITICAL: Logging middleware failed to send log.', {
      originalPayload: payload,
      error,
    });
  }
};