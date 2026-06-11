<script lang="ts">
  import { Wrench, AlertTriangle, Clock, User, CheckCircle, Trash2 } from 'lucide-svelte';
  import type { RepairOrder, RepairPriority, UserRole } from '../types';

  export let orders: RepairOrder[];
  export let currentRole: UserRole;
  export let onProgressChange: (id: string, progress: number) => void;
  export let onScrap: (id: string) => void;
  export let onComplete: (id: string) => void;

  const priorityMap: Record<RepairPriority, { label: string; color: string; bgColor: string }> = {
    low: { label: '低', color: 'text-slate-700', bgColor: 'bg-slate-100 border-slate-200' },
    medium: { label: '中', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    high: { label: '高', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' }
  };

  function handleSliderChange(e: Event, id: string) {
    const target = e.target as HTMLInputElement;
    onProgressChange(id, parseInt(target.value));
  }
</script>

<section class="bg-white rounded-2xl border border-slate-200 p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-display font-bold text-slate-900">维修队列</h2>
      <p class="text-sm text-slate-500 mt-1">处理损坏工具，更新维修进度</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
        <Wrench class="w-4 h-4" />
        {orders.length} 件待处理
      </span>
    </div>
  </div>

  <div class="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin pr-2">
    {#each orders as order (order.id)}
      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors">
        <div class="flex items-start gap-4">
          <div class="w-20 h-20 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
            <Wrench class="w-8 h-8 text-slate-400" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{order.toolName}</h3>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border {priorityMap[order.priority].bgColor} {priorityMap[order.priority].color}">
                    <AlertTriangle class="w-3 h-3" />
                    {priorityMap[order.priority].label}优先级
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                  <Clock class="w-3.5 h-3.5" />
                  报修日期：{order.createdAt}
                </div>
              </div>
              {#if order.progress === 100}
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                  <CheckCircle class="w-3.5 h-3.5" />
                  待确认
                </span>
              {/if}
            </div>

            <div class="mb-3">
              <div class="text-sm text-slate-700 mb-1">
                <span class="font-medium">损坏部位：</span>
                <span class="text-red-600">{order.damageArea}</span>
              </div>
              <div class="text-sm text-slate-600">
                {order.description}
              </div>
            </div>

            <div class="flex items-center gap-3 mb-3">
              <div class="flex items-center gap-1.5 text-sm text-slate-600">
                <User class="w-4 h-4 text-slate-400" />
                维修人：<span class="font-medium">{order.repairer}</span>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">维修进度</span>
                <span class="font-semibold text-forest-600 font-display">{order.progress}%</span>
              </div>
              <div class="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-forest-400 to-forest-600 rounded-full transition-all duration-500"
                  style="width: {order.progress}%"
                ></div>
              </div>
              {#if currentRole === 'repairer'}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={order.progress}
                  on:input={(e) => handleSliderChange(e, order.id)}
                  class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-forest-500"
                />
              {/if}
            </div>

            {#if currentRole === 'repairer'}
              <div class="mt-3 pt-3 border-t border-slate-200 flex justify-end gap-2">
                {#if order.progress >= 100}
                  <button
                    on:click={() => onComplete(order.id)}
                    class="px-4 py-1.5 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    完成修复
                  </button>
                {/if}
                <button
                  on:click={() => onScrap(order.id)}
                  class="px-4 py-1.5 text-sm font-medium bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 class="w-4 h-4" />
                  标记报废
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}

    {#if orders.length === 0}
      <div class="py-12 text-center text-slate-400">
        <Wrench class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>暂无维修工单</p>
      </div>
    {/if}
  </div>
</section>
