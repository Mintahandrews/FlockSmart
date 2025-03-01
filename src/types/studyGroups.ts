export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subjectArea: string;
  createdBy: string;
  createdAt: string;
  members: string[];
  isPublic: boolean;
  tags: string[];
}

export interface StudyGroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: string;
}
