import ProductForm from "../components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Add New Product
        </h1>
        <p className="text-text-muted mt-2">
          Upload a new neon sign to your catalog.
        </p>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-8">
        <ProductForm />
      </div>
    </div>
  );
}
