<script lang="ts">
  import { X, Package, Palette, Battery, BookOpen, Sparkles, CheckCircle, XCircle, AlertTriangle, User, Calendar, Wallet, Save } from 'lucide-svelte';
  import { createReturnChecklist, calculateRefundAmount } from '../stores';
  import type { BorrowRecord, Tool, CheckItemStatus } from '../types';

  export let borrowRecord: BorrowRecord;
  export let tool: Tool;
  export let onClose: () => void;

  let inspector = '';
  let notes = '';
  let damageDescription = '';
  let accessoriesStatus: Record<string, CheckItemStatus> = {};
  let appearance: CheckItemStatus = 'good';
  let battery: CheckItemStatus = 'good';
  let manual: CheckItemStatus = 'good';
  let cleanliness: CheckItemStatus = 'good';

  $: {
    accessoriesStatus = {};
    tool.accessories.forEach(acc => {
      accessoriesStatus[acc] = 'good';
    });
  }

  $: missingItems = Object.entries(accessoriesStatus)
    .filter(([, status]) => status === 'missing')
    .map(([name]) => name);

  $: hasDamage = appearance === 'damaged' || battery === 'damaged' || manual === 'damaged';

  $: expectedRefund = calculateRefundAmount(
    borrowRecord.depositAmount,
    missingItems,
    hasDamage
  );

  $: deduction = borrowRecord.depositAmount - expectedRefund;

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleSubmit() {
    if (!inspector) return;

    createReturnChecklist(
      borrowRecord.id,
      tool.id,
      { ...accessoriesStatus },
      appearance,
      tool.hasBattery ? battery : 'good',
      tool.hasManual ? manual : 'good',
      cleanliness,
      missingItems,
      hasDamage,
      inspector,
      hasDamage ? damageDescription : undefined,
      notes || undefined
    );

    onClose();
  }

  const statusOptions: { value: CheckItemStatus; label: string; icon: typeof CheckCircle; color: string }[] = [
    { value: 'good', label: '完好', icon: CheckCircle, color: 'text-emerald-600' },
    { value: 'damaged', label: '损坏', icon: AlertTriangle, color: 'text-amber-600' },
    { value: 'missing', label: '缺失', icon: XCircle, color: 'text-red-600' }
  ];

  const checkItems = [
    {
      key: 'appearance',
      label: '外观检查',
      icon: Palette,
      value: appearance,
      enabled: true,
      description: '检查工具外观是否有明显划痕、变形或破损'
    },
    {
      key: 'battery',
      label: '电池检查',
      icon: Battery,
      value: battery,
      enabled: tool.hasBattery,
      description: '检查电池是否完好、电量是否充足'
    },
    {
      key: 'manual',
      label: '说明书',
      icon: BookOpen,
      value: manual,
      enabled: tool.hasManual,
      description: '检查说明书是否完整归还'
    },
    {
      key: 'cleanliness',
      label: '清洁状态',
      icon: Sparkles,
      value: cleanliness,
      enabled: true,
      description: '检查工具是否清洁干净'
    }
  ];

  function setAccessoryStatus(accessory: string, status: CheckItemStatus) {
    accessoriesStatus = { ...accessoriesStatus, [accessory]: status };
  }

  function setCheckItem(key: string, status: CheckItemStatus) {
    if (key === 'appearance') appearance = status;
    else if (key === 'battery') battery = status;
    else if (key === 'manual') manual = status;
    else if (key === 'cleanliness') cleanliness = status;
  }
</script>

<div
  on:click={handleBackdropClick}
  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
>
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Package class="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 class="text-xl font-display font-bold text-slate-900">归还检查清单</h2>
          <p class="text-sm text-slate-500">{tool.name} · {borrowRecord.borrowerName}</p>
        </div>
      </div>
      <button
        on:click={onClose}
        class="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div class="text-xs text-blue-600 mb-1">押金金额</div>
          <div class="text-2xl font-bold text-blue-700 font-display">¥{borrowRecord.depositAmount}</div>
        </div>
        <div class="bg-red-50 rounded-xl p-4 border border-red-200">
          <div class="text-xs text-red-600 mb-1">预计扣除</div>
          <div class="text-2xl font-bold text-red-700 font-display">¥{deduction}</div>
        </div>
        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <div class="text-xs text-emerald-600 mb-1">预计退还</div>
          <div class="text-2xl font-bold text-emerald-700 font-display">¥{expectedRefund}</div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 class="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Package class="w-4 h-4 text-orange-600" />
          配件检查
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each tool.accessories as accessory (accessory)}
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-sm font-medium text-slate-700">{accessory}</span>
              <div class="flex gap-1">
                {#each statusOptions as option (option.value)}
                  <button
                    on:click={() => setAccessoryStatus(accessory, option.value)}
                    class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 {accessoriesStatus[accessory] === option.value
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
                  >
                    <svelte:component this={option.icon} class="w-3 h-3" />
                    {option.label}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
        {#if missingItems.length > 0}
          <div class="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
            <div class="flex items-center gap-2 text-red-700 text-sm font-medium mb-2">
              <AlertTriangle class="w-4 h-4" />
              缺失配件（共 {missingItems.length} 项，每项扣除 ¥30）
            </div>
            <div class="flex flex-wrap gap-2">
              {#each missingItems as item (item)}
                <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                  {item}
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 class="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle class="w-4 h-4 text-emerald-600" />
          整体检查
        </h3>
        <div class="space-y-4">
          {#each checkItems as item (item.key)}
            {#if item.enabled}
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <svelte:component this={item.icon} class="w-4 h-4 text-slate-500" />
                    <span class="font-medium text-slate-800">{item.label}</span>
                  </div>
                  <div class="flex gap-1">
                    {#each statusOptions as option (option.value)}
                      <button
                        on:click={() => setCheckItem(item.key, option.value)}
                        class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 {item.value === option.value
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
                      >
                        <svelte:component this={option.icon} class="w-3 h-3" />
                        {option.label}
                      </button>
                    {/each}
                  </div>
                </div>
                <p class="text-xs text-slate-500">{item.description}</p>
              </div>
            {/if}
          {/each}
        </div>
      </div>

      {#if hasDamage}
        <div class="bg-red-50 rounded-2xl p-5 border border-red-200">
          <div class="flex items-center gap-2 text-red-700 font-medium mb-3">
            <AlertTriangle class="w-5 h-5" />
            损坏说明
          </div>
          <div>
            <label class="block text-sm font-medium text-red-800 mb-1.5">请详细描述损坏情况</label>
            <textarea
              bind:value={damageDescription}
              placeholder="请详细描述工具的损坏部位、程度等情况..."
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm resize-none bg-white"
            />
          </div>
          <div class="mt-3 text-xs text-red-600 flex items-center gap-1.5">
            <Wallet class="w-3.5 h-3.5" />
            存在损坏将扣除押金的 30%（¥{Math.floor(borrowRecord.depositAmount * 0.3)}）
          </div>
        </div>
      {/if}

      <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <h3 class="font-display font-semibold text-slate-900 mb-4">检查信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">检查人</label>
            <input
              bind:value={inspector}
              type="text"
              placeholder="请输入检查人姓名"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">检查日期</label>
            <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600">
              <Calendar class="w-4 h-4" />
              <span>{new Date().toISOString().slice(0, 10)}</span>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
          <textarea
            bind:value={notes}
            placeholder="可输入其他需要说明的情况..."
            rows="2"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      <div class="bg-amber-50 rounded-2xl p-5 border border-amber-200">
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-medium text-amber-900 mb-1">检查确认</h4>
            <p class="text-sm text-amber-700">
              请确认以上检查结果真实准确。缺失配件和损坏情况将影响押金退还金额。
              预计退还金额为 <span class="font-bold">¥{expectedRefund}</span>，
              扣除金额为 <span class="font-bold">¥{deduction}</span>。
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
      <button
        on:click={onClose}
        class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
      >
        取消
      </button>
      <button
        on:click={handleSubmit}
        disabled={!inspector}
        class="px-5 py-2.5 text-sm font-medium text-white bg-forest-500 rounded-lg hover:bg-forest-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Save class="w-4 h-4" />
        确认检查结果
      </button>
    </div>
  </div>
</div>
