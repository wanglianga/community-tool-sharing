<script lang="ts">
  import { Wrench, Users, ChevronDown } from 'lucide-svelte';
  import type { ToolStatus, UserRole } from '../types';

  export let stats: { available: number; borrowed: number; pending: number; repairing: number; scrapped: number };
  export let currentRole: UserRole;
  export let onRoleChange: (role: UserRole) => void;
  export let activeFilter: ToolStatus | 'all';
  export let onFilterChange: (filter: ToolStatus | 'all') => void;

  const statusConfig: { key: ToolStatus | 'all'; label: string; color: string; bgColor: string; borderColor: string }[] = [
    { key: 'all', label: '全部', color: 'text-slate-700', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
    { key: 'available', label: '可借', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-status-available' },
    { key: 'borrowed', label: '已借', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-status-borrowed' },
    { key: 'pending', label: '待检', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-status-pending' },
    { key: 'repairing', label: '维修中', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-status-repairing' },
    { key: 'scrapped', label: '报废', color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-status-scrapped' }
  ];

  const roles: { key: UserRole; label: string }[] = [
    { key: 'resident', label: '居民视角' },
    { key: 'admin', label: '服务站管理员' },
    { key: 'repairer', label: '维修志愿者' }
  ];

  let showRoleDropdown = false;

  function toggleRoleDropdown() {
    showRoleDropdown = !showRoleDropdown;
  }

  function selectRole(role: UserRole) {
    onRoleChange(role);
    showRoleDropdown = false;
  }
</script>

<header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
  <div class="max-w-[1600px] mx-auto px-6 py-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-forest-500 flex items-center justify-center shadow-md">
          <Wrench class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-display font-bold text-slate-900">社区共享工具服务台</h1>
          <p class="text-sm text-slate-500">邻里互助 · 物尽其用</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <button
            on:click={toggleRoleDropdown}
            class="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all text-sm font-medium text-slate-700"
          >
            <Users class="w-4 h-4" />
            {roles.find(r => r.key === currentRole)?.label}
            <ChevronDown class="w-4 h-4" />
          </button>
          {#if showRoleDropdown}
            <div class="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              {#each roles as role}
                <button
                  on:click={() => selectRole(role.key)}
                  class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors {currentRole === role.key ? 'text-forest-600 font-medium bg-forest-50' : 'text-slate-700'}"
                >
                  {role.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      {#each statusConfig as cfg}
        <button
          on:click={() => onFilterChange(cfg.key)}
          class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all {activeFilter === cfg.key
            ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.color} shadow-sm`
            : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'}"
        >
          {#if cfg.key !== 'all'}
            <span class="w-2 h-2 rounded-full {cfg.key === 'available' ? 'bg-status-available' : cfg.key === 'borrowed' ? 'bg-status-borrowed' : cfg.key === 'pending' ? 'bg-status-pending' : cfg.key === 'repairing' ? 'bg-status-repairing' : 'bg-status-scrapped'} {cfg.key === 'available' || cfg.key === 'borrowed' ? 'animate-pulseDot' : ''}"></span>
          {/if}
          {cfg.label}
          <span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-white/80 border border-slate-200">
            {cfg.key === 'all' ? stats.available + stats.borrowed + stats.pending + stats.repairing + stats.scrapped : stats[cfg.key]}
          </span>
        </button>
      {/each}
    </div>
  </div>
</header>
