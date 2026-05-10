"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Loader2, CheckCircle, ImageIcon } from "lucide-react";
import Image from "next/image";

interface CategoryThumb {
  id: string;
  slug: string;
  label: string;
  image_url: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  cafe:        "#FF9500",
  aesthetic:   "#BF5FFF",
  love:        "#FF007A",
  wings:       "#00F0FF",
  gaming:      "#4D7CFF",
  cars:        "#FF4500",
  "under-4000":"#36F4A4",
};

export default function CategoryThumbnailsPage() {
  const [categories, setCategories] = useState<CategoryThumb[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("category_thumbnails")
        .select("id, slug, label, image_url")
        .order("slug");
      if (data) setCategories(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleFileChange = async (slug: string, file: File) => {
    setUploading(slug);
    try {
      const ext = file.name.split(".").pop();
      const path = `category-images/${slug}.${ext}`;

      // Upload (upsert) to Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from("products")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("products").getPublicUrl(path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`; // cache-bust

      // Update DB
      const { error: dbErr } = await supabase
        .from("category_thumbnails")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("slug", slug);

      if (dbErr) throw dbErr;

      setCategories((prev) =>
        prev.map((c) => (c.slug === slug ? { ...c, image_url: publicUrl } : c))
      );
      setSaved(slug);
      setTimeout(() => setSaved(null), 3000);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = async (slug: string) => {
    if (!confirm("Remove this thumbnail? The category will fall back to a product image.")) return;
    await supabase.from("category_thumbnails").update({ image_url: null }).eq("slug", slug);
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, image_url: null } : c)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-8">
        <p className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Category Thumbnails</h1>
        <p className="text-text-muted text-sm mt-1">
          Upload a cover image for each category. These appear in the Categories carousel on the homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const color = CATEGORY_COLORS[cat.slug] ?? "#C6FF00";
          const isUploading = uploading === cat.slug;
          const isSaved = saved === cat.slug;

          return (
            <div key={cat.slug} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {/* Thumbnail Preview */}
              <div className="relative aspect-[4/5] bg-surface">
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.label} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{ background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 70%)` }}>
                    <ImageIcon className="w-8 h-8" style={{ color }} />
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color }}>No Image</span>
                  </div>
                )}

                {/* Category label pill overlay */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{ color, borderColor: `${color}40`, backgroundColor: `${color}18` }}>
                  {cat.label}
                </div>

                {/* Uploading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}

                {/* Saved indicator */}
                {isSaved && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle className="w-8 h-8 text-primary" />
                      <span className="text-xs font-black text-primary">Saved!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                {/* Upload button */}
                <label className="relative flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary">
                  <Upload className="w-3.5 h-3.5" />
                  {cat.image_url ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    ref={(el) => { fileRefs.current[cat.slug] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(cat.slug, file);
                      e.target.value = "";
                    }}
                    disabled={isUploading}
                  />
                </label>

                {/* Remove button */}
                {cat.image_url && (
                  <button
                    onClick={() => handleRemove(cat.slug)}
                    disabled={isUploading}
                    className="w-full py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-red-400 hover:border-red-400/20 transition-all"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
