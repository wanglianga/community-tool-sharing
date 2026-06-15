export type ToolStatus = 'available' | 'borrowed' | 'pending' | 'repairing' | 'scrapped';
export type DepositStatus = 'held' | 'refunding' | 'refunded';
export type RepairPriority = 'low' | 'medium' | 'high';
export type UserRole = 'resident' | 'admin' | 'repairer';
export type TrainingStatus = 'pending' | 'passed' | 'expired';
export type CheckItemStatus = 'good' | 'damaged' | 'missing';

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
  accessories: string[];
  hasBattery: boolean;
  hasManual: boolean;
}

export interface TrainingRecord {
  id: string;
  toolId: string;
  toolName: string;
  residentName: string;
  residentPhone: string;
  trainingDate: string;
  expiryDate: string;
  status: TrainingStatus;
  trainer: string;
  notes?: string;
}

export interface TrainingRegistration {
  id: string;
  toolId: string;
  toolName: string;
  residentName: string;
  residentPhone: string;
  registrationDate: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
}

export interface ReturnChecklist {
  id: string;
  borrowRecordId: string;
  toolId: string;
  accessories: Record<string, CheckItemStatus>;
  appearance: CheckItemStatus;
  battery: CheckItemStatus;
  manual: CheckItemStatus;
  cleanliness: CheckItemStatus;
  missingItems: string[];
  hasDamage: boolean;
  damageDescription?: string;
  inspector: string;
  checkDate: string;
  notes?: string;
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
  returnChecklist?: ReturnChecklist;
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
