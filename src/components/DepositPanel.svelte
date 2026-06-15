<script lang="ts">
  import { Wallet, Clock, CheckCircle, User, Phone, RefreshCw, ArrowRight, Package, AlertTriangle, XCircle } from 'lucide-svelte';
  import type { BorrowRecord, DepositStatus, UserRole, Tool, CheckItemStatus } from '../types';
  import { calculateRefundAmount } from '../stores';

  export let records: BorrowRecord[];
  export let tools: Tool[];
  export let currentRole: UserRole;
  export let onStartRefund: (recordId: string) => void;
  export let onCompleteRefund: (recordId: string) => void;
  export let onStartReturnCheck: (recordId: string) => void;

  const checkStatusMap: Record<CheckItemStatus, { label: string; color: string }> = {
    good: { label: '完好', color: 'text-emerald-600' },
    damaged: { label: '损坏', color: 'text-amber-600' },
    missing: { label: '缺失', color: 'text-red-600' }
  };

  function getTool(toolId: string): Tool | undefined {
    return tools.find(t => t.id === toolId);
  }

  function getRefundDisplay(record: BorrowRecord) {
    if (!record.returnChecklist) return null;
    const refund = calculateRefundAmount(
      record.depositAmount,
      record.returnChecklist.missingItems,
      record.returnChecklist.hasDamage
    );
    const deduction = record.depositAmount - refund;
    return { refund, deduction };
  }

  const statusMap: Record<DepositStatus, { label: string; color: string; bgColor: string; progressColor: string; progressWidth: string }> = {
    held: { label: '保管中', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', progressColor: 'bg-amber-500', progressWidth: 'w-1/3' },
    refunding: { label: '退还中', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', progressColor: 'bg-blue-500', progressWidth: 'w-2/3' },
    refunded: { label: '已退还', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', progressColor: 'bg-emerald-500', progressWidth: 'w-full' }
  };

  $: totalHeld = records.filter(r => r.depositStatus === 'held').reduce((sum, r) => sum + r.depositAmount, 0);
  $: totalRefunding = records.filter(r => r.depositStatus === 'refunding').reduce((sum, r) => sum + r.depositAmount, 0);
  $: totalRefunded = records.filter(r => r.depositStatus === 'refunded').reduce((sum, r) => sum + r.depositAmount, 0);
</script>

<section class="bg-white rounded-2xl border border-slate-200 p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-display font-bold text-slate-900">押金状态</h2>
      <p class="text-sm text-slate-500 mt-1">追踪押金收取与退还进度</p>
    </div>
    <div class="flex items-center gap-2">
      <div class="text-right">
        <div class="text-xs text-slate-500">保管中总额</div>
        <div class="text-lg font-bold text-amber-600 font-display">¥{totalHeld}</div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-3 gap-3 mb-6">
    <div class="bg-amber-50 rounded-xl p-3 border border-amber-200">
      <div class="text-xs text-amber-600 mb-1">保管中</div>
      <div class="text-xl font-bold text-amber-700 font-display">¥{totalHeld}</div>
    </div>
    <div class="bg-blue-50 rounded-xl p-3 border border-blue-200">
      <div class="text-xs text-blue-600 mb-1">退还中</div>
      <div class="text-xl font-bold text-blue-700 font-display">¥{totalRefunding}</div>
    </div>
    <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
      <div class="text-xs text-emerald-600 mb-1">已退还</div>
      <div class="text-xl font-bold text-emerald-700 font-display">¥{totalRefunded}</div>
    </div>
  </div>

  <div class="space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin pr-2">
    {#each records as record (record.id)}
      <div class="bg-slate-50 rounded-xl p-4 hover:bg-slate-100/80 transition-colors border border-slate-200">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="font-semibold text-slate-900">{record.toolName}</div>
            <div class="text-sm text-slate-500 mt-0.5">
              借用：{record.borrowDate} → {record.expectedReturnDate}
            </div>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border {statusMap[record.depositStatus].bgColor} {statusMap[record.depositStatus].color}">
            {#if record.depositStatus === 'refunded'}
              <CheckCircle class="w-3 h-3" />
            {:else if record.depositStatus === 'refunding'}
              <RefreshCw class="w-3 h-3" />
            {:else}
              <Clock class="w-3 h-3" />
            {/if}
            {statusMap[record.depositStatus].label}
          </span>
        </div>

        <div class="flex items-center gap-4 mb-3 text-sm">
          <div class="flex items-center gap-1.5 text-slate-600">
            <User class="w-4 h-4 text-slate-400" />
            {record.borrowerName}
          </div>
          <div class="flex items-center gap-1.5 text-slate-600">
            <Phone class="w-4 h-4 text-slate-400" />
            {record.borrowerPhone}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                class="h-full {statusMap[record.depositStatus].progressColor} {statusMap[record.depositStatus].progressWidth} rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <Wallet class="w-4 h-4 text-amber-600" />
            <span class="font-bold text-amber-600 font-display">¥{record.depositAmount}</span>
            {#if record.returnChecklist && getRefundDisplay(record)?.deduction !== 0}
              <span class="text-red-500 text-xs font-medium">-¥{getRefundDisplay(record)?.deduction}</span>
              <span class="text-emerald-600 text-xs font-medium">→¥{getRefundDisplay(record)?.refund}</span>
            {/if}
          </div>
        </div>

        {#if record.returnChecklist}
          <div class="mt-3 pt-3 border-t border-slate-200">
            <div class="flex items-center gap-1.5 text-slate-700 text-xs font-medium mb-2">
              <Package class="w-3.5 h-3.5 text-orange-500" />
              归还检查结果
            </div>
            <div class="grid grid-cols-2 gap-1 text-xs text-slate-600">
              <div class="flex items-center gap-1">
                <span>外观：</span>
                <span class={checkStatusMap[record.returnChecklist.appearance].color}>{checkStatusMap[record.returnChecklist.appearance].label}</span>
              </div>
              {#if getTool(record.toolId)?.hasBattery}
                <div class="flex items-center gap-1">
                  <span>电池：</span>
                  <span class={checkStatusMap[record.returnChecklist.battery].color}>{checkStatusMap[record.returnChecklist.battery].label}</span>
                </div>
              {/if}
              {#if getTool(record.toolId)?.hasManual}
                <div class="flex items-center gap-1">
                  <span>说明书：</span>
                  <span class={checkStatusMap[record.returnChecklist.manual].color}>{checkStatusMap[record.returnChecklist.manual].label}</span>
                </div>
              {/if}
              <div class="flex items-center gap-1">
                <span>清洁：</span>
                <span class={checkStatusMap[record.returnChecklist.cleanliness].color}>{checkStatusMap[record.returnChecklist.cleanliness].label}</span>
              </div>
            </div>
            {#if record.returnChecklist.missingItems.length > 0}
              <div class="mt-1.5 text-xs text-red-600">
                <span class="font-medium">缺失：</span>{record.returnChecklist.missingItems.join('、')}
              </div>
            {/if}
            {#if record.returnChecklist.hasDamage && record.returnChecklist.damageDescription}
              <div class="mt-1.5 text-xs text-amber-600">
                <span class="font-medium">损坏：</span>{record.returnChecklist.damageDescription}
              </div>
            {/if}
          </div>
        {/if}

        {#if currentRole === 'admin' && record.depositStatus === 'held' && !record.returnChecklist}
          <div class="mt-3 pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              on:click={() => onStartReturnCheck(record.id)}
              class="px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1.5"
            >
              <Package class="w-3.5 h-3.5" />
              归还检查
            </button>
            <button
              on:click={() => onStartRefund(record.id)}
              class="px-3 py-1.5 text-xs font-medium bg-forest-500 text-white rounded-lg hover:bg-forest-600 transition-colors flex items-center gap-1.5"
            >
              <ArrowRight class="w-3.5 h-3.5" />
              登记退还
            </button>
          </div>
        {/if}

        {#if currentRole === 'admin' && record.depositStatus === 'held' && record.returnChecklist}
          <div class="mt-3 pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              on:click={() => onStartRefund(record.id)}
              class="px-3 py-1.5 text-xs font-medium bg-forest-500 text-white rounded-lg hover:bg-forest-600 transition-colors flex items-center gap-1.5"
            >
              <ArrowRight class="w-3.5 h-3.5" />
              登记退还
            </button>
          </div>
        {/if}

        {#if currentRole === 'admin' && record.depositStatus === 'refunding'}
          <div class="mt-3 pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              on:click={() => onCompleteRefund(record.id)}
              class="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle class="w-3.5 h-3.5" />
              确认已退还
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>
