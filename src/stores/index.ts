import { writable, derived } from 'svelte/store';
import type { Tool, BorrowRecord, RepairOrder, CalendarBooking, ToolStatus, UserRole, DepositStatus, TrainingRecord, TrainingRegistration, ReturnChecklist, CheckItemStatus } from '../types';
import { tools as initialTools, borrowRecords as initialBorrowRecords, repairOrders as initialRepairOrders, calendarBookings as initialCalendarBookings, trainingRecords as initialTrainingRecords, trainingRegistrations as initialTrainingRegistrations, returnChecklists as initialReturnChecklists } from '../data/mockData';

export const tools = writable<Tool[]>(initialTools);
export const borrowRecords = writable<BorrowRecord[]>(initialBorrowRecords);
export const repairOrders = writable<RepairOrder[]>(initialRepairOrders);
export const calendarBookings = writable<CalendarBooking[]>(initialCalendarBookings);
export const trainingRecords = writable<TrainingRecord[]>(initialTrainingRecords);
export const trainingRegistrations = writable<TrainingRegistration[]>(initialTrainingRegistrations);
export const returnChecklists = writable<ReturnChecklist[]>(initialReturnChecklists);
export const currentRole = writable<UserRole>('resident');
export const activeFilter = writable<ToolStatus | 'all'>('all');
export const selectedTool = writable<Tool | null>(null);
export const currentResident = writable<string>('陈大力');
export const showTrainingModal = writable<{ tool: Tool | null }>({ tool: null });
export const showReturnCheckModal = writable<{ borrowRecord: BorrowRecord | null }>({ borrowRecord: null });

export const stats = derived(tools, ($tools) => ({
  available: $tools.filter(t => t.status === 'available').length,
  borrowed: $tools.filter(t => t.status === 'borrowed').length,
  pending: $tools.filter(t => t.status === 'pending').length,
  repairing: $tools.filter(t => t.status === 'repairing').length,
  scrapped: $tools.filter(t => t.status === 'scrapped').length
}));

export const depositStats = derived(borrowRecords, ($records) => ({
  totalHeld: $records.filter(r => r.depositStatus === 'held').reduce((sum, r) => sum + r.depositAmount, 0),
  totalRefunding: $records.filter(r => r.depositStatus === 'refunding').reduce((sum, r) => sum + r.depositAmount, 0),
  totalRefunded: $records.filter(r => r.depositStatus === 'refunded').reduce((sum, r) => sum + r.depositAmount, 0),
  countHeld: $records.filter(r => r.depositStatus === 'held').length,
  countRefunding: $records.filter(r => r.depositStatus === 'refunding').length,
  countRefunded: $records.filter(r => r.depositStatus === 'refunded').length
}));

export const trainingStats = derived([trainingRecords, trainingRegistrations], ([$records, $registrations]) => ({
  totalPassed: $records.filter(r => r.status === 'passed').length,
  totalExpired: $records.filter(r => r.status === 'expired').length,
  totalPending: $registrations.filter(r => r.status === 'pending').length,
  totalScheduled: $registrations.filter(r => r.status === 'scheduled').length
}));

export function getResidentTrainingStatus(toolId: string, residentName: string) {
  return derived(trainingRecords, ($records) => {
    const latest = $records
      .filter(r => r.toolId === toolId && r.residentName === residentName)
      .sort((a, b) => new Date(b.trainingDate).getTime() - new Date(a.trainingDate).getTime())[0];
    return latest || null;
  });
}

export function hasValidTraining(toolId: string, residentName: string) {
  return derived(trainingRecords, ($records) => {
    const latest = $records
      .filter(r => r.toolId === toolId && r.residentName === residentName)
      .sort((a, b) => new Date(b.trainingDate).getTime() - new Date(a.trainingDate).getTime())[0];
    return latest ? latest.status === 'passed' : false;
  });
}

export function registerTraining(toolId: string, toolName: string, residentName: string, residentPhone: string) {
  const newRegistration: TrainingRegistration = {
    id: 'tg' + Date.now(),
    toolId,
    toolName,
    residentName,
    residentPhone,
    registrationDate: new Date().toISOString().slice(0, 10),
    status: 'pending'
  };
  trainingRegistrations.update(items => [...items, newRegistration]);
  return newRegistration;
}

export function scheduleTraining(registrationId: string, scheduledDate: string) {
  trainingRegistrations.update(items =>
    items.map(r =>
      r.id === registrationId
        ? { ...r, status: 'scheduled' as const, scheduledDate }
        : r
    )
  );
}

export function completeTraining(registrationId: string, trainer: string, notes?: string) {
  trainingRegistrations.update(items => {
    const registration = items.find(r => r.id === registrationId);
    if (registration) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const newRecord: TrainingRecord = {
        id: 'tr' + Date.now(),
        toolId: registration.toolId,
        toolName: registration.toolName,
        residentName: registration.residentName,
        residentPhone: registration.residentPhone,
        trainingDate: new Date().toISOString().slice(0, 10),
        expiryDate: expiryDate.toISOString().slice(0, 10),
        status: 'passed',
        trainer,
        notes
      };
      trainingRecords.update(records => [...records, newRecord]);
    }
    return items.filter(r => r.id !== registrationId);
  });
}

export function startDepositRefund(recordId: string) {
  borrowRecords.update(records =>
    records.map(r =>
      r.id === recordId && r.depositStatus === 'held'
        ? { ...r, depositStatus: 'refunding' as DepositStatus }
        : r
    )
  );
}

export function completeDepositRefund(recordId: string) {
  borrowRecords.update(records =>
    records.map(r =>
      r.id === recordId && r.depositStatus === 'refunding'
        ? { ...r, depositStatus: 'refunded' as DepositStatus, actualReturnDate: new Date().toISOString().slice(0, 10) }
        : r
    )
  );
}

export function createReturnChecklist(
  borrowRecordId: string,
  toolId: string,
  accessories: Record<string, CheckItemStatus>,
  appearance: CheckItemStatus,
  battery: CheckItemStatus,
  manual: CheckItemStatus,
  cleanliness: CheckItemStatus,
  missingItems: string[],
  hasDamage: boolean,
  inspector: string,
  damageDescription?: string,
  notes?: string
): ReturnChecklist {
  const checklist: ReturnChecklist = {
    id: 'rc' + Date.now(),
    borrowRecordId,
    toolId,
    accessories,
    appearance,
    battery,
    manual,
    cleanliness,
    missingItems,
    hasDamage,
    damageDescription,
    inspector,
    checkDate: new Date().toISOString().slice(0, 10),
    notes
  };
  returnChecklists.update(items => [...items, checklist]);
  borrowRecords.update(records =>
    records.map(r =>
      r.id === borrowRecordId
        ? { ...r, returnChecklist: checklist, hasDamage }
        : r
    )
  );
  return checklist;
}

export function getReturnChecklistForBorrowRecord(borrowRecordId: string) {
  return derived(returnChecklists, ($checklists) =>
    $checklists.find(c => c.borrowRecordId === borrowRecordId) || null
  );
}

export function calculateRefundAmount(baseAmount: number, missingItems: string[], hasDamage: boolean): number {
  let deduction = 0;
  if (missingItems.length > 0) {
    deduction += missingItems.length * 30;
  }
  if (hasDamage) {
    deduction += Math.floor(baseAmount * 0.3);
  }
  return Math.max(0, baseAmount - deduction);
}
