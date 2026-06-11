import { writable, derived } from 'svelte/store';
import type { Tool, BorrowRecord, RepairOrder, CalendarBooking, ToolStatus, UserRole } from '../types';
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
