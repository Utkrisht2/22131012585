export type LogStack = "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export interface LogParams {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export async function log({ stack, level, package: pkg, message }: LogParams) {
  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    return await res.json();
  } catch (err) {
    // Optionally handle logging errors
    console.error("Logging failed", err);
  }
}