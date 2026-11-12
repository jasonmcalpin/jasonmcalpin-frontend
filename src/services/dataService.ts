export class DataService {
  async fetchJson<T>(path: string, validate: (data: unknown) => T): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to fetch ${path}: HTTP ${response.status}`);
    return validate(await response.json());
  }
}

export const dataService = new DataService();
