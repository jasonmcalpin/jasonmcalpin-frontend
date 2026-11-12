import toml from 'toml';

export class DataService {
  async fetchJson<T>(path: string, validate: (data: unknown) => T): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to fetch ${path}: HTTP ${response.status}`);
    return validate(await response.json());
  }

  async fetchToml<T>(path: string, validate: (data: unknown) => T): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to fetch ${path}: HTTP ${response.status}`);
    try {
      return validate(toml.parse(await response.text()));
    } catch (error) {
      throw new Error(`Invalid content at ${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const dataService = new DataService();
