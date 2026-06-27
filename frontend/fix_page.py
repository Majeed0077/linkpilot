from pathlib import Path

p = Path('app/page.tsx')
text = p.read_text(encoding='utf-8')
replacements = {
    'bg-[var(--background)]': 'bg-(--background)',
    'text-[var(--foreground)]': 'text-(--foreground)',
    'border-[var(--line)]': 'border-(--line)',
    'text-[var(--muted)]': 'text-(--muted)',
    'text-[var(--accent)]': 'text-(--accent)',
    'bg-[var(--surface)]': 'bg-(--surface)',
    'bg-[var(--accent-soft)]': 'bg-(--accent-soft)',
    'text-[var(--ink)]': 'text-(--ink)',
    'ring-[var(--accent-soft)]': 'ring-(--accent-soft)',
    'bg-[var(--ink)]': 'bg-(--ink)',
    'divide-[var(--line)]': 'divide-(--line)',
    'hover:text-[var(--foreground)]': 'hover:text-(--foreground)',
    'text-[var(--accent-soft)]': 'text-(--accent-soft)',
    'max-w-[1120px]': 'max-w-280',
    'py-[72px]': 'py-18',
    'py-[64px]': 'py-16',
    'py-[14px]': 'py-14',
    'py-[10px]': 'py-10'
}
for old, new in replacements.items():
    text = text.replace(old, new)
p.write_text(text, encoding='utf-8')
print('updated', p)
