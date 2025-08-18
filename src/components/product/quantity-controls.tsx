"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Product } from "@/schemas/product";

interface QuantityControlsProps {
  product: Product;
  variant?: "default" | "compact";
  className?: string;
}

export default function QuantityControls({
  product,
  variant = "default",
  className = "",
}: QuantityControlsProps) {
  const { addItem, decreaseQuantity, getItemQuantity } = useCart();

  const quantity = getItemQuantity(product._id);

  const handleIncrease = () => {
    addItem(product);
  };

  const handleDecrease = () => {
    decreaseQuantity(product._id);
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={quantity === 0}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <Badge variant="secondary" className="min-w-[2rem] text-center">
          {quantity}
        </Badge>

        <Button variant="outline" size="sm" onClick={handleIncrease}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={quantity === 0}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex flex-col items-center">
        <span className="text-sm text-muted-foreground">Quantité</span>
        <Badge variant="secondary" className="min-w-[3rem] text-center">
          {quantity}
        </Badge>
      </div>

      <Button variant="outline" size="icon" onClick={handleIncrease}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
