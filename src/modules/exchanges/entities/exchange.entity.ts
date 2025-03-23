export class ExchangeRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
