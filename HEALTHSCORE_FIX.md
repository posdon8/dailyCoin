# 🔧 HealthScore NaN Validation Fix

## ❌ Problema Encontrado

```
HealthScore validation failed: 
- metrics.savings: Cast to Number failed for value "NaN" (type number)
- metrics.income: Cast to Number failed for value "NaN" (type number)
```

### Causa Raiz
Na função `calculateHealthScore()`, o código tentava acessar propriedades que não existem no modelo Wallet:

```javascript
wallets.forEach((wallet) => {
    totalIncome += wallet.initialBalance;    // ❌ undefined
    savings += wallet.currentBalance;        // ❌ undefined
});
```

**Resultado:** `undefined + undefined = NaN`

### Modelo Wallet Real
```javascript
{
    userId: String,
    name: String,
    balance: Number,  // ✅ Campo real
    type: String,
    // ... outras propriedades
}
```

---

## ✅ Solução Implementada

### 1. Corrigir Acesso ao Campo Wallet
**Arquivo:** `backend/controllers/healthController.js` (linha ~50)

```javascript
// ❌ ANTES:
wallets.forEach((wallet) => {
    totalIncome += wallet.initialBalance;
    savings += wallet.currentBalance;
});

// ✅ DEPOIS:
wallets.forEach((wallet) => {
    const balance = wallet.balance || 0;  // Use campo correto
    totalIncome += balance;
    savings += balance;
});

// Se não houver wallets, estimar renda
if (totalIncome === 0 && totalExpense > 0) {
    totalIncome = totalExpense * 1.5; // Assume 1.5x de despesas
}
```

### 2. Validação de NaN Antes de Salvar
**Arquivo:** `backend/controllers/healthController.js` (linha ~165)

```javascript
// Validar métrics para prevenir valores NaN
const validatedMetrics = {
    totalExpense: isNaN(scoreData.metrics.totalExpense) ? 0 : scoreData.metrics.totalExpense,
    budgetLimit: isNaN(scoreData.metrics.budgetLimit) ? 0 : scoreData.metrics.budgetLimit,
    savings: isNaN(scoreData.metrics.savings) ? 0 : scoreData.metrics.savings,
    income: isNaN(scoreData.metrics.income) ? 0 : scoreData.metrics.income,
    categoryCount: scoreData.metrics.categoryCount || 0,
    maxCategoryPercent: isNaN(scoreData.metrics.maxCategoryPercent) ? 0 : scoreData.metrics.maxCategoryPercent,
    budgetAdherencePercent: isNaN(scoreData.metrics.budgetAdherencePercent) ? 0 : scoreData.metrics.budgetAdherencePercent,
    monthlyTrend: isNaN(scoreData.metrics.monthlyTrend) ? 0 : scoreData.metrics.monthlyTrend,
};
```

### 3. Usar Metrics Validados
**Arquivo:** `backend/controllers/healthController.js` (linha ~190)

```javascript
const healthScore = await HealthScore.create({
    userId,
    score: scoreData.score,
    breakdown: scoreData.breakdown,
    metrics: validatedMetrics,  // ✅ Use validados
    insights,
    expiresAt,
    metadata: {
        dataSource: 'expenses_budgets_wallets',
        period: 'daily',
    },
});
```

---

## 📊 Lógica da Métrica "Savings Rate"

### Novo Cálculo (Corrigido)
```
1. Somar todos os balances das wallets
2. totalIncome = total de balances
3. savings = total de balances (mesma coisa, pois wallets são ativo total)
4. savingsPercent = (savings / totalIncome) * 100

Se totalIncome = 0:
  - Se houver despesas: estimar income = totalExpense * 1.5
  - Se não houver despesas: income = 0, savings = 0

Pontuação = Math.min(20, (savingsPercent / 100) * 20)
```

### Exemplos

**Caso 1: Usuário com Wallets**
```
Wallets:
- Bank Account: 5,000,000 VND
- Cash: 500,000 VND

totalIncome = 5,500,000
savings = 5,500,000
savingsPercent = 100%
Pontuação = 20/20 ✅ Excelente
```

**Caso 2: Usuário sem Wallets mas com Despesas**
```
Despesas: 1,000,000 VND
Wallets: [] (vazia)

totalIncome = 1,000,000 * 1.5 = 1,500,000 (estimado)
savings = 0
savingsPercent = 0%
Pontuação = 0/20 ⚠️ Precisa melhorar
```

**Caso 3: Usuário sem Wallets nem Despesas**
```
Despesas: 0
Wallets: [] (vazia)

totalIncome = 0
savings = 0
Pontuação = 0/20 (sem penalidade, apenas neutro)
```

---

## 🧪 Como Testar

### 1. Verificar Logs
```bash
# Backend rodando com npm run dev
# Procure por: [HealthScore] Validated metrics: { ... }
```

### 2. Teste API Manual
```bash
curl -X POST http://localhost:5000/api/health/calculate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Esperado - Response 201:**
```json
{
  "success": true,
  "data": {
    "score": 45,
    "breakdown": { ... },
    "metrics": {
      "totalExpense": 5000000,
      "budgetLimit": 8000000,
      "savings": 0,        // ✅ Nunca NaN
      "income": 7500000,   // ✅ Nunca NaN
      "categoryCount": 3,
      "maxCategoryPercent": 45,
      "budgetAdherencePercent": 80,
      "monthlyTrend": 5.5
    },
    "insights": [ ... ],
    "calculatedAt": "2026-05-31T...",
    "expiresAt": "2026-06-01T..."
  }
}
```

### 3. Verificar Banco de Dados
```bash
# MongoDB
db.healthscores.findOne({ userId: "your-user-id" })

# Procure por valores válidos (não NaN):
{
  metrics: {
    savings: 0,      // ✅ Número válido
    income: 1500000, // ✅ Número válido
    // ...
  }
}
```

---

## 📝 Resumo das Mudanças

| Aspecto | Antes | Depois |
|---------|--------|--------|
| Campo Wallet acessado | `initialBalance`, `currentBalance` | `balance` |
| Valor de income | NaN (undefined + undefined) | Número válido ou estimado |
| Valor de savings | NaN | Número válido ou 0 |
| Validação antes de save | ❌ Não | ✅ Sim |
| Fallback se vazio | ❌ Não | ✅ Estima income = expense * 1.5 |
| Logging | Sem detalhes | ✅ Logs validados metrics |

---

## 🚀 Próximos Passos

1. **Teste completo:**
   ```bash
   npm run dev  # Backend
   # Em outro terminal:
   npm run dev  # Frontend
   ```

2. **Verificar funcionamento:**
   - Aceder ao Dashboard de Health Score
   - Clicar "Recalculate"
   - Verificar se não há erro 500
   - Validar se score aparece

3. **Monitorar logs:**
   - Procurar por `[HealthScore] Validated metrics:`
   - Garantir que não há valores NaN

4. **Se ainda houver problemas:**
   - Verificar se há outras funções que acessam wallet fields
   - Adicionar mais validações conforme necessário
   - Considerar atualizar schema Wallet se necessário

---

**Data da Fix:** May 31, 2026
**Status:** ✅ Ready to Test
