import toml from 'toml';

export class DataService {
  async fetchJson<T>(path: string): Promise<T> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
      }
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      throw error;
    }
  }

  async fetchToml<T>(path: string): Promise<T> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
      }
      
      const text = await response.text();
      console.log(`TOML content preview: ${path}`, text.substring(0, 200) + '...');
      
      try {
        const parsedData = toml.parse(text) as unknown as T;
        return parsedData;
      } catch (parseError) {
        console.error('TOML parse error details:', parseError);
        throw parseError;
      }
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      throw error;
    }
  }
}

export const dataService = new DataService();
