import { writable, derived } from 'svelte/store';
import type { Tool, BorrowRecord, RepairOrder, CalendarBooking, ToolStatus, UserRole, DepositStatus } from '../types';
import { tools as initialTools, borrowRecords as initialBorrowRecords, repairOrders as initialRepairOrders, calendarBookings as initialCalendarBookings } from '../data/mockData';

export const tools = writable<Tool[]>(initialTools);
export const borrowRecords = writable<BorrowRecord[]>(initialBorrowRecords);
export const repairOrders = writable<RepairOrder[]>(initialRepairOrders);
export const calendarBookings = writable<CalendarBooking[]>(initialCalendarBookings);
export const currentRole = writable<UserRole>('resident');
export const activeFilter = writable<ToolStatus | 'all'>('all');
export const selectedTool = writable<Tool | null>(null);

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
