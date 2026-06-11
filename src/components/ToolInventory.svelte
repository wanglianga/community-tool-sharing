<script lang="ts">
  import ToolCard from './ToolCard.svelte';
  import type { Tool, ToolStatus, UserRole } from '../types';

  export let tools: Tool[];
  export let activeFilter: ToolStatus | 'all';
  export let currentRole: UserRole;
  export let onSelectTool: (tool: Tool) => void;

  $: filteredTools = activeFilter === 'all' ? tools : tools.filter(t => t.status === activeFilter);
</script>

<section class="bg-white rounded-2xl border border-slate-200 p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-display font-bold text-slate-900">工具库存</h2>
      <p class="text-sm text-slate-500 mt-1">共 {filteredTools.length} 件工具</p>
    </div>
  </div>

  {#if filteredTools.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
      {#each filteredTools as tool (tool.id)}
        <div class="animate-fadeIn">
          <ToolCard {tool} {currentRole} onSelect={onSelectTool} />
        </div>
      {/each}
    </div>
  {:else}
    <div class="py-16 text-center text-slate-400">
      <p>暂无符合条件的工具</p>
    </div>
  {/if}
</section>
