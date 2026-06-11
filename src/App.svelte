<script lang="ts">
  import Header from './components/Header.svelte';
  import ToolInventory from './components/ToolInventory.svelte';
  import Calendar from './components/Calendar.svelte';
  import DepositPanel from './components/DepositPanel.svelte';
  import RepairQueue from './components/RepairQueue.svelte';
  import ToolDetailModal from './components/ToolDetailModal.svelte';
  import {
    tools,
    borrowRecords,
    repairOrders,
    calendarBookings,
    currentRole,
    activeFilter,
    selectedTool,
    stats,
    startDepositRefund,
    completeDepositRefund
  } from './stores';
  import type { Tool, ToolStatus, UserRole } from './types';

  function handleRoleChange(role: UserRole) {
    $currentRole = role;
  }

  function handleFilterChange(filter: ToolStatus | 'all') {
    $activeFilter = filter;
  }

  function handleSelectTool(tool: Tool) {
    $selectedTool = tool;
  }

  function handleCloseModal() {
    $selectedTool = null;
  }

  function handleBorrow(tool: Tool) {
    tools.update(items => items.map(t => t.id === tool.id ? { ...t, status: 'borrowed' as ToolStatus, currentBorrower: '新借用人' } : t));
    $selectedTool = null;
  }

  function handleReturn(tool: Tool) {
    tools.update(items => items.map(t => t.id === tool.id ? { ...t, status: 'available' as ToolStatus, currentBorrower: undefined, expectedReturnDate: undefined } : t));
    $selectedTool = null;
  }

  function handleProgressChange(id: string, progress: number) {
    repairOrders.update(orders => orders.map(o => o.id === id ? { ...o, progress } : o));
  }

  function handleScrap(id: string) {
    repairOrders.update(orders => {
      const order = orders.find(o => o.id === id);
      if (order) {
        tools.update(items => items.map(t => t.id === order.toolId ? { ...t, status: 'scrapped' as ToolStatus } : t));
      }
      return orders;
    });
  }

  function handleComplete(id: string) {
    repairOrders.update(orders => {
      const order = orders.find(o => o.id === id);
      if (order) {
        tools.update(items => items.map(t => t.id === order.toolId ? { ...t, status: 'available' as ToolStatus } : t));
      }
      return orders.filter(o => o.id !== id);
    });
  }

  function handleStartDepositRefund(recordId: string) {
    startDepositRefund(recordId);
  }

  function handleCompleteDepositRefund(recordId: string) {
    completeDepositRefund(recordId);
    borrowRecords.update(records => {
      const record = records.find(r => r.id === recordId);
      if (record) {
        tools.update(items =>
          items.map(t =>
            t.id === record.toolId && t.status === 'borrowed'
              ? { ...t, status: 'available' as ToolStatus, currentBorrower: undefined, expectedReturnDate: undefined }
              : t
          )
        );
      }
      return records;
    });
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-forest-50/30 to-slate-50">
  <Header
    stats={$stats}
    currentRole={$currentRole}
    onRoleChange={handleRoleChange}
    activeFilter={$activeFilter}
    onFilterChange={handleFilterChange}
  />

  <main class="max-w-[1600px] mx-auto px-6 py-8">
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 space-y-6">
        <ToolInventory
          tools={$tools}
          activeFilter={$activeFilter}
          currentRole={$currentRole}
          onSelectTool={handleSelectTool}
        />
        <Calendar bookings={$calendarBookings} />
      </div>

      <div class="space-y-6">
        <DepositPanel
          records={$borrowRecords}
          currentRole={$currentRole}
          onStartRefund={handleStartDepositRefund}
          onCompleteRefund={handleCompleteDepositRefund}
        />
        <RepairQueue
          orders={$repairOrders}
          currentRole={$currentRole}
          onProgressChange={handleProgressChange}
          onScrap={handleScrap}
          onComplete={handleComplete}
        />
      </div>
    </div>
  </main>

  <footer class="border-t border-slate-200 bg-white/50 mt-12">
    <div class="max-w-[1600px] mx-auto px-6 py-6 text-center text-sm text-slate-500">
      社区共享工具服务台 · 邻里互助，物尽其用
    </div>
  </footer>

  {#if $selectedTool}
    <ToolDetailModal
      tool={$selectedTool}
      borrowRecords={$borrowRecords}
      repairOrders={$repairOrders}
      currentRole={$currentRole}
      onClose={handleCloseModal}
      onBorrow={handleBorrow}
      onReturn={handleReturn}
    />
  {/if}
</div>
