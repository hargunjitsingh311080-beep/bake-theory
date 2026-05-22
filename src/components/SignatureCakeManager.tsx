import React, { useState } from 'react';
import { SignatureCake } from './types';
import { X, Image as ImageIcon, Save, Trash2, Plus } from 'lucide-react';

interface Props {
  cake: SignatureCake | null;
  onSave: (cake: SignatureCake) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export const SignatureCakeManager: React.FC<Props> = ({ cake, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState<SignatureCake>(cake || {
    id: `SC-${Date.now()}`,
    name: '',
    description: '',
    image: '',
    baseSize: 1.0,
    baseTiers: 1,
    baseShape: 'round',
    baseFlavor: 'Classic Vanilla Bean',
    baseFrosting: 'Silky Buttercream',
    baseFilling: 'none',
    baseToppings: [],
    baseColor: '#FFFFFF',
    tags: [],
    price: 1500
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'baseSize' || name === 'baseTiers' ? Number(value) : value
    }));
  };

  const handleToppingsChange = (topping: string) => {
    setFormData(prev => ({
      ...prev,
      baseToppings: prev.baseToppings.includes(topping) 
        ? prev.baseToppings.filter(t => t !== topping)
        : [...prev.baseToppings, topping]
    }));
  };

  const handleTagsChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {isNew ? 'Add New Signature Cake' : 'Edit Signature Cake'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cake House Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. Midnight Truffle"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image (URL or Local Upload)</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="image" 
                      value={formData.image} 
                      onChange={handleChange} 
                      className="flex-1 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <label className="shrink-0 flex items-center justify-center w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors" title="Upload from device">
                      <ImageIcon className="w-6 h-6" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, image: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                {formData.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 h-40 relative group">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs font-bold">Image Preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none h-32 resize-none"
                  placeholder="Tell clients about this masterpiece..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Base Size (kg)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    name="baseSize" 
                    value={formData.baseSize} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-xl p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tiers</label>
                  <select name="baseTiers" value={formData.baseTiers} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3">
                    <option value={1}>1 Tier</option>
                    <option value={2}>2 Tiers</option>
                    <option value={3}>3 Tiers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Base Configurations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">FLAVOR</label>
                <input type="text" name="baseFlavor" value={formData.baseFlavor} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">FROSTING</label>
                <input type="text" name="baseFrosting" value={formData.baseFrosting} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">FILLING</label>
                <input type="text" name="baseFilling" value={formData.baseFilling} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 hover:bg-amber-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isNew ? 'Create Cake' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
