export type ToolStatus = 'available' | 'borrowed' | 'pending' | 'repairing' | 'scrapped';
export type DepositStatus = 'held' | 'refunding' | 'refunded';
export type RepairPriority = 'low' | 'medium' | 'high';
export type UserRole = 'resident' | 'admin' | 'repairer';

export interface Tool {
  id: string;
  name: string;
  category: string;
  specification: string;
  status: ToolStatus;
  needTraining: boolean;
  image: string;
  depositAmount: number;
  currentBorrower?: string;
  expectedReturnDate?: string;
}

export interface BorrowRecord {
  id: string;
  toolId: string;
  toolName: string;
  borrowerName: string;
  borrowerPhone: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  depositAmount: number;
  depositStatus: DepositStatus;
  returnPhoto?: string;
  hasDamage?: boolean;
}

export interface RepairOrder {
  id: string;
  toolId: string;
  toolName: string;
  damageArea: string;
  description: string;
  photo?: string;
  progress: number;
  priority: RepairPriority;
  repairer: string;
  createdAt: string;
}

export interface CalendarBooking {
  id: string;
  toolId: string;
  toolName: string;
  date: string;
  borrowerName: string;
  type: 'borrow' | 'return';
}
