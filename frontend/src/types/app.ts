export type AppTheme = 'dark' | 'light';

export interface Page {
  name: string;
  to: string;
  loginRequired?: boolean;
}
