const grads = [
  'linear-gradient(135deg,#1e3c72,#2a5298)',
  'linear-gradient(135deg,#0a7c5a,#13a574)',
  'linear-gradient(135deg,#3a1c71,#d76d77)',
  'linear-gradient(135deg,#232526,#414345)',
  'linear-gradient(135deg,#005c97,#363795)',
  'linear-gradient(135deg,#e8a317,#f0b94a)',
];

// Стабильный градиент по ключу — у одного объявления всегда одна обложка.
export function gradientFor(seed: string): string {
  let h = 0;
  for (const c of seed || 'x') h = (h * 31 + c.charCodeAt(0)) % grads.length;
  return grads[h];
}
