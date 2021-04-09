export class SessionStorage {
  // store key/value pair
  public async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  // get value of
  public async get(key: string): Promise<string> {
    const value = localStorage.getItem(key);
    return value || '';
  }

  // delete key
  public async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}
