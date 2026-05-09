"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, TicketPercent } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  is_first_order_only: boolean;
  created_at?: string;
};

const emptyForm = {
  code: "",
  type: "percentage" as "percentage" | "fixed",
  value: "",
  minOrder: "",
  maxDiscount: "",
  usageLimit: "",
  startsAt: "",
  endsAt: "",
  active: true,
  isFirstOrderOnly: false,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadCoupons = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
      setCoupons([]);
    } else {
      setCoupons((data || []) as Coupon[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const canSubmit = useMemo(() => {
    return form.code.trim().length >= 3 && Number(form.value) > 0;
  }, [form.code, form.value]);

  const createOrUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      min_order_amount: form.minOrder ? Number(form.minOrder) : null,
      max_discount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usage_limit: form.usageLimit ? Number(form.usageLimit) : null,
      starts_at: form.startsAt || null,
      ends_at: form.endsAt || null,
      active: form.active,
      is_first_order_only: form.isFirstOrderOnly,
    };

    const { error: upsertError } = await supabase
      .from("coupons")
      .upsert(payload, { onConflict: "code" });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setForm(emptyForm);
      await loadCoupons();
    }
    setSaving(false);
  };

  const toggleCoupon = async (coupon: Coupon) => {
    const { error: updateError } = await supabase
      .from("coupons")
      .update({ active: !coupon.active })
      .eq("id", coupon.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await loadCoupons();
  };

  const deleteCoupon = async (coupon: Coupon) => {
    const ok = window.confirm(`Delete coupon ${coupon.code}?`);
    if (!ok) return;
    const { error: deleteError } = await supabase.from("coupons").delete().eq("id", coupon.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await loadCoupons();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Coupon Management</h1>
        <p className="text-text-muted text-sm">Create, update, and manage promo coupons for checkout.</p>
      </div>

      <form onSubmit={createOrUpdateCoupon} className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <TicketPercent className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-widest">Create or Update Coupon</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Code (e.g. FIRSTSIGN)"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm uppercase"
          />
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percentage" | "fixed" }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input
            type="number"
            min="1"
            placeholder={form.type === "percentage" ? "Value (e.g. 20)" : "Value in INR"}
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          />

          <input
            type="number"
            min="0"
            placeholder="Min order amount (optional)"
            value={form.minOrder}
            onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Max discount (optional)"
            value={form.maxDiscount}
            onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Usage limit (optional)"
            value={form.usageLimit}
            onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          />

          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
          <label className="flex items-center gap-2 px-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Active
          </label>
          <label className="flex items-center gap-2 px-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={form.isFirstOrderOnly}
              onChange={(e) => setForm((f) => ({ ...f, isFirstOrderOnly: e.target.checked }))}
            />
            First Order Only
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving || !canSubmit}
          className="bg-primary text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Coupon"}
        </button>
      </form>

      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest">Existing Coupons</h3>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-text-muted text-sm">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="px-6 py-8 text-text-muted text-sm">No coupons found.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="font-black tracking-wider">{coupon.code}</p>
                  <p className="text-xs text-text-muted">
                    {coupon.type === "percentage" ? `${coupon.value}% OFF` : `INR ${coupon.value} OFF`}
                    {coupon.min_order_amount ? ` | Min INR ${coupon.min_order_amount}` : ""}
                    {coupon.max_discount ? ` | Max INR ${coupon.max_discount}` : ""}
                    {coupon.usage_limit ? ` | Limit ${coupon.usage_limit}` : ""}
                    {coupon.used_count ? ` | Used ${coupon.used_count}` : ""}
                    {coupon.is_first_order_only && (
                      <span className="ml-2 text-[10px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">First Order Only</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCoupon(coupon)}
                    className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${
                      coupon.active ? "bg-accent-mint/15 text-accent-mint" : "bg-white/10 text-white"
                    }`}
                  >
                    {coupon.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon)}
                    className="px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-red-500/10 text-red-500 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

