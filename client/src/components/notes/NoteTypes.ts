export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  tags?: string[];
}

export type editorState = "open" | "closed";
