<template>
  <div
    class="w-full max-w-xl mx-auto rounded-3xl border backdrop-blur-2xl transition-all duration-300 relative overflow-hidden shadow-2xl"
    :class="isDark 
      ? 'bg-[#0f1222]/90 border-violet-500/20 shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] text-slate-200' 
      : 'bg-white/95 border-violet-200 shadow-[0_8px_30px_rgba(139,92,246,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)] text-slate-800'"
  >
    <!-- Top Terminal Bar -->
    <div
      class="px-5 py-3.5 border-b flex items-center justify-between gap-3 text-xs font-mono"
      :class="isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'"
    >
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
        <span class="ml-2 font-bold tracking-wider text-[11px]" :class="isDark ? 'text-violet-300' : 'text-violet-700'">
          SPEC_DOC // BRD-PRD-2026
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border text-emerald-400 border-emerald-500/30 bg-emerald-950/30 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>APPROVED PRODUCTION</span>
        </span>
      </div>
    </div>

    <!-- Sub-tab Switcher: PRD vs BPMN vs DATA -->
    <div
      class="px-5 pt-4 pb-2 flex items-center gap-2 border-b"
      :class="isDark ? 'border-white/5' : 'border-slate-100'"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 flex items-center gap-1.5 active:scale-95"
        :class="activeTab === tab.id
          ? (isDark ? 'bg-violet-600 text-white shadow-sm' : 'bg-violet-600 text-white shadow-sm')
          : (isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900')"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab 1: PRD & BDD Acceptance Criteria -->
    <div v-if="activeTab === 'prd'" class="p-5 space-y-3 font-mono text-xs">
      <div class="flex items-center justify-between">
        <span class="text-[10px] uppercase font-bold text-violet-400">User Story & BDD Gherkin Spec</span>
        <span class="text-[10px] text-slate-400">ID: US-PAY-402</span>
      </div>

      <div
        class="p-3.5 rounded-2xl border space-y-2 leading-relaxed"
        :class="isDark ? 'bg-[#090b16] border-white/5 text-slate-300' : 'bg-violet-50/70 border-violet-200 text-slate-800'"
      >
        <p class="font-semibold text-xs leading-relaxed" :class="isDark ? 'text-white' : 'text-slate-900'">
          <span class="text-violet-500 font-bold">As a</span> Corporate Buyer,<br>
          <span class="text-violet-500 font-bold">I want</span> automated 3-way invoice reconciliation,<br>
          <span class="text-violet-500 font-bold">So that</span> manual discrepancies and audit delays are eliminated.
        </p>

        <div class="pt-2 border-t text-[11px] space-y-1 font-sans" :class="isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-800'">
          <div class="font-mono font-bold text-[10px]" :class="isDark ? 'text-amber-400' : 'text-amber-700'">ACCEPTANCE CRITERIA (GHERKIN):</div>
          <p><strong class="font-mono text-violet-500">Given</strong> purchase order [PO-8812] matches received warehouse items</p>
          <p><strong class="font-mono text-violet-500">When</strong> supplier invoices match PO within &plusmn;0.05% price variance</p>
          <p><strong class="font-mono text-emerald-500">Then</strong> approve payment voucher &amp; post double-entry GL journal</p>
        </div>
      </div>

      <!-- Quick Delivery Signoff Footer -->
      <div class="flex items-center justify-between text-[11px] pt-1 text-slate-400">
        <span class="flex items-center gap-1.5 text-emerald-400">
          <span>✓</span> Signed off by Product Owner &amp; Tech Lead
        </span>
        <span class="font-semibold">Review SLA: 24h</span>
      </div>
    </div>

    <!-- Tab 2: Interactive BPMN 2.0 Process Flow -->
    <div v-else-if="activeTab === 'bpmn'" class="p-5 space-y-3 font-mono text-xs">
      <div class="flex items-center justify-between">
        <span class="text-[10px] uppercase font-bold text-violet-400">BPMN 2.0 State Machine Execution</span>
        <span class="text-[10px] text-violet-400">Step {{ activeStep + 1 }} of 4</span>
      </div>

      <!-- 4 Stage Mini Flow Grid -->
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="(st, sIdx) in bpmnSteps"
          :key="st.name"
          @click="activeStep = sIdx"
          class="p-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left"
          :class="[
            sIdx === activeStep
              ? (isDark ? 'border-violet-400 bg-violet-500/20 shadow-md' : 'border-violet-600 bg-violet-50 shadow-xs')
              : sIdx < activeStep
                ? (isDark ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' : 'border-emerald-300 bg-emerald-50/60 text-emerald-700')
                : (isDark ? 'border-white/5 bg-white/5 opacity-60' : 'border-slate-200 bg-slate-50 opacity-60')
          ]"
        >
          <div class="flex items-center justify-between text-[10px] mb-1">
            <span class="font-bold">0{{ sIdx + 1 }}. {{ st.role }}</span>
            <span v-if="sIdx < activeStep" class="text-emerald-400 font-bold">✓ DONE</span>
            <span v-else-if="sIdx === activeStep" class="text-violet-400 font-bold animate-pulse">● ACTIVE</span>
            <span v-else class="text-slate-500">PENDING</span>
          </div>
          <div class="font-bold text-xs truncate" :class="isDark ? 'text-white' : 'text-slate-900'">
            {{ st.name }}
          </div>
          <div class="text-[10px] text-slate-400 truncate mt-0.5">
            {{ st.systemAction }}
          </div>
        </div>
      </div>

      <!-- Live State Output -->
      <div
        class="p-3 rounded-xl border text-[11px] flex items-center justify-between"
        :class="isDark ? 'bg-[#080a14] border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'"
      >
        <span class="truncate">Current Event: <strong class="text-violet-400">{{ bpmnSteps[activeStep].event }}</strong></span>
        <button
          @click="advanceStep"
          class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-600 hover:bg-violet-500 text-white shrink-0 ml-2"
        >
          Simulate Next Step →
        </button>
      </div>
    </div>

    <!-- Tab 3: Data & API Contract Schema -->
    <div v-else class="p-5 space-y-3 font-mono text-xs">
      <div class="flex items-center justify-between">
        <span class="text-[10px] uppercase font-bold text-violet-400">RESTful Contract &amp; SQL Normalization</span>
        <span class="text-[10px] text-emerald-400">● 200 OK | 12ms</span>
      </div>

      <div
        class="p-3 rounded-2xl border bg-[#080914] border-white/10 text-slate-300 overflow-x-auto text-[11px] leading-relaxed"
      >
        <div class="text-violet-300 font-bold pb-1 border-b border-white/10 flex items-center justify-between">
          <span>POST /api/v1/checkout/orders</span>
          <span class="text-[10px] text-emerald-400">Idempotent [UUIDv4]</span>
        </div>
        <pre class="pt-2 text-slate-300 text-[10px] leading-tight"><code>// Strict JSON Validation &amp; 3NF Relational Mapping
{
  "orderId": "ORD-2026-9912",
  "customerId": "CUST-883",
  "currency": "VND",
  "totalAmount": 14500000,
  "lineItems": [
    { "sku": "SKU-IPHONE15", "qty": 1, "unitPrice": 14500000 }
  ],
  "dbTransaction": "SERIALIZABLE_ACID"
}</code></pre>
      </div>
    </div>

    <!-- Bottom BA Competency Scorecard Strip -->
    <div
      class="px-5 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
      :class="isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/70'"
    >
      <div class="flex items-center gap-3 text-[11px]">
        <span class="text-violet-400 font-bold">100+ Stories</span>
        <span>•</span>
        <span class="text-purple-400 font-bold">25+ BPMN Flows</span>
        <span>•</span>
        <span class="text-emerald-400 font-bold">99.4% Acceptance</span>
      </div>

      <router-link
        to="/hub"
        class="text-[11px] font-semibold text-violet-500 hover:text-violet-400 flex items-center gap-1 group"
      >
        <span>Full Workbench</span>
        <span class="group-hover:translate-x-0.5 transition-transform">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/theme'

const store = useStore()
const isDark = computed(() => store.isDark)

const activeTab = ref('prd')
const activeStep = ref(0)

const tabs = [
  { id: 'prd', label: 'PRD & Specs', icon: '📋' },
  { id: 'bpmn', label: 'BPMN 2.0 Flow', icon: '🔄' },
  { id: 'data', label: 'Data & API', icon: '🗄️' }
]

const bpmnSteps = [
  { role: 'BUYER', name: 'Submit Checkout', systemAction: 'Payload validation & auth', event: 'ORDER_SUBMITTED' },
  { role: 'SYSTEM', name: 'Reserve Inventory', systemAction: 'Row lock SKU quantity', event: 'STOCK_RESERVED' },
  { role: 'GATEWAY', name: 'Payment Capture', systemAction: 'Webhook idempotency check', event: 'PAYMENT_CONFIRMED' },
  { role: 'ACCOUNTING', name: 'ERP GL Post', systemAction: 'Double-entry journal write', event: 'ORDER_FULFILLED' }
]

const advanceStep = () => {
  activeStep.value = (activeStep.value + 1) % bpmnSteps.length
}
</script>
