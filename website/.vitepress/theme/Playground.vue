<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import parser from 'string-interpolation-parser';

// Transforms exposed to the playground as `{{ value | name }}` pipes.
const transforms: Record<string, (value: unknown, ...args: Array<string | number>) => unknown> = {
  upper: (value) => String(value).toUpperCase(),
  lower: (value) => String(value).toLowerCase(),
  round: (value, digits = 0) => Number(value).toFixed(Number(digits)),
  currency: (value) => `$${Number(value).toFixed(2)}`,
};

type Preset = { label: string; params: string; context: string };

const PRESETS: Preset[] = [
  {
    label: 'Greeting',
    params: JSON.stringify(
      {
        welcome: 'Welcome, {{ vendor.name }}!',
        order: 'Hi {{ customer }}, your order ships to {{ store.data.name }}.',
        total: 10,
        ignored: true,
      },
      null,
      2,
    ),
    context: JSON.stringify(
      {
        vendor: { name: 'Felippe Maurício' },
        store: { data: { address: 'RJ', name: 'Rio de Janeiro' } },
        customer: 'Luciana Cabral',
      },
      null,
      2,
    ),
  },
  {
    label: 'Deep & indexed paths',
    params: JSON.stringify(
      {
        headline: 'Read now: {{ user.posts[0].title }}',
        tag: 'On sale: {{ cart.items[0].tags[0] }}',
        missing: 'Empty when absent: "{{ user.middleName }}"',
      },
      null,
      2,
    ),
    context: JSON.stringify(
      {
        user: { posts: [{ title: 'Designing an API with GraphQL' }] },
        cart: { items: [{ name: 'Air Fryer', tags: ['sale'] }] },
      },
      null,
      2,
    ),
  },
  {
    label: 'Multiple tokens',
    params: JSON.stringify(
      {
        full: 'Hello {{ firstName }} {{ lastName }}!',
        spaced: 'Works with {{firstName}} odd {{   lastName   }} spacing too.',
      },
      null,
      2,
    ),
    context: JSON.stringify({ firstName: 'Felippe', lastName: 'Murakami' }, null, 2),
  },
  {
    label: 'Filters & fallbacks',
    params: JSON.stringify(
      {
        shout: '{{ name | upper }}',
        price: 'Total: {{ amount | currency }}',
        rounded: 'Rounded: {{ amount | round: 1 }}',
        greeting: 'Hi {{ user.name || "there" }}!',
      },
      null,
      2,
    ),
    context: JSON.stringify({ name: 'felippe', amount: 9.5, user: {} }, null, 2),
  },
];

const state = reactive({
  params: PRESETS[0]!.params,
  context: PRESETS[0]!.context,
});

const activePreset = ref(0);

function loadPreset(index: number) {
  const preset = PRESETS[index];
  if (!preset) return;
  activePreset.value = index;
  state.params = preset.params;
  state.context = preset.context;
}

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

function parseJson<T>(source: string): Parsed<T> {
  try {
    return { ok: true, value: JSON.parse(source) as T };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

const result = computed(() => {
  const params = parseJson<Record<string, unknown>>(state.params);
  if (!params.ok) return { error: `params: ${params.error}` };

  const context = parseJson<Record<string, unknown>>(state.context);
  if (!context.ok) return { error: `context: ${context.error}` };

  try {
    return { value: parser(params.value, context.value, { transforms }) };
  } catch (error) {
    return { error: (error as Error).message };
  }
});

const output = computed(() =>
  'value' in result.value ? JSON.stringify(result.value.value, null, 2) : '',
);
</script>

<template>
  <div class="pg">
    <div class="pg-presets">
      <span class="pg-presets-label">Presets</span>
      <button
        v-for="(preset, index) in PRESETS"
        :key="preset.label"
        class="pg-chip"
        :class="{ 'is-active': index === activePreset }"
        @click="loadPreset(index)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div class="pg-grid">
      <label class="pg-pane">
        <span class="pg-pane-title">params</span>
        <textarea v-model="state.params" spellcheck="false" rows="14" />
      </label>
      <label class="pg-pane">
        <span class="pg-pane-title">context</span>
        <textarea v-model="state.context" spellcheck="false" rows="14" />
      </label>
    </div>

    <div class="pg-pane pg-output">
      <span class="pg-pane-title">result</span>
      <pre v-if="!('error' in result)" class="pg-result">{{ output }}</pre>
      <pre v-else class="pg-result pg-error">{{ result.error }}</pre>
    </div>
  </div>
</template>

<style scoped>
.pg {
  margin: 1.25rem 0;
}

.pg-presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}
.pg-presets-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-right: 0.25rem;
}
.pg-chip {
  font-size: 0.82rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.15s ease;
}
.pg-chip:hover {
  border-color: var(--vp-c-brand-1);
}
.pg-chip.is-active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.pg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 640px) {
  .pg-grid {
    grid-template-columns: 1fr;
  }
}

.pg-pane {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.pg-pane-title {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.pg textarea,
.pg-result {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.55;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 0.85rem 1rem;
}
.pg textarea {
  width: 100%;
  resize: vertical;
  tab-size: 2;
}
.pg textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.pg-output {
  margin-top: 1rem;
}
.pg-result {
  margin: 0;
  min-height: 4rem;
  white-space: pre-wrap;
  overflow-x: auto;
}
.pg-error {
  color: var(--vp-c-danger-1, #fd5c63);
}
</style>
