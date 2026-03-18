import { z } from 'zod'

export const URL_BASE = 'http://localhost:3000/'

export enum AuthEnum {
  SIGNUP = 'Sign Up',
  LOGIN = 'Log In'
}

export enum FormTypeEnum {
  CREATE = 'Create',
  EDIT = 'Edit'
}

export enum ObjectEnum {
  FOLDER = 'Folder',
  DECK = 'Deck',
  CARD = 'Card'
}

export const FolderSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Folder = z.infer<typeof FolderSchema>;

export const DeckSchema = z.object({
  id: z.number(),
  name: z.string(),
  folder: z.number(),
});

export type Deck = z.infer<typeof DeckSchema>;