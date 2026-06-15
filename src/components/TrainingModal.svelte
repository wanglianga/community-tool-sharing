<script lang="ts">
  import { X, GraduationCap, Calendar, User, Phone, CheckCircle, Clock, AlertTriangle, Plus, CalendarDays } from 'lucide-svelte';
  import { trainingRecords, trainingRegistrations, registerTraining, scheduleTraining, completeTraining, currentRole, currentResident } from '../stores';
  import type { Tool, TrainingRecord, TrainingRegistration } from '../types';

  export let tool: Tool;
  export let onClose: () => void;

  let residentName = '';
  let residentPhone = '';
  let scheduledDate = '';
  let trainer = '';
  let notes = '';
  let showRegistrationForm = false;
  let selectedRegistration: TrainingRegistration | null = null;
  let showCompleteForm = false;

  $: residentTrainingRecords = $trainingRecords
    .filter(r => r.toolId === tool.id)
    .sort((a, b) => new Date(b.trainingDate).getTime() - new Date(a.trainingDate).getTime());

  $: residentTrainingRegistrations = $trainingRegistrations
    .filter(r => r.toolId === tool.id)
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());

  $: currentUserTraining = residentTrainingRecords
    .find(r => r.residentName === $currentResident && r.status === 'passed');

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleRegister() {
    if (!residentName || !residentPhone) return;
    registerTraining(tool.id, tool.name, residentName, residentPhone);
    residentName = '';
    residentPhone = '';
    showRegistrationForm = false;
  }

  function handleSchedule(registration: TrainingRegistration) {
    if (!scheduledDate) return;
    scheduleTraining(registration.id, scheduledDate);
    scheduledDate = '';
    selectedRegistration = null;
  }

  function handleComplete(registration: TrainingRegistration) {
    if (!trainer) return;
    completeTraining(registration.id, trainer, notes);
    trainer = '';
    notes = '';
    showCompleteForm = false;
    selectedRegistration = null;
  }

  const statusMap: Record<TrainingRecord['status'], { label: string; color: string; bgColor: string }> = {
    passed: { label: '资格有效', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
    pending: { label: '待培训', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    expired: { label: '已过期', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' }
  };

  const regStatusMap: Record<TrainingRegistration['status'], { label: string; color: string; bgColor: string }> = {
    pending: { label: '待安排', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    scheduled: { label: '已排期', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    completed: { label: '已完成', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' }
  };
</script>

<div
  on:click={handleBackdropClick}
  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
>
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <GraduationCap class="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 class="text-xl font-display font-bold text-slate-900">工具培训管理</h2>
          <p class="text-sm text-slate-500">{tool.name}</p>
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
      {#if currentUserTraining}
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle class="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 class="font-display font-semibold text-emerald-900">您已获得培训资格</h3>
                <p class="text-sm text-emerald-700 mt-1">培训日期：{currentUserTraining.trainingDate}</p>
                <p class="text-sm text-emerald-700">有效期至：{currentUserTraining.expiryDate}</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500 text-white">
              资格有效
            </span>
          </div>
        </div>
      {/if}

      {#if $currentRole !== 'resident' || !currentUserTraining}
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-display font-semibold text-slate-900 flex items-center gap-2">
              <User class="w-4 h-4 text-purple-600" />
              培训报名
            </h3>
            {#if !showRegistrationForm}
              <button
                on:click={() => showRegistrationForm = true}
                class="px-3 py-1.5 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1.5"
              >
                <Plus class="w-4 h-4" />
                新增报名
              </button>
            {/if}
          </div>

          {#if showRegistrationForm}
            <div class="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-200">
              <h4 class="font-medium text-purple-900 mb-3">填写报名信息</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">姓名</label>
                  <input
                    bind:value={residentName}
                    type="text"
                    placeholder="请输入姓名"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">联系电话</label>
                  <input
                    bind:value={residentPhone}
                    type="tel"
                    placeholder="请输入联系电话"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <button
                  on:click={() => showRegistrationForm = false}
                  class="px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  on:click={handleRegister}
                  class="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  提交报名
                </button>
              </div>
            </div>
          {/if}

          {#if residentTrainingRegistrations.length > 0}
            <div class="space-y-3">
              {#each residentTrainingRegistrations as registration (registration.id)}
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="font-medium text-slate-900">{registration.residentName}</div>
                      <div class="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                        <Phone class="w-3.5 h-3.5" />
                        {registration.residentPhone}
                      </div>
                    </div>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border {regStatusMap[registration.status].bgColor} {regStatusMap[registration.status].color}">
                      {#if registration.status === 'pending'}
                        <Clock class="w-3 h-3" />
                      {:else if registration.status === 'scheduled'}
                        <CalendarDays class="w-3 h-3" />
                      {:else}
                        <CheckCircle class="w-3 h-3" />
                      {/if}
                      {regStatusMap[registration.status].label}
                    </span>
                  </div>
                  <div class="text-sm text-slate-600 space-y-1">
                    <div class="flex items-center gap-1.5">
                      <Calendar class="w-3.5 h-3.5 text-slate-400" />
                      报名日期：{registration.registrationDate}
                    </div>
                    {#if registration.scheduledDate}
                      <div class="flex items-center gap-1.5">
                        <CalendarDays class="w-3.5 h-3.5 text-blue-500" />
                        培训日期：{registration.scheduledDate}
                      </div>
                    {/if}
                  </div>
                  {#if $currentRole === 'admin'}
                    <div class="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                      {#if registration.status === 'pending' && !selectedRegistration}
                        <button
                          on:click={() => selectedRegistration = registration}
                          class="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                        >
                          <CalendarDays class="w-3.5 h-3.5" />
                          安排培训
                        </button>
                      {/if}
                      {#if registration.status === 'scheduled' && !showCompleteForm}
                        <button
                          on:click={() => { selectedRegistration = registration; showCompleteForm = true; }}
                          class="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle class="w-3.5 h-3.5" />
                          完成培训
                        </button>
                      {/if}
                    </div>
                    {#if selectedRegistration?.id === registration.id && registration.status === 'pending'}
                      <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">选择培训日期</label>
                        <div class="flex gap-2">
                          <input
                            bind:value={scheduledDate}
                            type="date"
                            class="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                          />
                          <button
                            on:click={() => handleSchedule(registration)}
                            class="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            确认
                          </button>
                          <button
                            on:click={() => { selectedRegistration = null; scheduledDate = ''; }}
                            class="px-3 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    {/if}
                    {#if selectedRegistration?.id === registration.id && showCompleteForm}
                      <div class="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div class="space-y-3">
                          <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">培训师</label>
                            <input
                              bind:value={trainer}
                              type="text"
                              placeholder="请输入培训师姓名"
                              class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">培训备注</label>
                            <textarea
                              bind:value={notes}
                              placeholder="请输入培训考核情况备注"
                              rows="2"
                              class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
                            />
                          </div>
                          <div class="flex justify-end gap-2">
                            <button
                              on:click={() => { showCompleteForm = false; selectedRegistration = null; trainer = ''; notes = ''; }}
                              class="px-3 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                            >
                              取消
                            </button>
                            <button
                              on:click={() => handleComplete(registration)}
                              class="px-3 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                              确认通过
                            </button>
                          </div>
                        </div>
                      </div>
                    {/if}
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-slate-400 text-center py-6">暂无培训报名记录</p>
          {/if}
        </div>
      {/if}

      <div class="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 class="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle class="w-4 h-4 text-emerald-600" />
          培训记录
        </h3>
        {#if residentTrainingRecords.length > 0}
          <div class="space-y-3">
            {#each residentTrainingRecords as record (record.id)}
              <div class="p-4 rounded-xl border {statusMap[record.status].bgColor}">
                <div class="flex items-start justify-between mb-2">
                  <div class="font-medium text-slate-900">{record.residentName}</div>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border {statusMap[record.status].bgColor} {statusMap[record.status].color}">
                    {#if record.status === 'passed'}
                      <CheckCircle class="w-3 h-3" />
                    {:else if record.status === 'expired'}
                      <AlertTriangle class="w-3 h-3" />
                    {:else}
                      <Clock class="w-3 h-3" />
                    {/if}
                    {statusMap[record.status].label}
                  </span>
                </div>
                <div class="text-sm text-slate-600 space-y-1">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-slate-400" />
                    培训日期：{record.trainingDate}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <CalendarDays class="w-3.5 h-3.5 text-slate-400" />
                    有效期至：{record.expiryDate}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <User class="w-3.5 h-3.5 text-slate-400" />
                    培训师：{record.trainer}
                  </div>
                  {#if record.notes}
                    <div class="mt-2 pt-2 border-t border-slate-200 text-slate-500">
                      备注：{record.notes}
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-slate-400 text-center py-6">暂无培训记录</p>
        {/if}
      </div>
    </div>
  </div>
</div>
