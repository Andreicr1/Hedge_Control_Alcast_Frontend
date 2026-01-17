import { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { FioriButton } from '../fiori/FioriButton';
import { FioriInput } from '../fiori/FioriInput';
import { FioriSelect } from '../fiori/FioriSelect';

interface SalesOrderFormProps {
  onClose: () => void;
  onSave: (formData: SalesOrderFormData) => void;
}

export interface SalesOrderFormData {
  // Basic Information
  so_number: string;
  customer_name: string;
  customer_id?: string;
  
  // Product Details
  commodity: string;
  product_grade: string;
  total_quantity_mt: number;
  tolerance_percentage: number;
  
  // Pricing
  pricing_type: 'Fixed' | 'Float' | 'Formula';
  unit_price?: number;
  price_formula?: string;
  currency: string;
  
  // Delivery Terms
  incoterm: string;
  loading_port: string;
  discharge_port: string;
  country_of_origin: string;
  country_of_destination: string;
  shipment_period_start: string;
  shipment_period_end: string;
  
  // Quality Specifications
  quality_specs: QualitySpec[];
  
  // Payment Terms
  payment_terms: string;
  payment_method: string;
  credit_days: number;
  
  // Documentation
  required_documents: string[];
  inspection_agency?: string;
  
  // Additional Terms
  special_conditions?: string;
  internal_notes?: string;
  
  // Status
  status: 'Draft' | 'Approved' | 'Active' | 'Completed' | 'Cancelled';
}

interface QualitySpec {
  parameter: string;
  min_value?: string;
  max_value?: string;
  typical_value?: string;
  unit: string;
}

const INCOTERMS = ['FOB', 'CFR', 'CIF', 'EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
const COMMODITIES = ['Aluminum', 'Copper', 'Zinc', 'Lead', 'Nickel', 'Tin'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
const PAYMENT_METHODS = ['LC (Letter of Credit)', 'TT (Telegraphic Transfer)', 'CAD (Cash Against Documents)', 'DP (Documents Against Payment)'];
const DOCUMENTS = ['Commercial Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin', 'Quality Certificate', 'Weight Certificate', 'Insurance Certificate'];

export function SalesOrderForm({ onClose, onSave }: SalesOrderFormProps) {
  const [formData, setFormData] = useState<SalesOrderFormData>({
    so_number: `SO-${Date.now()}`,
    customer_name: '',
    commodity: 'Aluminum',
    product_grade: '',
    total_quantity_mt: 0,
    tolerance_percentage: 10,
    pricing_type: 'Fixed',
    currency: 'USD',
    incoterm: 'FOB',
    loading_port: '',
    discharge_port: '',
    country_of_origin: '',
    country_of_destination: '',
    shipment_period_start: '',
    shipment_period_end: '',
    quality_specs: [],
    payment_terms: '',
    payment_method: 'LC (Letter of Credit)',
    credit_days: 0,
    required_documents: ['Commercial Invoice', 'Packing List', 'Bill of Lading'],
    status: 'Draft',
  });

  const [activeSection, setActiveSection] = useState<string>('basic');

  const handleInputChange = (field: keyof SalesOrderFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddQualitySpec = () => {
    setFormData((prev) => ({
      ...prev,
      quality_specs: [
        ...prev.quality_specs,
        { parameter: '', min_value: '', max_value: '', typical_value: '', unit: '%' },
      ],
    }));
  };

  const handleRemoveQualitySpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quality_specs: prev.quality_specs.filter((_, i) => i !== index),
    }));
  };

  const handleQualitySpecChange = (index: number, field: keyof QualitySpec, value: string) => {
    setFormData((prev) => ({
      ...prev,
      quality_specs: prev.quality_specs.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const handleDocumentToggle = (doc: string) => {
    setFormData((prev) => ({
      ...prev,
      required_documents: prev.required_documents.includes(doc)
        ? prev.required_documents.filter((d) => d !== doc)
        : [...prev.required_documents, doc],
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const sections = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'product', label: 'Product Details' },
    { id: 'pricing', label: 'Pricing Terms' },
    { id: 'delivery', label: 'Delivery Terms' },
    { id: 'quality', label: 'Quality Specifications' },
    { id: 'payment', label: 'Payment Terms' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'additional', label: 'Additional Terms' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sapList_BorderColor)]">
          <h2 className="font-['72:Bold',sans-serif] text-xl text-[#131e29]">
            Create Sales Order
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--sapContent_IconColor)] hover:text-[#131e29] transition-colors"
            type="button"
            aria-label="Fechar"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-56 border-r border-[var(--sapList_BorderColor)] bg-[var(--sapList_Background)] overflow-y-auto">
            <nav className="p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-['72:Regular',sans-serif] transition-colors ${
                    activeSection === section.id
                      ? 'bg-[var(--sapList_SelectionBackgroundColor)] text-[#0064d9] font-["72:Bold",sans-serif]'
                      : 'text-[#131e29] hover:bg-[var(--sapList_HoverBackground)]'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Information */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FioriInput
                    label="SO Number"
                    value={formData.so_number}
                    onChange={(e) => handleInputChange('so_number', e.target.value)}
                    required
                    disabled
                  />
                  <FioriInput
                    label="Customer Name"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    required
                    placeholder="Enter customer name"
                  />
                  <FioriSelect
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    options={[
                      { value: 'Draft', label: 'Draft' },
                      { value: 'Approved', label: 'Approved' },
                      { value: 'Active', label: 'Active' },
                      { value: 'Completed', label: 'Completed' },
                      { value: 'Cancelled', label: 'Cancelled' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Product Details */}
            {activeSection === 'product' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FioriSelect
                    label="Commodity"
                    value={formData.commodity}
                    onChange={(e) => handleInputChange('commodity', e.target.value)}
                    options={COMMODITIES.map((c) => ({ value: c, label: c }))}
                    required
                  />
                  <FioriInput
                    label="Product Grade"
                    value={formData.product_grade}
                    onChange={(e) => handleInputChange('product_grade', e.target.value)}
                    required
                    placeholder="e.g., A7, 99.7% purity"
                  />
                  <FioriInput
                    label="Total Quantity (MT)"
                    type="number"
                    value={formData.total_quantity_mt.toString()}
                    onChange={(e) => handleInputChange('total_quantity_mt', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <FioriInput
                    label="Tolerance (%)"
                    type="number"
                    value={formData.tolerance_percentage.toString()}
                    onChange={(e) => handleInputChange('tolerance_percentage', parseFloat(e.target.value) || 0)}
                    placeholder="±10%"
                  />
                </div>
              </div>
            )}

            {/* Pricing Terms */}
            {activeSection === 'pricing' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Pricing Terms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FioriSelect
                    label="Pricing Type"
                    value={formData.pricing_type}
                    onChange={(e) => handleInputChange('pricing_type', e.target.value)}
                    options={[
                      { value: 'Fixed', label: 'Fixed Price' },
                      { value: 'Float', label: 'Floating (LME-based)' },
                      { value: 'Formula', label: 'Formula-based' },
                    ]}
                    required
                  />
                  <FioriSelect
                    label="Currency"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                    required
                  />
                  {formData.pricing_type === 'Fixed' && (
                    <FioriInput
                      label="Unit Price"
                      type="number"
                      value={formData.unit_price?.toString() || ''}
                      onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
                      required
                      placeholder="Price per MT"
                    />
                  )}
                  {formData.pricing_type === 'Formula' && (
                    <FioriInput
                      label="Price Formula"
                      value={formData.price_formula || ''}
                      onChange={(e) => handleInputChange('price_formula', e.target.value)}
                      required
                      placeholder="e.g., LME 3M + $100"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Delivery Terms */}
            {activeSection === 'delivery' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Delivery Terms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FioriSelect
                    label="Incoterm"
                    value={formData.incoterm}
                    onChange={(e) => handleInputChange('incoterm', e.target.value)}
                    options={INCOTERMS.map((i) => ({ value: i, label: i }))}
                    required
                  />
                  <FioriInput
                    label="Loading Port"
                    value={formData.loading_port}
                    onChange={(e) => handleInputChange('loading_port', e.target.value)}
                    required
                    placeholder="e.g., Rotterdam, Shanghai"
                  />
                  <FioriInput
                    label="Discharge Port"
                    value={formData.discharge_port}
                    onChange={(e) => handleInputChange('discharge_port', e.target.value)}
                    required
                    placeholder="e.g., Hamburg, Los Angeles"
                  />
                  <FioriInput
                    label="Country of Origin"
                    value={formData.country_of_origin}
                    onChange={(e) => handleInputChange('country_of_origin', e.target.value)}
                    required
                  />
                  <FioriInput
                    label="Country of Destination"
                    value={formData.country_of_destination}
                    onChange={(e) => handleInputChange('country_of_destination', e.target.value)}
                    required
                  />
                  <FioriInput
                    label="Shipment Period Start"
                    type="date"
                    value={formData.shipment_period_start}
                    onChange={(e) => handleInputChange('shipment_period_start', e.target.value)}
                    required
                  />
                  <FioriInput
                    label="Shipment Period End"
                    type="date"
                    value={formData.shipment_period_end}
                    onChange={(e) => handleInputChange('shipment_period_end', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Quality Specifications */}
            {activeSection === 'quality' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29]">
                    Quality Specifications
                  </h3>
                  <FioriButton
                    variant="ghost"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={handleAddQualitySpec}
                  >
                    Add Specification
                  </FioriButton>
                </div>
                {formData.quality_specs.length === 0 ? (
                  <div className="text-center py-8 text-[var(--sapContent_LabelColor)]">
                    No quality specifications added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.quality_specs.map((spec, index) => (
                      <div key={index} className="border border-[var(--sapList_BorderColor)] rounded p-3">
                        <div className="grid grid-cols-6 gap-2">
                          <FioriInput
                            label="Parameter"
                            value={spec.parameter}
                            onChange={(e) => handleQualitySpecChange(index, 'parameter', e.target.value)}
                            placeholder="e.g., Al content"
                          />
                          <FioriInput
                            label="Min Value"
                            value={spec.min_value || ''}
                            onChange={(e) => handleQualitySpecChange(index, 'min_value', e.target.value)}
                            placeholder="Min"
                          />
                          <FioriInput
                            label="Max Value"
                            value={spec.max_value || ''}
                            onChange={(e) => handleQualitySpecChange(index, 'max_value', e.target.value)}
                            placeholder="Max"
                          />
                          <FioriInput
                            label="Typical"
                            value={spec.typical_value || ''}
                            onChange={(e) => handleQualitySpecChange(index, 'typical_value', e.target.value)}
                            placeholder="Typical"
                          />
                          <FioriInput
                            label="Unit"
                            value={spec.unit}
                            onChange={(e) => handleQualitySpecChange(index, 'unit', e.target.value)}
                            placeholder="%"
                          />
                          <div className="flex items-end">
                            <button
                              onClick={() => handleRemoveQualitySpec(index)}
                              className="h-8 px-2 text-[var(--sapNegativeColor)] hover:bg-[var(--sapErrorBackground)] rounded transition-colors"
                              type="button"
                              aria-label="Remover especificação"
                              title="Remover especificação"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Terms */}
            {activeSection === 'payment' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Payment Terms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FioriSelect
                    label="Payment Method"
                    value={formData.payment_method}
                    onChange={(e) => handleInputChange('payment_method', e.target.value)}
                    options={PAYMENT_METHODS.map((p) => ({ value: p, label: p }))}
                    required
                  />
                  <FioriInput
                    label="Credit Days"
                    type="number"
                    value={formData.credit_days.toString()}
                    onChange={(e) => handleInputChange('credit_days', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 30, 60, 90"
                  />
                  <div className="col-span-2">
                    <FioriInput
                      label="Payment Terms Details"
                      value={formData.payment_terms}
                      onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                      placeholder="e.g., 30% advance, 70% against BL copy"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Documentation */}
            {activeSection === 'documentation' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Required Documentation
                </h3>
                <div className="space-y-2">
                  {DOCUMENTS.map((doc) => (
                    <label
                      key={doc}
                      className="flex items-center gap-2 p-2 rounded hover:bg-[var(--sapList_HoverBackground)] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.required_documents.includes(doc)}
                        onChange={() => handleDocumentToggle(doc)}
                        className="w-4 h-4"
                      />
                      <span className="font-['72:Regular',sans-serif] text-sm text-[#131e29]">
                        {doc}
                      </span>
                    </label>
                  ))}
                </div>
                <FioriInput
                  label="Inspection Agency"
                  value={formData.inspection_agency || ''}
                  onChange={(e) => handleInputChange('inspection_agency', e.target.value)}
                  placeholder="e.g., SGS, Bureau Veritas"
                />
              </div>
            )}

            {/* Additional Terms */}
            {activeSection === 'additional' && (
              <div className="space-y-4">
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
                  Additional Terms
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif] mb-1">
                      Special Conditions
                    </label>
                    <textarea
                      value={formData.special_conditions || ''}
                      onChange={(e) => handleInputChange('special_conditions', e.target.value)}
                      className="w-full h-24 px-3 py-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)] resize-none"
                      placeholder="Any special contractual terms..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif] mb-1">
                      Internal Notes
                    </label>
                    <textarea
                      value={formData.internal_notes || ''}
                      onChange={(e) => handleInputChange('internal_notes', e.target.value)}
                      className="w-full h-24 px-3 py-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)] resize-none"
                      placeholder="Internal notes (not visible to customer)..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--sapList_BorderColor)] bg-[var(--sapList_Background)]">
          <FioriButton variant="ghost" onClick={onClose}>
            Cancel
          </FioriButton>
          <FioriButton variant="emphasized" icon={<Save className="w-4 h-4" />} onClick={handleSubmit}>
            Save Sales Order
          </FioriButton>
        </div>
      </div>
    </div>
  );
}
