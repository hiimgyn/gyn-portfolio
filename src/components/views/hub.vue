<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md"
        :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="tracking-wider font-semibold">SYS_LAB // INTERACTIVE WORKBENCH</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
        {{ $t('hub.title') }}
      </h1>
      <p class="text-sm sm:text-base max-w-2xl mx-auto" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
        {{ $t('hub.subtitle') }}
      </p>
    </div>

    <!-- Mode Switcher Tabs -->
    <div class="flex justify-center">
      <div class="inline-flex p-1.5 rounded-2xl border backdrop-blur-xl"
        :class="isDark 
          ? 'bg-[#11131f]/90 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]' 
          : 'bg-violet-50/70 border-violet-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]'"
      >
        <button
          @click="activeTab = 'process'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2',
            activeTab === 'process'
              ? (isDark 
                  ? 'bg-violet-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(139,92,246,0.35)]' 
                  : 'bg-white text-violet-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_4px_rgba(0,0,0,0.06)]')
              : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
          ]"
        >
          <CommandLineIcon class="w-4 h-4" />
          <span>{{ $t('hub.tabProcess') }}</span>
        </button>

        <button
          @click="activeTab = 'arch'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2',
            activeTab === 'arch'
              ? (isDark 
                  ? 'bg-violet-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(139,92,246,0.35)]' 
                  : 'bg-white text-violet-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_4px_rgba(0,0,0,0.06)]')
              : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
          ]"
        >
          <CpuChipIcon class="w-4 h-4" />
          <span>{{ $t('hub.tabArch') }}</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: INTERACTIVE PROCESS FLOW & API CONTRACT WORKBENCH -->
    <div v-if="activeTab === 'process'" class="space-y-6">
      <div
        class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
      >
        <!-- Scenario Selector & Trigger Action -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b"
          :class="isDark ? 'border-white/10' : 'border-slate-200'"
        >
          <div class="space-y-1">
            <span class="text-[11px] font-mono uppercase tracking-wider font-semibold text-violet-400">
              Select Business Domain Use Case
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(scenario, sKey) in scenarios"
                :key="sKey"
                @click="selectScenario(sKey)"
                class="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all duration-200"
                :class="selectedScenarioKey === sKey
                  ? (isDark ? 'bg-violet-500/20 border-violet-400 text-violet-200 shadow-sm' : 'bg-violet-50 border-violet-600 text-violet-800 font-bold shadow-xs')
                  : (isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20' : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300')"
              >
                {{ scenario.title }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="resetScenario"
              class="px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all duration-200"
              :class="isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'"
            >
              {{ $t('hub.resetFlow') }}
            </button>
            <button
              @click="advanceStep"
              :disabled="isExecuting"
              class="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span v-if="isExecuting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <PlayIcon v-else class="w-4 h-4" />
              <span>{{ $t('hub.stepSim') }}</span>
            </button>
          </div>
        </div>

        <!-- BPMN 2.0 Process Flow Stepper -->
        <div class="py-6 border-b" :class="isDark ? 'border-white/10' : 'border-slate-200'">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-semibold" :class="isDark ? 'text-slate-300' : 'text-slate-700'">
              BPMN 2.0 State Machine Flow
            </span>
            <span class="text-xs font-mono text-violet-400">
              Current State: Step {{ currentStepIndex + 1 }} of {{ currentScenario.steps.length }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              v-for="(step, idx) in currentScenario.steps"
              :key="idx"
              @click="currentStepIndex = idx"
              class="p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative"
              :class="[
                idx === currentStepIndex
                  ? (isDark ? 'border-violet-400 bg-violet-500/15 shadow-md' : 'border-violet-600 bg-violet-50 shadow-sm')
                  : idx < currentStepIndex
                    ? (isDark ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/50')
                    : (isDark ? 'border-white/10 bg-white/5 opacity-60' : 'border-slate-200 bg-slate-50 opacity-60')
              ]"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                  :class="idx === currentStepIndex
                    ? 'bg-violet-600 text-white'
                    : idx < currentStepIndex
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : (isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-600')"
                >
                  Step 0{{ idx + 1 }}
                </span>
                <span v-if="idx < currentStepIndex" class="text-emerald-500 text-xs font-bold">✓ DONE</span>
                <span v-else-if="idx === currentStepIndex" class="text-violet-400 text-xs font-bold animate-pulse">● ACTIVE</span>
                <span v-else class="text-slate-500 text-xs font-mono">PENDING</span>
              </div>
              <h4 class="text-xs font-bold truncate" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
                {{ step.name }}
              </h4>
              <p class="text-[11px] text-slate-400 truncate mt-0.5">
                {{ step.systemAction }}
              </p>
            </div>
          </div>
        </div>

        <!-- 3-Column BA Artifact Inspector: Requirements vs Contract vs State -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          <!-- Col 1: Business Context & Gherkin AC -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span class="text-xs font-mono font-semibold" :class="isDark ? 'text-amber-300' : 'text-amber-700'">
                {{ $t('hub.businessContext') }}
              </span>
            </div>
            <div class="rounded-2xl p-4 border font-mono text-xs space-y-3"
              :class="isDark ? 'bg-[#090b14] border-white/10 text-slate-300' : 'bg-violet-50/40 border-slate-200 text-slate-700'"
            >
              <div>
                <span class="text-[10px] text-slate-400 block font-bold">STAKEHOLDER GOAL</span>
                <p class="mt-1 leading-relaxed">{{ currentStep.businessGoal }}</p>
              </div>
              <div class="border-t pt-3" :class="isDark ? 'border-white/5' : 'border-slate-200'">
                <span class="text-[10px] text-amber-400 block font-bold">ACCEPTANCE CRITERIA (BDD)</span>
                <pre class="mt-1 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300 dark:text-slate-400">{{ currentStep.gherkin }}</pre>
              </div>
            </div>
          </div>

          <!-- Col 2: Technical Contract (API & Schema) -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-violet-400"></span>
              <span class="text-xs font-mono font-semibold" :class="isDark ? 'text-violet-300' : 'text-violet-700'">
                {{ $t('hub.technicalContract') }}
              </span>
            </div>
            <div class="rounded-2xl p-4 border font-mono text-xs space-y-3 bg-[#080912] border-white/10 text-slate-300 shadow-inner">
              <div class="flex items-center justify-between pb-2 border-b border-white/10">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="currentStep.api.method === 'POST' ? 'bg-violet-500/20 text-violet-300' : 'bg-emerald-500/20 text-emerald-400'"
                >
                  {{ currentStep.api.method }}
                </span>
                <span class="text-[11px] text-slate-400 truncate max-w-[200px]">{{ currentStep.api.endpoint }}</span>
              </div>
              <div class="overflow-x-auto max-h-52">
                <pre class="text-[11px] leading-tight"><code>{{ currentStep.api.specCode }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Col 3: Execution Telemetry & Database State -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="text-xs font-mono font-semibold" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
                  {{ $t('hub.simulatedResponse') }}
                </span>
              </div>
              <span class="text-[11px] font-mono text-emerald-400">● 200 OK | {{ lastLatency }}ms</span>
            </div>
            <div class="rounded-2xl p-4 border font-mono text-xs bg-[#080912] border-white/10 text-slate-300 shadow-inner relative min-h-[160px]">
              <div v-if="isExecuting" class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs rounded-2xl">
                <span class="text-xs text-violet-300 animate-pulse font-mono">Enforcing Business Rules & State Transition...</span>
              </div>
              <div v-else class="space-y-3">
                <div class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">DATABASE & AUDIT LOG</div>
                <div class="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-emerald-300">
                  {{ currentStep.auditLog }}
                </div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider font-bold pt-1">RESPONSE PAYLOAD</div>
                <pre class="text-[11px] max-h-36 overflow-y-auto text-slate-300"><code>{{ JSON.stringify(currentStep.api.responsePayload, null, 2) }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: SYSTEM ARCHITECTURE BLUEPRINT -->
    <div v-else class="space-y-6">
      <div
        class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-sm"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
      >
        <div class="space-y-2 mb-8">
          <h2 class="text-xl font-bold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
            {{ $t('hub.archOverview') }}
          </h2>
          <p class="text-xs sm:text-sm" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
            {{ $t('hub.archDesc') }}
          </p>
        </div>

        <!-- Architecture Flow Nodes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="(node, idx) in architectureNodes"
            :key="node.id"
            @click="selectedArchNode = node"
            class="p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between"
            :class="[
              selectedArchNode.id === node.id
                ? (isDark ? 'border-violet-400 bg-violet-500/15 shadow-md' : 'border-violet-600 bg-violet-50 shadow-sm')
                : (isDark ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300')
            ]"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                  :class="isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'"
                >
                  Layer 0{{ idx + 1 }}
                </span>
                <PlatformIcon v-if="node.iconName" :name="node.iconName" size="sm" />
                <component v-else :is="node.icon" class="w-4 h-4 text-violet-400" />
              </div>
              <h3 class="text-sm font-bold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
                {{ node.name }}
              </h3>
              <p class="text-xs text-slate-400 line-clamp-2">
                {{ node.role }}
              </p>
            </div>

            <div class="pt-3 text-[11px] font-mono text-violet-400 font-semibold group-hover:underline">
              Inspect Specs →
            </div>
          </div>
        </div>

        <!-- Node Deep Dive Inspector -->
        <div class="mt-8 p-6 rounded-2xl border border-violet-500/30 bg-violet-950/20 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-violet-500/20 pb-3">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h4 class="text-base font-bold text-white">
                {{ selectedArchNode.name }} Architectural Specifications
              </h4>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-mono text-violet-300">
              <PlatformIcon v-if="selectedArchNode.iconName" :name="selectedArchNode.iconName" size="xs" />
              <span>{{ selectedArchNode.tech }}</span>
            </div>
          </div>

          <p class="text-xs sm:text-sm leading-relaxed" :class="isDark ? 'text-slate-300' : 'text-slate-700'">
            {{ selectedArchNode.details }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div class="p-3 rounded-xl bg-black/40 border border-white/5">
              <span class="text-slate-400 block text-[10px]">BA PATTERN</span>
              <span class="font-bold text-slate-200">{{ selectedArchNode.pattern }}</span>
            </div>
            <div class="p-3 rounded-xl bg-black/40 border border-white/5">
              <span class="text-slate-400 block text-[10px]">THROUGHPUT / SLA</span>
              <span class="font-bold text-emerald-400">{{ selectedArchNode.throughput }}</span>
            </div>
            <div class="p-3 rounded-xl bg-black/40 border border-white/5">
              <span class="text-slate-400 block text-[10px]">DATA INTEGRITY</span>
              <span class="font-bold text-violet-300">{{ selectedArchNode.resilience }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import {
  CommandLineIcon,
  CpuChipIcon,
  PlayIcon,
  ServerIcon,
  GlobeAltIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

const store = useStore()
const isDark = computed(() => store.isDark)

const activeTab = ref('process')
const isExecuting = ref(false)
const lastLatency = ref(12)

const selectedScenarioKey = ref('order')
const currentStepIndex = ref(0)

const scenarios = {
  order: {
    title: 'E-Commerce Order Fulfillment',
    steps: [
      {
        name: 'Cart Checkout Submission',
        systemAction: 'Validate items, customer address & pricing',
        businessGoal: 'Ensure order integrity and prevent fraudulent checkout attempts with stale price tags.',
        gherkin: `Given customer has 2 items in cart\nWhen customer clicks "Confirm & Pay"\nThen system validates current item pricing against Catalog DB\nAnd rejects order if total price differs by > 0.01%`,
        auditLog: 'EVENT: CheckoutRequested | CartId: CRT-84920 | PricingStatus: VERIFIED_ACCURATE',
        api: {
          method: 'POST',
          endpoint: '/api/v1/orders/checkout',
          specCode: `// API Contract Spec\nPOST /api/v1/orders/checkout\n{\n  "cartId": "CRT-84920",\n  "currency": "VND",\n  "totalAmount": 1250000,\n  "shippingAddressId": "ADDR-102"\n}`,
          responsePayload: {
            orderId: "ORD-99214",
            status: "CHECKOUT_VALIDATED",
            lockExpiresAt: "2026-09-25T16:15:00Z"
          }
        }
      },
      {
        name: 'Inventory Reservation',
        systemAction: 'Acquire row lock & decrement available quantity',
        businessGoal: 'Prevent overselling high-demand items during flash sales with ACID concurrency locks.',
        gherkin: `Given order ORD-99214 is validated\nWhen stock check query executes\nThen acquire pessimistic lock (UPDLOCK) on Inventory table\nAnd transition stock status to RESERVED with 15-min TTL`,
        auditLog: 'EVENT: StockReserved | Sku: SKU-IPHONE15 | ReservedQty: 1 | RemainingAvailable: 42',
        api: {
          method: 'POST',
          endpoint: '/api/v1/inventory/reserve',
          specCode: `// SQL Lock Definition\nBEGIN TRANSACTION;\nSELECT CurrentStock\nFROM Inventory WITH (UPDLOCK, ROWLOCK)\nWHERE SkuId = @SkuId;\nUPDATE Inventory SET ReservedStock = ReservedStock + 1;\nCOMMIT;`,
          responsePayload: {
            reservationId: "RES-40192",
            sku: "SKU-IPHONE15",
            reservedCount: 1,
            success: true
          }
        }
      },
      {
        name: 'Payment Authorization',
        systemAction: 'Tokenize payment & trigger webhook listener',
        businessGoal: 'Capture funds securely via payment gateway and record immutable audit ledger.',
        gherkin: `Given stock reservation RES-40192 is held\nWhen payment authorization webhook arrives\nThen verify cryptographic HMAC signature\nAnd update PaymentStatus to AUTHORIZED`,
        auditLog: 'EVENT: PaymentCaptured | TxnId: TX-88402 | Gateway: Stripe | Amount: 1,250,000 VND',
        api: {
          method: 'POST',
          endpoint: '/api/v1/payments/authorize',
          specCode: `// Webhook Contract Handler\npublic async Task<IResult> HandleWebhook(PaymentPayload payload)\n{\n    bool isValid = VerifyHmac(payload.Signature);\n    if (!isValid) return Results.Unauthorized();\n    await _orderService.ConfirmPaymentAsync(payload.OrderId);\n    return Results.Ok();\n}`,
          responsePayload: {
            transactionId: "TX-88402",
            status: "PAID",
            gatewayResponseCode: "200_SUCCESS"
          }
        }
      },
      {
        name: 'Order Confirmation & ERP Sync',
        systemAction: 'Commit order status & dispatch warehouse event',
        businessGoal: 'Notify logistics partners and trigger automated fulfillment pipeline.',
        gherkin: `Given payment is AUTHORIZED\nWhen state machine transitions to CONFIRMED\nThen publish OrderCreatedEvent to RabbitMQ/Kafka\nAnd send bilingual SMS & email notification to customer`,
        auditLog: 'EVENT: OrderFinalized | State: CONFIRMED | ErpSyncStatus: QUEUED_TO_WAREHOUSE',
        api: {
          method: 'GET',
          endpoint: '/api/v1/orders/ORD-99214/status',
          specCode: `// Final Order Query (Dapper)\nSELECT o.Id, o.Status, o.CreatedAt, e.TrackingCode\nFROM Orders o\nLEFT JOIN Logistics e ON e.OrderId = o.Id\nWHERE o.Id = @OrderId;`,
          responsePayload: {
            orderId: "ORD-99214",
            finalStatus: "CONFIRMED",
            carrier: "VNPost Express",
            estimatedDelivery: "2 business days"
          }
        }
      }
    ]
  },
  kyc: {
    title: 'Customer Onboarding & KYC Verification',
    steps: [
      {
        name: 'Identity Submission',
        systemAction: 'Ingest citizen ID photos & profile data',
        businessGoal: 'Comply with state banking regulations and prevent account duplication.',
        gherkin: `Given new user registration\nWhen user submits front/back national identity card\nThen perform image quality & OCR text extraction`,
        auditLog: 'EVENT: KycSubmissionReceived | UserId: USR-5501 | DocumentType: CCND',
        api: {
          method: 'POST',
          endpoint: '/api/v1/kyc/submit',
          specCode: `// Multipart Form Ingestion\nPOST /api/v1/kyc/submit\n{\n  "userId": "USR-5501",\n  "idNumber": "079099001234",\n  "fullName": "NGUYEN MINH HUNG"\n}`,
          responsePayload: {
            kycId: "KYC-1029",
            status: "PENDING_VERIFICATION",
            ocrConfidence: 0.98
          }
        }
      },
      {
        name: 'Biometric Face Match',
        systemAction: 'Compare liveness selfie against ID photo',
        businessGoal: 'Eliminate identity theft with minimum 95% biometric similarity threshold.',
        gherkin: `Given OCR extraction is complete\nWhen user captures liveness video\nThen compare facial embeddings against ID photo\nAnd reject if spoofing detection fails`,
        auditLog: 'EVENT: BiometricPassed | Similarity: 98.4% | SpoofScore: 0.02 (CLEAN)',
        api: {
          method: 'POST',
          endpoint: '/api/v1/kyc/biometrics',
          specCode: `// Facial Embedding Comparison\nPOST /api/v1/kyc/biometrics\n{\n  "kycId": "KYC-1029",\n  "livenessToken": "LIVE-TOKEN-9918"\n}`,
          responsePayload: {
            matched: true,
            confidenceScore: "98.4%",
            livenessVerified: true
          }
        }
      },
      {
        name: 'Sanction & Blacklist Screening',
        systemAction: 'Query internal fraud DB & AML sanctions',
        businessGoal: 'Block high-risk individuals before wallet issuance.',
        gherkin: `Given biometric check passed\nWhen AML query runs across Blacklist DB\nThen flag immediately if matched with known fraudsters`,
        auditLog: 'EVENT: AMLScreeningPassed | Hits: 0 | RiskRating: LOW',
        api: {
          method: 'GET',
          endpoint: '/api/v1/kyc/aml-screen?kycId=KYC-1029',
          specCode: `// Blacklist Query\nSELECT COUNT(1) FROM FraudBlacklist\nWHERE IdNumber = @IdNumber OR PhoneNumber = @Phone;`,
          responsePayload: {
            sanctionMatches: 0,
            pepStatus: false,
            riskScore: "LOW"
          }
        }
      },
      {
        name: 'Account Provisioning',
        systemAction: 'Create customer wallet & ledger entries',
        businessGoal: 'Grant user immediate access to trading and transactions.',
        gherkin: `Given AML check is clear\nWhen account status updates to ACTIVE\nThen provision default currency wallet\nAnd dispatch welcome push notification`,
        auditLog: 'EVENT: AccountActivated | AccountNumber: 108849201 | WalletId: WLT-5501',
        api: {
          method: 'POST',
          endpoint: '/api/v1/accounts/provision',
          specCode: `// Account Initialization\nPOST /api/v1/accounts/provision\n{\n  "userId": "USR-5501",\n  "tier": "STANDARD_VERIFIED"\n}`,
          responsePayload: {
            accountNumber: "108849201",
            status: "ACTIVE",
            tier: "TIER_2_VERIFIED"
          }
        }
      }
    ]
  },
  audit: {
    title: 'POS Stock Audit & Delta Reconciliation',
    steps: [
      {
        name: 'Barcode Scan Batch Sync',
        systemAction: 'Receive offline scanner payload',
        businessGoal: 'Allow retail store clerks to audit 500+ items rapidly without network lag.',
        gherkin: `Given store auditor conducts daily inventory check\nWhen handheld scanner uploads batch CSV/JSON\nThen ingest records into staging table Staging_AuditScans`,
        auditLog: 'EVENT: AuditBatchReceived | StoreId: STR-HCM-01 | TotalScans: 480',
        api: {
          method: 'POST',
          endpoint: '/api/v1/audit/batches',
          specCode: `// Batch Payload Ingestion\nPOST /api/v1/audit/batches\n{\n  "storeId": "STR-HCM-01",\n  "auditorId": "AUD-09",\n  "batchCount": 480\n}`,
          responsePayload: {
            batchId: "AUD-B-883",
            recordsIngested: 480,
            status: "STAGED"
          }
        }
      },
      {
        name: 'SQL Variance Calculation',
        systemAction: 'Execute SQL PIVOT to compute delta variance',
        businessGoal: 'Identify missing stock vs recorded system balance automatically.',
        gherkin: `Given batch AUD-B-883 is staged\nWhen variance engine runs\nThen compute [PhysicalCount] - [SystemBookCount] per SKU\nAnd flag items where delta != 0`,
        auditLog: 'EVENT: VarianceCalculated | DiscrepantSkus: 2 | MatchRate: 99.58%',
        api: {
          method: 'POST',
          endpoint: '/api/v1/audit/calculate-variance',
          specCode: `// SQL PIVOT Delta Query\nSELECT SkuId, [BookCount], [PhysicalCount],\n       ([PhysicalCount] - [BookCount]) AS DeltaVariance\nFROM (\n    SELECT SkuId, SourceType, Qty FROM InventoryAudit\n) src\nPIVOT (SUM(Qty) FOR SourceType IN ([BookCount], [PhysicalCount])) pvt;`,
          responsePayload: {
            varianceItems: [
              { sku: "SKU-IPHONE15", book: 43, physical: 42, delta: -1, reason: "UNDER_INVESTIGATION" }
            ],
            discrepancyCount: 1
          }
        }
      },
      {
        name: 'Supervisor Review & Signoff',
        systemAction: 'Enforce dual-custody authorization for write-offs',
        businessGoal: 'Prevent internal loss by requiring store manager PIN for stock write-downs.',
        gherkin: `Given discrepancy delta is -1\nWhen store manager inputs approval code\nThen log manager justification in Audit_Log table`,
        auditLog: 'EVENT: VarianceApproved | ManagerId: MGR-02 | Justification: DAMAGED_IN_TRANSIT',
        api: {
          method: 'POST',
          endpoint: '/api/v1/audit/signoff',
          specCode: `// Dual Authorization Contract\nPOST /api/v1/audit/signoff\n{\n  "batchId": "AUD-B-883",\n  "managerPin": "••••",\n  "action": "WRITE_OFF"\n}`,
          responsePayload: {
            approved: true,
            writeOffAuthorized: true,
            approvalId: "APP-5510"
          }
        }
      },
      {
        name: 'ERP General Ledger Post',
        systemAction: 'Post double-entry journal entry to accounting',
        businessGoal: 'Keep balance sheet and stock value in 100% synchronization.',
        gherkin: `Given supervisor has signed off\nWhen accounting service syncs\nThen Debit: Inventory Loss Expense, Credit: Merchandise Inventory\nAnd close audit batch`,
        auditLog: 'EVENT: JournalPosted | VoucherNo: GL-2026-991 | Status: AUDIT_CLOSED',
        api: {
          method: 'POST',
          endpoint: '/api/v1/accounting/gl-post',
          specCode: `// Accounting GL Entry\nINSERT INTO GeneralLedger (DebitAcc, CreditAcc, Amount, RefVoucher)\nVALUES ('632', '156', 22000000, 'AUD-B-883');`,
          responsePayload: {
            voucherNo: "GL-2026-991",
            batchStatus: "RECONCILED_AND_CLOSED"
          }
        }
      }
    ]
  }
}

const currentScenario = computed(() => scenarios[selectedScenarioKey.value])
const currentStep = computed(() => currentScenario.value.steps[currentStepIndex.value])

const selectScenario = (key) => {
  selectedScenarioKey.value = key
  currentStepIndex.value = 0
}

const resetScenario = () => {
  currentStepIndex.value = 0
}

const advanceStep = () => {
  isExecuting.value = true
  lastLatency.value = Math.floor(Math.random() * 15) + 8
  setTimeout(() => {
    isExecuting.value = false
    if (currentStepIndex.value < currentScenario.value.steps.length - 1) {
      currentStepIndex.value++
    }
  }, 400)
}

const architectureNodes = [
  {
    id: 'client',
    name: 'Edge & Client',
    role: 'SPA, Mobile App, Webhooks',
    icon: GlobeAltIcon,
    iconName: 'github',
    tech: 'Vue 3, Vite, PWA, Cloudflare CDN',
    details: 'Global distribution with SSL offloading, brotli compression, and asset edge caching to guarantee sub-second First Contentful Paint worldwide.',
    pattern: 'Single Page App, Edge Delivery',
    throughput: '10,000+ RPS',
    resilience: 'Anycast DNS Failover'
  },
  {
    id: 'gateway',
    name: 'API Gateway & Ingress',
    role: 'Reverse Proxy, Rate Limiting, Auth',
    icon: ShieldCheckIcon,
    iconName: 'swagger',
    tech: 'Nginx / Swagger OpenAPI / YARP',
    details: 'Centralized ingress gateway handling token verification, TLS termination, SSL headers, and dynamic load balancing across backend nodes.',
    pattern: 'Gateway Routing, Rate Limiter',
    throughput: '5,000+ RPS',
    resilience: 'Health Checks & Auto-restart'
  },
  {
    id: 'backend',
    name: '.NET 8 Core & Services',
    role: 'Business Logic, Domain Services, REST',
    icon: ServerIcon,
    iconName: 'dotnet',
    tech: 'C# 12, .NET 8 Web API, MediatR',
    details: 'Clean Architecture with CQRS separation, thread-pool optimization, async non-blocking I/O operations, and strong contract typing.',
    pattern: 'Clean Architecture, CQRS, Repository',
    throughput: '3,500+ RPS / instance',
    resilience: 'Polly Circuit Breaker & Retries'
  },
  {
    id: 'cache',
    name: 'Redis Cache & State',
    role: 'Distributed In-Memory Cache & Pub/Sub',
    icon: ArrowPathIcon,
    iconName: 'docker',
    tech: 'Docker Containers & Redis 7.2',
    details: 'Sub-millisecond latency store caching frequent database queries, user session states, and telemetry data to protect primary databases.',
    pattern: 'Cache-Aside Pattern, TTL Expiry',
    throughput: '50,000+ OPS',
    resilience: 'Sentinel Master-Replica'
  },
  {
    id: 'database',
    name: 'SQL Relational Cluster',
    role: 'Relational ACID Data Persistence',
    icon: CircleStackIcon,
    iconName: 'sqlserver',
    tech: 'SQL Server / PostgreSQL + Dapper',
    details: 'Optimized schema with clustered and non-clustered indexing, execution plan tuning, parameterized queries preventing SQL injection, and read replicas.',
    pattern: 'ACID Transactions, Read Replicas',
    throughput: '1,500+ Transactions/sec',
    resilience: 'AlwaysOn Availability Groups'
  }
]

const selectedArchNode = ref(architectureNodes[2])
</script>