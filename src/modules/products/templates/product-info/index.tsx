import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import ProductActions from "@modules/products/components/product-actions"
import React from "react"
import { Product } from "types/medusa"

type ProductInfoProps = {
  product: PricedProduct
  wishlist: any
  refetch: any
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  wishlist,
  refetch,
}) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
        <div>
          <ProductActions
            product={product}
            wishlist={wishlist}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
