"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Loader2 } from "lucide-react";
import { createProduct } from "../actions.server";
import type { ProductFormData } from "../types";

interface ProductFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function ProductForm({ onSuccess, redirectTo }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    inStock: true,
    stock: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCheckChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, inStock: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createProduct(formData);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else if (redirectTo) {
      window.location.href = redirectTo;
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <ErrorAlert
          title="Error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Name & Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="product-slug"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product description"
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="99.99"
            step="0.01"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="electronics"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          disabled={isLoading}
        />
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={handleCheckChange}
          disabled={isLoading}
        />
        <Label htmlFor="inStock" className="font-normal">
          In Stock
        </Label>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Product"
        )}
      </Button>
    </form>
  );
}
