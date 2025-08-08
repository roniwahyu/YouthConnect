export interface User {
  id: string;
  email: string;
  name: string;
  registeredAt: string;
  freeTrialEndsAt?: string;
  isSubscribed: boolean;
}

export function getStoredUser(): User | null {
  try {
    const userStr = localStorage.getItem('curhatin_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem('curhatin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('curhatin_user');
  }
}

export function isTrialActive(user: User): boolean {
  if (user.isSubscribed) return true;
  if (!user.freeTrialEndsAt) return false;
  return new Date(user.freeTrialEndsAt) > new Date();
}

export function getTrialDaysLeft(user: User): number {
  if (user.isSubscribed || !user.freeTrialEndsAt) return 0;
  const endDate = new Date(user.freeTrialEndsAt);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
