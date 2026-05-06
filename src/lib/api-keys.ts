const API_KEYS = new Map<string, { name: string; createdAt: Date }>();

export function addApiKey(key: string, name: string): void {
  API_KEYS.set(key, { name, createdAt: new Date() });
}

export function validateApiKey(key: string): boolean {
  return API_KEYS.has(key);
}

export function removeApiKey(key: string): boolean {
  return API_KEYS.delete(key);
}

export function listApiKeys(): { name: string; createdAt: Date }[] {
  return Array.from(API_KEYS.values());
}

const DEMO_KEYS = new Set([
  'demo_key_for_testing_12345',
  'another_demo_key_67890',
]);

export function validateDemoKey(key: string): boolean {
  return DEMO_KEYS.has(key);
}

export function isValidApiKey(key: string | null | undefined): key is string {
  if (!key) return false;
  return validateApiKey(key) || validateDemoKey(key);
}