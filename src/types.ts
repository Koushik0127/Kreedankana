export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
}

export interface Booking {
  id?: string;
  userId: string;
  teamName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  sport: string;
  createdAt: any;
}

export interface Challenge {
  id?: string;
  creatorId: string;
  creatorName: string;
  creatorTeam: string;
  title: string;
  description: string;
  sport: string;
  status: 'open' | 'accepted' | 'completed';
  date: string;
  startTime: string;
  endTime: string;
  createdAt: any;
}

export interface ChallengeResponse {
  id?: string;
  userId: string;
  userName: string;
  teamName: string;
  message: string;
  createdAt: any;
}

export interface MatchResult {
  id?: string;
  sport: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  date: string;
  recordedBy: string;
  createdAt: any;
}
