<script lang="ts">
  import { ChevronLeft, ChevronRight, ArrowDownToLine, ArrowUpFromLine } from 'lucide-svelte';
  import type { CalendarBooking } from '../types';

  export let bookings: CalendarBooking[];

  let currentYear = 2026;
  let currentMonth = 5;

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  function prevMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  }

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function formatDate(year: number, month: number, day: number) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  function getBookingsForDate(dateStr: string) {
    return bookings.filter(b => b.date === dateStr);
  }

  $: daysInMonth = getDaysInMonth(currentYear, currentMonth);
  $: firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  $: today = formatDate(2026, 5, 11);
</script>

<section class="bg-white rounded-2xl border border-slate-200 p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-display font-bold text-slate-900">预约日历</h2>
      <p class="text-sm text-slate-500 mt-1">查看工具借用与归还时间</p>
    </div>
    <div class="flex items-center gap-2">
      <button
        on:click={prevMonth}
        class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <span class="font-display font-semibold text-slate-800 px-4 min-w-[140px] text-center">
        {currentYear} 年 {monthNames[currentMonth]}
      </span>
      <button
        on:click={nextMonth}
        class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </div>

  <div class="flex items-center gap-4 mb-4 text-xs text-slate-600">
    <div class="flex items-center gap-1.5">
      <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
      <span>借出</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
      <span>归还</span>
    </div>
  </div>

  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each weekDays as day}
      <div class="text-center text-sm font-medium text-slate-500 py-2">
        {day}
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-7 gap-1">
    {#each Array(firstDay) as _, i}
      <div class="aspect-square min-h-[80px]"></div>
    {/each}
    {#each Array(daysInMonth) as _, i}
      {@const day = i + 1}
      {@const dateStr = formatDate(currentYear, currentMonth, day)}
      {@const dayBookings = getBookingsForDate(dateStr)}
      {@const isToday = dateStr === today}
      <div
        class="aspect-square min-h-[80px] rounded-xl border p-1.5 transition-all hover:border-forest-300 hover:bg-forest-50/30 {isToday ? 'border-forest-500 bg-forest-50/50' : 'border-slate-200 bg-white'}"
      >
        <div class="text-sm font-medium mb-1 {isToday ? 'text-forest-700' : 'text-slate-700'}">
          {day}
        </div>
        <div class="space-y-1 overflow-hidden">
          {#each dayBookings.slice(0, 2) as booking}
            <div
              class="text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium {booking.type === 'borrow' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}"
              title={`${booking.toolName} - ${booking.borrowerName}`}
            >
              {#if booking.type === 'borrow'}
                <ArrowDownToLine class="w-3 h-3 inline mr-0.5 -mt-0.5" />
              {:else}
                <ArrowUpFromLine class="w-3 h-3 inline mr-0.5 -mt-0.5" />
              {/if}
              {booking.toolName}
            </div>
          {/each}
          {#if dayBookings.length > 2}
            <div class="text-[10px] text-slate-500 px-1.5">
              +{dayBookings.length - 2} 更多
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
