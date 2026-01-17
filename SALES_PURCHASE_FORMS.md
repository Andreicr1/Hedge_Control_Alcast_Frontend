# Sales Order & Purchase Order Forms - Commodities Trading

## Formulários Criados

### 1. SalesOrderForm
**Localização**: `/src/app/components/forms/SalesOrderForm.tsx`

Formulário completo para ingresso de Sales Orders em negócios internacionais de commodities.

#### Seções do Formulário:

1. **Basic Information**
   - SO Number (auto-gerado)
   - Customer Name
   - Status (Draft/Approved/Active/Completed/Cancelled)

2. **Product Details**
   - Commodity (Aluminum, Copper, Zinc, Lead, Nickel, Tin)
   - Product Grade (ex: A7, 99.7% purity)
   - Total Quantity (MT)
   - Tolerance Percentage (±10%)

3. **Pricing Terms**
   - Pricing Type (Fixed/Float/Formula)
   - Currency (USD, EUR, GBP, JPY, CNY)
   - Unit Price (para Fixed)
   - Price Formula (ex: LME 3M + $100)

4. **Delivery Terms**
   - Incoterm (FOB, CFR, CIF, EXW, FCA, CPT, CIP, DAP, DPU, DDP)
   - Loading Port
   - Discharge Port
   - Country of Origin
   - Country of Destination
   - Shipment Period (Start/End dates)

5. **Quality Specifications**
   - Parâmetros customizáveis
   - Min/Max/Typical values
   - Unidades de medida
   - Adicionar/Remover especificações dinamicamente

6. **Payment Terms**
   - Payment Method (LC, TT, CAD, DP)
   - Credit Days
   - Payment Terms Details (ex: 30% advance, 70% against BL)

7. **Documentation**
   - Required Documents (checkboxes):
     - Commercial Invoice
     - Packing List
     - Bill of Lading
     - Certificate of Origin
     - Quality Certificate
     - Weight Certificate
     - Insurance Certificate
   - Inspection Agency (ex: SGS, Bureau Veritas)

8. **Additional Terms**
   - Special Conditions (textarea)
   - Internal Notes (textarea)

### 2. PurchaseOrderForm
**Localização**: `/src/app/components/forms/PurchaseOrderForm.tsx`

Formulário completo para ingresso de Purchase Orders, com a mesma estrutura do Sales Order, mas adaptado para compras (supplier ao invés de customer).

#### Estrutura idêntica ao Sales Order, incluindo:
- Todas as 8 seções
- Mesmos campos de comércio internacional
- Mesma navegação lateral
- Mesmas validações

## Características Técnicas

### UX/UI Enterprise Grade
- **Modal full-screen** (max-width: 6xl, max-height: 90vh)
- **Sidebar Navigation** para navegação entre seções
- **Seção ativa** destacada visualmente
- **Validação inline** de campos obrigatórios
- **Campos dinâmicos** para Quality Specifications
- **Checkboxes** para documentação requerida

### Padrões SAP Fiori
- Componentes reutilizados: `FioriButton`, `FioriInput`, `FioriSelect`
- Tokens SAP (`var(--sap...)`) para cores e estilos
- Tipografia SAP 72 consistente
- Espaçamento e padding padronizados

### Funcionalidades
- ✅ Auto-geração de SO/PO Number
- ✅ Pricing condicional (Fixed vs Formula)
- ✅ Quality Specs dinâmicas (add/remove)
- ✅ Multiple documents selection
- ✅ Textareas para termos especiais
- ✅ Validação de campos required
- ✅ Cancel/Save actions

## Integração nas Páginas

### SalesOrdersPage
- Botão **"Novo SO"** no header da master list
- Modal aparece ao clicar no botão
- `handleSaveOrder()` loga os dados (pronto para integração backend)

### PurchaseOrdersPage
- Botão **"Novo PO"** no header da master list
- Modal aparece ao clicar no botão
- `handleSaveOrder()` loga os dados (pronto para integração backend)

## Campos Específicos de Commodities Trading

### Incoterms Completos
- FOB (Free On Board)
- CFR (Cost and Freight)
- CIF (Cost, Insurance and Freight)
- EXW (Ex Works)
- FCA (Free Carrier)
- CPT (Carriage Paid To)
- CIP (Carriage and Insurance Paid To)
- DAP (Delivered At Place)
- DPU (Delivered at Place Unloaded)
- DDP (Delivered Duty Paid)

### Payment Methods
- LC (Letter of Credit)
- TT (Telegraphic Transfer)
- CAD (Cash Against Documents)
- DP (Documents Against Payment)

### Quality Specifications
Sistema flexível para especificar:
- Parâmetros (ex: Al content, Si, Fe, Cu, Zn)
- Min/Max/Typical values
- Unidades (%, ppm, etc.)

### Documentation Típica
- Commercial Invoice
- Packing List
- Bill of Lading (BL)
- Certificate of Origin (COO)
- Quality Certificate
- Weight Certificate
- Insurance Certificate

## Próximos Passos (Backend Integration)

1. **Criar endpoints API**:
   - POST `/api/sales-orders`
   - POST `/api/purchase-orders`

2. **Validação server-side**:
   - Validar campos obrigatórios
   - Validar formatos (datas, números)
   - Validar business rules

3. **Persistência**:
   - Salvar em banco de dados
   - Gerar documentos PDF
   - Enviar notificações

4. **Workflow**:
   - Aprovação de SO/PO
   - Alteração de status
   - Vinculação com Deals/Exposures

## Exemplo de Uso

```typescript
// No componente SalesOrdersPage
const handleSaveOrder = (formData: SalesOrderFormData) => {
  // Aqui você faria:
  // 1. Validação adicional
  // 2. POST para API
  // 3. Atualizar lista de SOs
  // 4. Mostrar toast de sucesso
  console.log('Saving Sales Order:', formData);
};
```

## Dados Capturados (TypeScript Interface)

```typescript
interface SalesOrderFormData {
  // 40+ campos cobrindo:
  // - Informações básicas
  // - Detalhes do produto
  // - Termos de pricing
  // - Termos de entrega
  // - Especificações de qualidade
  // - Termos de pagamento
  // - Documentação
  // - Termos adicionais
}
```

## Validações Implementadas

- ✅ Campos obrigatórios (required)
- ✅ Tipos de dados (number, date, string)
- ✅ Desabilitação de campos (SO/PO Number)
- ✅ Validação condicional (Fixed price vs Formula)
- ✅ Pelo menos 1 documento obrigatório

## Responsividade

- Desktop: Grid 2 colunas
- Tablet: Grid adapta para 1-2 colunas
- Mobile: Grid 1 coluna (formulário scrollável)
