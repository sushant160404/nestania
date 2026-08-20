import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, Plus, X } from 'lucide-react';
import { Product } from '../../types';

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  subtitle: '',
  sku: '',
  category: 'Dinnerware',
  subcategory: '',
  materialCategory: 'Ceramic',
  colorFamily: '',
  colorHex: '#FFFFFF',
  patternType: '',
  occasionType: '',
  price: 0,
  originalPrice: 0,
  rating: 5,
  reviewsCount: 0,
  isNew: false,
  isBestSeller: false,
  isSale: false,
  image: '',
  galleryImages: [],
  description: '',
  finish: '',
  microwaveSafe: false,
  dishwasherSafe: false,
  chipResistant: false,
  features: [],
  details: { material: '', dimensions: '', care: '', setIncludes: '' },
  inStock: true,
  stockCount: 0,
  tags: [],
};

const CATEGORIES = ['Dinnerware', 'Serveware', 'Drinkware', 'Home Decor', 'Kitchen', 'Gifting'];

interface Props {
  productId?: string | null;
  onBack: () => void;
  onSaved: () => void;
}

export const ProductFormPage: React.FC<Props> = ({ productId, onBack, onSaved }) => {
  const isEdit = !!productId;
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then(r => r.json())
      .then((p: Product) => {
        const { id, ...rest } = p;
        setForm(rest);
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleDetailChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, details: { ...prev.details, [field]: value } }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.category) {
      setError('Name, price, and category are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      }
      onSaved();
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-[#E3DCCE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5A36]/30';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-[#8A5A36] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-[#E3DCCE] text-[#7A6A5E] hover:bg-[#FAF8F5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#2D2723]">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-sm text-[#7A6A5E] mt-0.5">{isEdit ? 'Update product details' : 'Fill in the details for the new product'}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E3DCCE] p-6 space-y-6">
        {/* Name / Subtitle / SKU */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Product Name *</label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} className={inputCls} placeholder="e.g. Ivory Bloom Dinner Set" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Subtitle</label>
            <input type="text" value={form.subtitle || ''} onChange={e => handleChange('subtitle', e.target.value)} className={inputCls} placeholder="(16 Pieces)" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">SKU</label>
            <input type="text" value={form.sku || ''} onChange={e => handleChange('sku', e.target.value)} className={inputCls} placeholder="DIN-IB-16P" />
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Category *</label>
            <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={inputCls + ' bg-white'}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Subcategory</label>
            <input type="text" value={form.subcategory || ''} onChange={e => handleChange('subcategory', e.target.value)} className={inputCls} placeholder="Dinner Sets" />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Price (₹) *</label>
            <input type="number" min="0" value={form.price} onChange={e => handleChange('price', Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Original Price (₹)</label>
            <input type="number" min="0" value={form.originalPrice || ''} onChange={e => handleChange('originalPrice', Number(e.target.value))} className={inputCls} />
          </div>
        </div>

        {/* Stock + Flags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Stock Count</label>
            <input
              type="number" min="0" value={form.stockCount}
              onChange={e => { const v = Number(e.target.value); handleChange('stockCount', v); handleChange('inStock', v > 0); }}
              className={inputCls}
            />
          </div>
          <div className="flex items-end gap-4 pb-1">
            {([['inStock', 'In Stock'], ['isNew', 'New'], ['isBestSeller', 'Best Seller']] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={!!(form as any)[key]} onChange={e => handleChange(key, e.target.checked)} className="w-4 h-4 accent-[#8A5A36]" />
                <span className="text-xs text-[#4A3E38]">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images - Compact UI */}
        <div className="space-y-4">
          {/* Featured Image */}
          <div>
            <h3 className="text-sm font-semibold text-[#2D2723] mb-3">Product Image</h3>
            <div>
              <label className="block text-xs text-[#7A6A5E] mb-2">Featured Image</label>
              <div className="border border-[#E3DCCE] rounded-lg p-3 bg-[#FAFAFA] hover:bg-[#F5F2EC] transition-colors">
                {form.image ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="Featured product"
                        className="w-12 h-12 object-cover rounded border border-[#E3DCCE]"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('image', '')}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#7A6A5E] mb-2">Click to change image</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById('featured-image-input')?.click()}
                          className="px-2 py-1 text-xs bg-[#8A5A36] text-white rounded hover:bg-[#7A4E2D] transition-colors"
                        >
                          📤 Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter image URL:');
                            if (url) handleChange('image', url);
                          }}
                          className="px-2 py-1 text-xs bg-white text-[#8A5A36] border border-[#8A5A36] rounded hover:bg-[#FAF8F5] transition-colors"
                        >
                          🌐 URL
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => document.getElementById('featured-image-input')?.click()}>
                    <div className="w-12 h-12 bg-[#E3DCCE] rounded flex items-center justify-center">
                      <div className="w-4 h-4 text-[#8A5A36]">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#7A6A5E] mb-2">Add featured image</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-[#8A5A36] text-white rounded hover:bg-[#7A4E2D] transition-colors"
                        >
                          📤 Upload
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = prompt('Enter image URL:');
                            if (url) handleChange('image', url);
                          }}
                          className="px-2 py-1 text-xs bg-white text-[#8A5A36] border border-[#8A5A36] rounded hover:bg-[#FAF8F5] transition-colors"
                        >
                          🌐 URL
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  id="featured-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const response = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        const result = await response.json();
                        if (result.success) {
                          handleChange('image', result.url);
                        }
                      } catch (error) {
                        setError('Upload failed');
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Gallery */}
          <div>
            <h3 className="text-sm font-semibold text-[#2D2723] mb-3">Product Gallery</h3>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, idx) => {
                const hasImage = form.galleryImages[idx];
                return (
                  <div key={idx}>
                    <label className="block text-xs text-[#7A6A5E] mb-1">Gallery Image {idx + 1}</label>
                    <div className="w-16 h-16 border border-[#E3DCCE] rounded bg-[#FAFAFA] hover:bg-[#F5F2EC] transition-colors relative overflow-hidden">
                      {hasImage ? (
                        <div className="w-full h-full relative group">
                          <img
                            src={hasImage}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...form.galleryImages];
                              newImages[idx] = '';
                              handleChange('galleryImages', newImages.filter(Boolean));
                            }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-2 h-2" />
                          </button>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => document.getElementById(`gallery-${idx}-input`)?.click()}
                              className="text-xs text-white hover:underline"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => document.getElementById(`gallery-${idx}-input`)?.click()}>
                          <div className="w-3 h-3 text-[#8A5A36]">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                      <input
                        id={`gallery-${idx}-input`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const response = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              const result = await response.json();
                              if (result.success) {
                                const newImages = [...form.galleryImages];
                                newImages[idx] = result.url;
                                handleChange('galleryImages', newImages);
                              }
                            } catch (error) {
                              setError('Upload failed');
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Description</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} />
        </div>

        {/* Product Details */}
        <div>
          <p className="text-xs font-semibold text-[#7A6A5E] mb-2">Product Details</p>
          <div className="grid grid-cols-2 gap-3">
            {(['material', 'dimensions', 'care', 'setIncludes'] as const).map(f => (
              <div key={f}>
                <label className="block text-xs text-[#7A6A5E] mb-1">{f === 'setIncludes' ? 'Set Includes' : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input type="text" value={(form.details as any)[f] || ''} onChange={e => handleDetailChange(f, e.target.value)} className={inputCls} />
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-[#7A6A5E] mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={form.tags.join(', ')}
            onChange={e => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            className={inputCls}
            placeholder="Dinnerware, Ceramic, Floral"
          />
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button onClick={onBack} className="px-5 py-2.5 text-sm text-[#7A6A5E] hover:bg-[#FAF8F5] rounded-lg border border-[#E3DCCE] transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#8A5A36] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#7A4E2D] disabled:opacity-60 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

export default ProductFormPage;
