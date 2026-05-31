# 🔧 Expense/Wallet/Budget Crash Fix

## ❌ Problemas Encontrados

### 1. **Falta Validação de UserId**
Quando `req.user?.id` era `undefined`, causava crash nos controllers:
- `createExpense`
- `updateExpense`
- `deleteExpense`
- `deleteWallet`
- `createWallet`
- `upsertBudget`
- `deleteBudget`

### 2. **Comparação de Tipos Incorreta**
Em `updateExpense` e `deleteExpense`:
```javascript
// ❌ ANTES - userId pode ser ObjectId ou String
if (existingExpense.userId !== userId) {

// ✅ DEPOIS - Converter ambos para String
if (String(existingExpense.userId) !== String(userId)) {
```

### 3. **Falta Validação de Ownership no deleteBudget**
```javascript
// ❌ ANTES - Qualquer um pode deletar qualquer budget
const budget = await Budget.findByIdAndDelete(req.params.id);

// ✅ DEPOIS - Validar que pertence ao usuário
const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId });
```

---

## ✅ Fixes Implementados

### Arquivo: `expenseController.js`

#### 1. `createExpense` - Adicionar validação userId
```javascript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
}
```

#### 2. `updateExpense` - Adicionar validação userId + converter para String
```javascript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
}

// ...

if (!existingExpense || String(existingExpense.userId) !== String(userId)) {
```

#### 3. `deleteExpense` - Adicionar validação userId + converter para String
```javascript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
}

// ...

if (!expense || String(expense.userId) !== String(userId)) {
```

---

### Arquivo: `walletController.js`

#### 1. `createWallet` - Adicionar validação userId
```javascript
const userId = req.user?.id;

if (!userId) {
  return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
}
```

#### 2. `deleteWallet` - Adicionar validação userId
```javascript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
}
```

---

### Arquivo: `budgetController.js`

#### 1. `upsertBudget` - Adicionar validação userId
```javascript
const userId = req.user?.id;

if (!userId) {
  return res.status(401).json({ message: 'Không xác thực được người dùng' });
}
```

#### 2. `deleteBudget` - Adicionar validação userId + ownership check
```javascript
const userId = req.user?.id;
if (!userId) {
  return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
}

const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId });

if (!budget) {
  return res.status(404).json({ message: 'Không tìm thấy ngân sách hoặc bạn không có quyền' });
}
```

---

## 📊 Resumo das Mudanças

| Controller | Função | Fix |
|-----------|--------|-----|
| Expense | `createExpense` | ✅ Validar userId |
| Expense | `updateExpense` | ✅ Validar userId + converter String |
| Expense | `deleteExpense` | ✅ Validar userId + converter String |
| Wallet | `createWallet` | ✅ Validar userId |
| Wallet | `deleteWallet` | ✅ Validar userId |
| Budget | `upsertBudget` | ✅ Validar userId |
| Budget | `deleteBudget` | ✅ Validar userId + ownership |

---

## 🚀 Como Testar

### 1. Verificar Crash Fixes
```bash
cd backend
npm run dev  # Servidor rodando

# Em outro terminal:
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000, "category": "food", "description": "Lunch", "date": "2026-05-31"}'
```

**Esperado:** 401 Unauthorized (sem JWT token)
```json
{
  "success": false,
  "message": "Não autenticado"
}
```

### 2. Testar com Token Válido
```bash
# Após login, obter JWT token
# Usar token no header Authorization: Bearer {token}

curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000, "category": "food", "description": "Lunch", "date": "2026-05-31"}'
```

**Esperado:** 201 Created com expense data

### 3. Testar Ownership Check
```bash
# Tentar deletar budget de outro usuário
curl -X DELETE http://localhost:5000/api/budgets/ANOTHER_USERS_BUDGET_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Esperado:** 404 Not Found
```json
{
  "message": "Không tìm thấy ngân sách hoặc bạn không có quyền"
}
```

---

## 🛡️ Melhorias de Segurança

1. ✅ **Validação de Autenticação** - Verifica se userId existe
2. ✅ **Validação de Ownership** - Apenas operações em dados do usuário
3. ✅ **Type Conversion** - Evita comparação de tipos incompatíveis
4. ✅ **Consistent Error Messages** - Mensagens claras e em vietnamita

---

## ⚠️ Notas Importantes

### Auth Middleware
Certifique-se que o middleware de autenticação está configurado:
```javascript
// backend/routes/expenseRoutes.js
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, createExpense);
```

### Auth Middleware Implementation
```javascript
// backend/middleware/authMiddleware.js
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token bắt buộc' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
```

---

## 🔍 Verificação Final

Após deploy, verificar:
1. ✅ Criar expense sem crash
2. ✅ Criar wallet sem crash
3. ✅ Criar budget sem crash
4. ✅ Atualizar expense sem crash
5. ✅ Deletar expense como owner
6. ✅ Deletar wallet como owner
7. ✅ Deletar budget como owner
8. ✅ Não deletar dados de outros usuários

---

**Data da Fix:** May 31, 2026
**Status:** ✅ Completo
