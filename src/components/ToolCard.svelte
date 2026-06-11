<script lang="ts">
  import { User, Calendar, ShieldAlert, Info, GraduationCap } from 'lucide-svelte';
  import type { Tool, ToolStatus, UserRole } from '../types';

  export let tool: Tool;
  export let currentRole: UserRole;
  export let onSelect: (tool: Tool) => void;

  const statusMap: Record<ToolStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
    available: { label: '可借', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', dotColor: 'bg-status-available' },
    borrowed: { label: '已借', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', dotColor: 'bg-status-borrowed' },
    pending: { label: '待检', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', dotColor: 'bg-status-pending' },
    repairing: { label: '维修中', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', dotColor: 'bg-status-repairing' },
    scrapped: { label: '报废', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-200', dotColor: 'bg-status-scrapped' }
  };

  $: status = statusMap[tool.status];
</script>

<div
  on:click={() => onSelect(tool)}
  class="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
>
  <div class="relative h-44 bg-slate-100 overflow-hidden">
    <img
      src={tool.image}
      alt={tool.name}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div class="absolute top-3 left-3">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border {status.bgColor} {status.color}">
        <span class="w-1.5 h-1.5 rounded-full {status.dotColor}"></span>
        {status.label}
      </span>
    </div>
    {#if tool.needTraining}
      <div class="absolute top-3 right-3">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <GraduationCap class="w-3 h-3" />
          需培训
        </span>
      </div>
    {/if}
    <div class="absolute bottom-0 left-0 right-0 h-1.5 {tool.status === 'available' ? 'bg-status-available' : tool.status === 'borrowed' ? 'bg-status-borrowed' : tool.status === 'pending' ? 'bg-status-pending' : tool.status === 'repairing' ? 'bg-status-repairing' : 'bg-status-scrapped'}"></div>
  </div>

  <div class="p-4">
    <div class="flex items-start justify-between gap-2 mb-2">
      <h3 class="font-display font-semibold text-slate-900 text-lg leading-tight">{tool.name}</h3>
    </div>

    <div class="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 mb-3">
      {tool.category}
    </div>

    <p class="text-sm text-slate-500 mb-4 line-clamp-2">{tool.specification}</p>

    <div class="space-y-2 pt-3 border-t border-slate-100">
      {#if tool.currentBorrower}
        <div class="flex items-center gap-2 text-sm">
          <User class="w-4 h-4 text-slate-400" />
          <span class="text-slate-600">借用人：</span>
          <span class="font-medium text-slate-800">{tool.currentBorrower}</span>
        </div>
      {/if}
      {#if tool.expectedReturnDate}
        <div class="flex items-center gap-2 text-sm">
          <Calendar class="w-4 h-4 text-slate-400" />
          <span class="text-slate-600">预计归还：</span>
          <span class="font-medium text-slate-800">{tool.expectedReturnDate}</span>
        </div>
      {/if}
      <div class="flex items-center gap-2 text-sm">
        <ShieldAlert class="w-4 h-4 text-slate-400" />
        <span class="text-slate-600">押金：</span>
        <span class="font-semibold text-amber-600">¥{tool.depositAmount}</span>
      </div>
    </div>

    <div class="mt-4 pt-3 border-t border-slate-100">
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500">点击查看详情</span>
        <Info class="w-4 h-4 text-slate-400 group-hover:text-forest-500 transition-colors" />
      </div>
    </div>
  </div>
</div>
