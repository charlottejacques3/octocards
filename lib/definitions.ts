export const URL_BASE = 'http://localhost:3000/'

export enum AuthEnum {
  SIGNUP = 'Sign Up',
  LOGIN = 'Log In'
}

export enum FormTypeEnum {
  CREATE = 'Create',
  EDIT = 'Edit'
}

export type Folder = {
  id: number,
  name: string
}