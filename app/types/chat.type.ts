import { Document } from "./document.type";

export type ResponseData = {
  id: string;
  question: string;
  answer: string;
  sources: string[];
  document_id: string;
  file_id: string;
};

export type ChatsData = {
  question: string;
  answer: string;
  sources: string[];
  id: string;
  created_at: string;
  document_id: string;
  document: Document;
  file_id: string;
};
