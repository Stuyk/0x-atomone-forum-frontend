<script lang="ts" setup>
import { onMounted, ref, computed, watch } from "vue";
import markdownit from "markdown-it";
import MarkdownItMermaid from "@agoose77/markdown-it-mermaid";
import { alertPlugin } from "markdown-it-github-alert";
import DOMPurify from "dompurify";

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})
  .use(MarkdownItMermaid)
  .use(alertPlugin);

const props = defineProps<{ limit?: number, content: string }>();
const trimmedContent = ref<string>("");

function purifyHtml(html: string) {
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: [
      "style",
      "form",
      "math",
      "iframe",
      "input",
      "audio",
      "video",
      "canvas",
      "dialog",
      "source",
      "textarea",
      "embed",
      "label",
      "select",
      "button",
      "fieldset",
      "legend",
      "datalist",
      "output",
      "option",
      "optgroup",
    ],
  });
}

async function parseData() {
  try {
    if (!props.content) {
      return "";
    }

    const htmlContent = await md.render(props.content.replace(/\\n/g, '\n'));

    trimmedContent.value = purifyHtml(htmlContent);
  } catch (_e) {
    console.log(_e);
  }
}

const getClasses = computed(() => {
  return [
    "prose",
    "max-w-none",
    "prose:font-interVar",
    "prose-a:text-accent-100",
    "prose-p:text-light",
    "prose-code:text-accent-200",
    "prose-li:text-light",
    "prose-h1:text-light",
    "prose-h1:text-400",
    "prose-h2:text-light",
    "prose-h2:text-300",
    "prose-h3:text-light",
    "prose-h3:text-200",
    "prose-h4:text-light",
    "prose-h4:text-200",
    "prose-h5:text-light",
    "prose-h5:text-200",
    "prose-strong:text-light",
    "prose-pre:bg-grey-500",
    "prose-table:text-light",
    "prose-table:border",
    "prose-td:text-center",
    "prose-td:p-2",
    "prose-td:border",
    "prose-th:text-center",
    "prose-th:text-light",
    "prose-th:border",
  ];
});

watch(() => props.content, (_newVal, _oldVal) => {
  parseData();
});

onMounted(parseData);
</script>

<template>
  <div>
    <!-- eslint-disable vue/no-v-html -->
    <div :class="getClasses" v-if="content" v-html="trimmedContent"></div>
    <!--eslint-enable-->
  </div>
</template>

<style>
.markdown-alert {
  padding: 1em;
  border-left: 0.25rem solid;
  padding-bottom: 0px;
  padding-top: 0px;
  border-color: var(--border-color);
}

.markdown-alert > span {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--border-color);
}

.markdown-alert .markdown-alert-icon {
  margin-right: 0.5em;
  fill: var(--border-color);
}

.markdown-alert.note {
  --border-color: #539bf5;
}

.markdown-alert.warning {
  --border-color: #c69026;
}

.markdown-alert.important {
  --border-color: #986ee2;
}

.markdown-alert.caution {
  --border-color: #e5534b;
}

.markdown-alert.tip {
  --border-color: #57ab5a;
}
</style>