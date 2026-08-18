import { User } from '../types';

export class UserModel {
  private static STORAGE_KEY = 'nestania_user';

  loadUser(): User | null {
    try {
      const saved = localStorage.getItem(UserModel.STORAGE_KEY) || 
                    localStorage.getItem('nestasia_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading user:', e);
      return null;
    }
  }

  saveUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(UserModel.STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(UserModel.STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving user:', e);
    }
  }

  updateUser(user: User): User {
    this.saveUser(user);
    return user;
  }

  logout(): void {
    this.saveUser(null);
  }
}

export const userModel = new UserModel();
