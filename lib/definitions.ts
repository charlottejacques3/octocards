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

export const CardSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  dueDate: z.date(),
  easinessFactor: z.number(),
  currentInterval: z.number(),
  repNumber: z.number(),
  deck: z.number(),
});

export const CardOverviewSchema = CardSchema.omit({ dueDate: true, easinessFactor: true, currentInterval: true, repNumber: true })

export type Card = z.infer<typeof CardSchema>;
export type CardOverview = z.infer<typeof CardOverviewSchema>;

export type DueCount = {
  id: number,
  name: string,
  card_count: number
}