"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2 } from "lucide-react";

interface ProductData {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  description: string;
  badge: string | null;
  in_stock: boolean;
  image_url: string | null;
  images: string[] | null;
  addons: any[] | null;
  variants: {
    regular: { dimensions: string; price: number; original_price?: number | null };
    medium: { dimensions: string; price: number; original_price?: number | null };
    large: { dimensions: string; price: number; original_price?: number | null };
  } | null;
}

interface ProductFormProps {
  product?: ProductData;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(product?.title ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  // price is derived from regPrice — no separate state needed
  const [description, setDescription] = useState(product?.description ?? "");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [inStock, setInStock] = useState(product?.in_stock ?? true);

  // Multi-image state
  const [images, setImages] = useState<string[]>(product?.images ?? (product?.image_url ? [product.image_url] : []));
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Variants state
  const [regLength, setRegLength] = useState(product?.variants?.regular?.dimensions?.split('x')[0]?.replace('"', '') ?? "14");
  const [regWidth, setRegWidth] = useState(product?.variants?.regular?.dimensions?.split('x')[1]?.replace('"', '') ?? "12");
  const [regPrice, setRegPrice] = useState(product?.variants?.regular?.price?.toString() ?? product?.price?.toString() ?? "");
  const [regOriginalPrice, setRegOriginalPrice] = useState(product?.variants?.regular?.original_price?.toString() ?? "");
  const [medLength, setMedLength] = useState(product?.variants?.medium?.dimensions?.split('x')[0]?.replace('"', '') ?? "20");
  const [medWidth, setMedWidth] = useState(product?.variants?.medium?.dimensions?.split('x')[1]?.replace('"', '') ?? "16");
  const [medPrice, setMedPrice] = useState(product?.variants?.medium?.price?.toString() ?? "");
  const [medOriginalPrice, setMedOriginalPrice] = useState(product?.variants?.medium?.original_price?.toString() ?? "");
  const [lrgLength, setLrgLength] = useState(product?.variants?.large?.dimensions?.split('x')[0]?.replace('"', '') ?? "28");
  const [lrgWidth, setLrgWidth] = useState(product?.variants?.large?.dimensions?.split('x')[1]?.replace('"', '') ?? "22");
  const [lrgPrice, setLrgPrice] = useState(product?.variants?.large?.price?.toString() ?? "");
  const [lrgOriginalPrice, setLrgOriginalPrice] = useState(product?.variants?.large?.original_price?.toString() ?? "");

  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewImageFiles(prev => [...prev, ...files]);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    const newImages = [...images];
    const [primary] = newImages.splice(index, 1);
    setImages([primary, ...newImages]);
  };

  const removeExistingImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [...images];

      // Upload new images
      for (const file of newImageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message || JSON.stringify(uploadError)}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);
        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // Derive top-level price & original_price from the Regular variant
      const topPrice = parseFloat(regPrice) || 0;
      const topOriginalPrice = regOriginalPrice ? parseFloat(regOriginalPrice) : null;

      const payload = {
        title,
        slug: generateSlug(title),
        category,
        price: topPrice,
        original_price: topOriginalPrice,
        description: description.slice(0, 300),
        badge: badge || null,
        in_stock: inStock,
        image_url: uploadedUrls[0] || null,
        images: uploadedUrls,
        variants: {
          regular: { dimensions: `${regLength}" x ${regWidth}"`, price: topPrice, original_price: topOriginalPrice },
          medium: { dimensions: `${medLength}" x ${medWidth}"`, price: parseFloat(medPrice) || 0, original_price: medOriginalPrice ? parseFloat(medOriginalPrice) : null },
          large: { dimensions: `${lrgLength}" x ${lrgWidth}"`, price: parseFloat(lrgPrice) || 0, original_price: lrgOriginalPrice ? parseFloat(lrgOriginalPrice) : null },
        },
      };

      if (isEditing) {
        const { error: dbError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("products")
          .insert({ ...payload, features: ["Handcrafted", "Energy Efficient LED", "Easy Installation"] });
        if (dbError) throw dbError;
      }

      router.refresh();
      router.push("/admin/products");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      {/* Multi-Image Upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
          Product Gallery ({images.length + newImageFiles.length} images)
          <span className="text-text-muted/50 font-normal normal-case ml-2">(First image is primary)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {/* Existing Images */}
          {images.map((url, idx) => (
            <div key={`existing-${idx}`} className={`aspect-square bg-black border-2 rounded-xl relative group overflow-hidden ${idx === 0 ? "border-primary" : "border-white/10"}`}>
              <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute top-1 left-1 bg-primary text-black text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                {idx === 0 ? "Primary" : `#${idx + 1}`}
              </div>
              <button
                type="button"
                onClick={() => removeExistingImage(idx)}
                className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3 h-3" />
              </button>
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimaryImage(idx)}
                  className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[8px] font-black uppercase py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-black"
                >
                  Set Primary
                </button>
              )}
            </div>
          ))}
          
          {/* New Image Previews */}
          {newImageFiles.map((file, idx) => (
            <div key={`new-${idx}`} className="aspect-square bg-black border border-white/10 rounded-xl relative group overflow-hidden">
              <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[8px] text-black font-black uppercase text-center py-0.5">New</div>
            </div>
          ))}

          {/* Upload Button */}
          <div className="aspect-square bg-black border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-text-muted mb-1" />
            <span className="text-[9px] font-mono text-text-muted uppercase">Add Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
            Title <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. Porsche GT3"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
            Category <span className="text-primary">*</span>
          </label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a category...</option>
            <option value="Cars">Cars</option>
            <option value="F1">F1</option>
            <option value="Wings">Wings</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Custom">Custom (Other)</option>
          </select>
        </div>




        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted">
              Description
            </label>
            <span className={`text-[10px] font-mono ${description.length > 250 ? 'text-accent-pink' : 'text-text-muted'}`}>
              {description.length}/300
            </span>
          </div>
          <textarea
            rows={4}
            maxLength={300}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none text-sm leading-relaxed"
            placeholder="Describe the neon sign (max 300 characters)..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
            Badge (Optional)
          </label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. BEST SELLER, NEW"
          />
        </div>

        <div className="flex items-center mt-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${inStock ? "bg-primary" : "bg-white/10"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${inStock ? "transform translate-x-4" : ""}`}></div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">In Stock</span>
          </label>
        </div>
      </div>

      {/* Sizing & Pricing Section */}
      <div className="pt-8 border-t border-white/5">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">Sizing & Pricing Variants</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Regular */}
          <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Regular Size</span>
              <span className="text-[10px] font-mono text-primary">Fixed Name</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Dimensions</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={regLength}
                    onChange={(e) => setRegLength(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center"
                    placeholder="14"
                  />
                </div>
                <span className="text-white/60 font-bold text-sm">x</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={regWidth}
                    onChange={(e) => setRegWidth(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center"
                    placeholder="12"
                  />
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-text-muted">
                <span>Length</span>
                <span>Width</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={regPrice}
                onChange={(e) => setRegPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Regular price"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                value={regOriginalPrice}
                onChange={(e) => setRegOriginalPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Leave empty if no discount"
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Medium Size</span>
              <span className="text-[10px] font-mono text-primary">Fixed Name</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Dimensions</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={medLength}
                    onChange={(e) => setMedLength(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center"
                    placeholder="20"
                  />
                </div>
                <span className="text-white/60 font-bold text-sm">x</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={medWidth}
                    onChange={(e) => setMedWidth(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center"
                    placeholder="16"
                  />
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-text-muted">
                <span>Length</span>
                <span>Width</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={medPrice}
                onChange={(e) => setMedPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Medium price"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                value={medOriginalPrice}
                onChange={(e) => setMedOriginalPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Leave empty if no discount"
              />
            </div>
          </div>

          {/* Large */}
          <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Large Size</span>
              <span className="text-[10px] font-mono text-primary">Fixed Name</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Dimensions</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={lrgLength}
                    onChange={(e) => setLrgLength(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center"
                    placeholder="28"
                  />
                </div>
                <span className="text-white/60 font-bold text-sm">x</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={lrgWidth}
                    onChange={(e) => setLrgWidth(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center"
                    placeholder="22"
                  />
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-text-muted">
                <span>Length</span>
                <span>Width</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={lrgPrice}
                onChange={(e) => setLrgPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Large price"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Original Price (₹)</label>
              <input
                type="number"
                value={lrgOriginalPrice}
                onChange={(e) => setLrgOriginalPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Leave empty if no discount"
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[10px] font-mono text-text-muted italic">* The top-level price is automatically synced from the Regular Size price on save.</p>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm text-text-muted hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Save Product"
          )}
        </button>
      </div>
    </form>
  );
}
