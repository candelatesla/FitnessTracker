import { claudePlanHtml } from "@/lib/data/claudePlanHtml";

export function buildClaudePlanDocument() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Claude Fitness Plan Reference</title>
    <style>
      :root {
        --color-background-primary: #111111;
        --color-background-secondary: #1a1a1a;
        --color-border-primary: rgba(255, 255, 255, 0.15);
        --color-border-secondary: rgba(255, 255, 255, 0.1);
        --color-border-tertiary: rgba(255, 255, 255, 0.08);
        --color-text-primary: #f5f5f5;
        --color-text-secondary: #b7b7b7;
        --color-text-tertiary: #888888;
        --border-radius-md: 12px;
        --border-radius-lg: 20px;
      }

      html,
      body {
        margin: 0;
        background: #0a0a0a;
        color: var(--color-text-primary);
        font-family: Inter, system-ui, sans-serif;
      }

      body {
        padding: 24px;
      }
    </style>
  </head>
  <body>
    ${claudePlanHtml}
    <script>
      function show(id, button) {
        document.querySelectorAll(".section").forEach((section) => section.classList.remove("active"));
        document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
        const nextSection = document.getElementById(id);
        if (nextSection) nextSection.classList.add("active");
        if (button) button.classList.add("active");
      }
    </script>
  </body>
</html>`;
}
