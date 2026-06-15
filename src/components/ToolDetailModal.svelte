<script lang="ts">
  import { X, Wrench, User, Calendar, ShieldAlert, GraduationCap, Clock, AlertTriangle, CheckCircle, Phone, Package, Palette, Battery, BookOpen, Sparkles } from 'lucide-svelte';
  import type { Tool, ToolStatus, BorrowRecord, RepairOrder, UserRole, CheckItemStatus } from '../types';
  import { trainingRecords, trainingRegistrations, currentResident, showTrainingModal, calculateRefundAmount } from '../stores';

  export let tool: Tool;
  export let borrowRecords: BorrowRecord[];
  export let repairOrders: RepairOrder[];
  export let currentRole: UserRole;
  export let onClose: () => void;
  export let onBorrow: (tool: Tool) => void;
  export let onReturn: (tool: Tool) => void;

  const statusMap: Record<ToolStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
    available: { label: '可借', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', dotColor: 'bg-status-available' },
    borrowed: { label: '已借', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', dotColor: 'bg-status-borrowed' },
    pending: { label: '待检', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', dotColor: 'bg-status-pending' },
    repairing: { label: '维修中', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', dotColor: 'bg-status-repairing' },
    scrapped: { label: '报废', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-200', dotColor: 'bg-status-scrapped' }
  };

  const checkStatusMap: Record<CheckItemStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
    good: { label: '完好', color: 'text-emerald-600', icon: CheckCircle },
    damaged: { label: '损坏', color: 'text-amber-600', icon: AlertTriangle },
    missing: { label: '缺失', color: 'text-red-600', icon: X }
  };

  $: status = statusMap[tool.status];
  $: toolBorrowRecords = borrowRecords.filter(r => r.toolId === tool.id);
  $: toolRepairOrders = repairOrders.filter(r => r.toolId === tool.id);

  $: currentUserTraining = $trainingRecords
    .filter(r => r.toolId === tool.id && r.residentName === $currentResident)
    .sort((a, b) => new Date(b.trainingDate).getTime() - new Date(a.trainingDate).getTime())[0];

  $: hasValidTraining = currentUserTraining?.status === 'passed';

  $: hasRegistered = $trainingRegistrations.some(
    r => r.toolId === tool.id && r.residentName === $currentResident && r.status !== 'completed'
  );

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleOpenTraining() {
    $showTrainingModal = { tool };
    onClose();
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
</script>

<div
  on:click={handleBackdropClick}
  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
>
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
          <Wrench class="w-5 h-5 text-forest-600" />
        </div>
        <div>
          <h2 class="text-xl font-display font-bold text-slate-900">{tool.name}</h2>
          <p class="text-sm text-slate-500">{tool.category}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border {status.bgColor} {status.color}">
          <span class="w-2 h-2 rounded-full {status.dotColor} animate-pulseDot"></span>
          {status.label}
        </span>
        <button
          on:click={onClose}
          class="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div class="space-y-5">
          <div class="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square">
            <img
              src={tool.image}
              alt={tool.name}
              class="w-full h-full object-cover"
            />
            {#if tool.needTraining}
              <div class="absolute top-3 left-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-lg">
                  <GraduationCap class="w-3.5 h-3.5" />
                  借用前需培训
                </span>
              </div>
            {/if}
          </div>

          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h3 class="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Wrench class="w-4 h-4 text-forest-600" />
              规格参数
            </h3>
            <p class="text-slate-700 leading-relaxed">{tool.specification}</p>
          </div>

          <div class="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <h3 class="font-display font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <ShieldAlert class="w-4 h-4" />
              押金信息
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-amber-600 font-display">¥{tool.depositAmount}</span>
              <span class="text-sm text-amber-700">（归还检查无损后退还）</span>
            </div>
          </div>
        </div>

        <div class="space-y-5">
          {#if tool.needTraining}
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-200">
              <h3 class="font-display font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <GraduationCap class="w-4 h-4" />
                培训资格
              </h3>
              {#if hasValidTraining}
                <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <div class="flex items-center gap-2 text-emerald-700 mb-1">
                    <CheckCircle class="w-4 h-4" />
                    <span class="font-medium">您已获得培训资格</span>
                  </div>
                  <div class="text-sm text-emerald-600">
                    有效期至：{currentUserTraining.expiryDate}
                  </div>
                </div>
              {:else if currentUserTraining?.status === 'expired'}
                <div class="bg-red-50 rounded-xl p-3 border border-red-200 mb-3">
                  <div class="flex items-center gap-2 text-red-700 mb-1">
                    <AlertTriangle class="w-4 h-4" />
                    <span class="font-medium">培训资格已过期</span>
                  </div>
                  <div class="text-sm text-red-600">
                    原有效期至：{currentUserTraining.expiryDate}，请重新报名培训
                  </div>
                </div>
              {:else if hasRegistered}
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-200 mb-3">
                  <div class="flex items-center gap-2 text-amber-700 mb-1">
                    <Clock class="w-4 h-4" />
                    <span class="font-medium">已报名培训，等待安排</span>
                  </div>
                  <div class="text-sm text-amber-600">
                    请耐心等待服务站安排培训时间
                  </div>
                </div>
              {:else}
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-200 mb-3">
                  <div class="flex items-center gap-2 text-amber-700 mb-1">
                    <AlertTriangle class="w-4 h-4" />
                    <span class="font-medium">借用前需完成培训</span>
                  </div>
                  <div class="text-sm text-amber-600">
                    该工具操作存在安全风险，请先完成培训并获得资格
                  </div>
                </div>
              {/if}
              <button
                on:click={handleOpenTraining}
                class="w-full mt-2 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <GraduationCap class="w-4 h-4" />
                {hasValidTraining ? '查看培训详情' : hasRegistered ? '查看报名状态' : '报名参加培训'}
              </button>
            </div>
          {/if}

          {#if tool.accessories.length > 0}
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h3 class="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Package class="w-4 h-4 text-orange-600" />
                配件清单
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each tool.accessories as acc (acc)}
                  <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200">
                    {acc}
                  </span>
                {/each}
              </div>
            </div>
          {/if}

          {#if tool.currentBorrower}
            <div class="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <h3 class="font-display font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <User class="w-4 h-4" />
                当前借用
              </h3>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-blue-800">
                  <User class="w-4 h-4 text-blue-500" />
                  <span class="font-medium">{tool.currentBorrower}</span>
                </div>
                {#if tool.expectedReturnDate}
                  <div class="flex items-center gap-2 text-blue-800">
                    <Calendar class="w-4 h-4 text-blue-500" />
                    <span>预计归还：<span class="font-medium">{tool.expectedReturnDate}</span></span>
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          {#if currentRole === 'admin' && tool.status === 'available' && (!tool.needTraining || hasValidTraining)}
            <button
              on:click={() => onBorrow(tool)}
              class="w-full py-3 bg-forest-500 hover:bg-forest-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              登记借出
            </button>
          {/if}

          {#if currentRole === 'admin' && tool.status === 'available' && tool.needTraining && !hasValidTraining}
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div class="flex items-center gap-2 text-amber-700 mb-2">
                <AlertTriangle class="w-4 h-4" />
                <span class="font-medium text-sm">无法借出</span>
              </div>
              <p class="text-xs text-amber-600">该工具需要培训资格才能借出，请先确认借用人已完成培训。</p>
            </div>
          {/if}

          {#if currentRole === 'admin' && tool.status === 'borrowed'}
            <button
              on:click={() => onReturn(tool)}
              class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              登记归还
            </button>
          {/if}

          <div class="bg-white rounded-2xl p-5 border border-slate-200">
            <h3 class="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock class="w-4 h-4 text-forest-600" />
              借用记录
            </h3>
            {#if toolBorrowRecords.length > 0}
              <div class="space-y-3">
                {#each toolBorrowRecords as record (record.id)}
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-slate-800">{record.borrowerName}</span>
                      {#if record.depositStatus === 'refunded'}
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <CheckCircle class="w-3 h-3" />
                          已完成
                        </span>
                      {:else}
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <Clock class="w-3 h-3" />
                          进行中
                        </span>
                      {/if}
                    </div>
                    <div class="text-sm text-slate-600 space-y-1">
                      <div class="flex items-center gap-1.5">
                        <Calendar class="w-3.5 h-3.5 text-slate-400" />
                        {record.borrowDate} → {record.actualReturnDate || record.expectedReturnDate}
                      </div>
                      <div class="flex items-center gap-1.5">
                        <Phone class="w-3.5 h-3.5 text-slate-400" />
                        {record.borrowerPhone}
                      </div>
                      <div class="flex items-center gap-1.5">
                        <ShieldAlert class="w-3.5 h-3.5 text-slate-400" />
                        押金 ¥{record.depositAmount}
                        {#if record.returnChecklist}
                          <span class="text-slate-400">→</span>
                          <span class={getRefundDisplay(record)?.deduction === 0 ? 'text-emerald-600' : 'text-amber-600'}>
                            实退 ¥{getRefundDisplay(record)?.refund}
                          </span>
                          {#if getRefundDisplay(record)?.deduction !== 0}
                            <span class="text-red-500 text-xs">(-¥{getRefundDisplay(record)?.deduction})</span>
                          {/if}
                        {/if}
                      </div>
                      {#if record.hasDamage}
                        <div class="flex items-center gap-1.5 text-red-600">
                          <AlertTriangle class="w-3.5 h-3.5" />
                          归还时有损坏
                        </div>
                      {/if}
                      {#if record.returnChecklist}
                        <div class="mt-2 pt-2 border-t border-slate-200">
                          <div class="flex items-center gap-1.5 text-slate-700 font-medium mb-2">
                            <Package class="w-3.5 h-3.5 text-orange-500" />
                            归还检查记录
                          </div>
                          <div class="grid grid-cols-2 gap-1 text-xs">
                            <div class="flex items-center gap-1">
                              <Palette class="w-3 h-3 text-slate-400" />
                              <span>外观：</span>
                              <span class={checkStatusMap[record.returnChecklist.appearance].color}>
                                <svelte:component this={checkStatusMap[record.returnChecklist.appearance].icon} class="w-3 h-3 inline" />
                                {checkStatusMap[record.returnChecklist.appearance].label}
                              </span>
                            </div>
                            {#if tool.hasBattery}
                              <div class="flex items-center gap-1">
                                <Battery class="w-3 h-3 text-slate-400" />
                                <span>电池：</span>
                                <span class={checkStatusMap[record.returnChecklist.battery].color}>
                                  <svelte:component this={checkStatusMap[record.returnChecklist.battery].icon} class="w-3 h-3 inline" />
                                  {checkStatusMap[record.returnChecklist.battery].label}
                                </span>
                              </div>
                            {/if}
                            {#if tool.hasManual}
                              <div class="flex items-center gap-1">
                                <BookOpen class="w-3 h-3 text-slate-400" />
                                <span>说明书：</span>
                                <span class={checkStatusMap[record.returnChecklist.manual].color}>
                                  <svelte:component this={checkStatusMap[record.returnChecklist.manual].icon} class="w-3 h-3 inline" />
                                  {checkStatusMap[record.returnChecklist.manual].label}
                                </span>
                              </div>
                            {/if}
                            <div class="flex items-center gap-1">
                              <Sparkles class="w-3 h-3 text-slate-400" />
                              <span>清洁：</span>
                              <span class={checkStatusMap[record.returnChecklist.cleanliness].color}>
                                <svelte:component this={checkStatusMap[record.returnChecklist.cleanliness].icon} class="w-3 h-3 inline" />
                                {checkStatusMap[record.returnChecklist.cleanliness].label}
                              </span>
                            </div>
                          </div>
                          {#if record.returnChecklist.missingItems.length > 0}
                            <div class="mt-1.5 text-xs text-red-600">
                              <span class="font-medium">缺失配件：</span>
                              {record.returnChecklist.missingItems.join('、')}
                            </div>
                          {/if}
                          {#if record.returnChecklist.notes}
                            <div class="mt-1.5 text-xs text-slate-500">
                              <span class="font-medium">备注：</span>{record.returnChecklist.notes}
                            </div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-sm text-slate-400 text-center py-6">暂无借用记录</p>
            {/if}
          </div>

          {#if toolRepairOrders.length > 0}
            <div class="bg-white rounded-2xl p-5 border border-slate-200">
              <h3 class="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle class="w-4 h-4 text-red-500" />
                维修记录
              </h3>
              <div class="space-y-3">
                {#each toolRepairOrders as order (order.id)}
                  <div class="p-3 rounded-xl bg-red-50 border border-red-100">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-red-800">{order.damageArea}</span>
                      <span class="text-xs text-red-600">{order.createdAt}</span>
                    </div>
                    <p class="text-sm text-red-700 mb-2">{order.description}</p>
                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-xs text-red-600">
                        <span>维修进度</span>
                        <span class="font-semibold">{order.progress}%</span>
                      </div>
                      <div class="h-1.5 bg-red-200 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-red-500 rounded-full"
                          style="width: {order.progress}%"
                        ></div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
