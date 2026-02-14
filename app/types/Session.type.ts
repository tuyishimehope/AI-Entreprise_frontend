export type SessionData = {
  id: string;
  document_id: string;
  title: string;
  created_at: string;
};

export interface SessionProps {
  sessions: SessionData[];
  loading: boolean;
  error: string | undefined;
  handleDeleteSession: (e: React.MouseEvent, id: string) => Promise<void>;
}
