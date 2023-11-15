import { useProductActions } from "@lib/context/product-context"
import useProductPrice from "@lib/hooks/use-product-price"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Button from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/option-select"
import clsx from "clsx"
import Link from "next/link"
import React, { useMemo } from "react"
import { useMeCustomer } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useToggleState from "@lib/hooks/use-toggle-state"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import WishlistItemAdd from "../wishlist-item-add"
import { useWishlistItemByVariant } from "@lib/hooks/use-wishlist-item-by-variant"

type ProductActionsProps = {
  product: PricedProduct
  wishlist: any
  refetch: any
}

interface FormValues {
  wishlist_name_id: string
}
const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  wishlist,
  refetch,
}) => {
  const { updateOptions, addToCart, options, inStock, variant } =
    useProductActions()
  const { customer } = useMeCustomer()
  const [error, setError] = useState<string | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const price = useProductPrice({ id: product.id!, variantId: variant?.id })
  const { state, open, close } = useToggleState(false)
  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const addtoWishlistItem = () => {
    if (!customer) {
      return alert("You Must Login!")
    } else if (!variant) {
      return alert("You Must Select Variant!")
    } else {
      refetch()
      open()
    }
  }

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const wishlistNameId = data.wishlist_name_id
      let quantity = 1
      let original_total = variant?.prices[0].amount
      let sub_total = variant?.prices[0].amount
      let total = variant?.prices[0].amount
      if (!inStock) {
        quantity = 0
        original_total = 0
        sub_total = 0
        total = 0
      }
      const payload = {
        product_id: product.id,
        title: product.title,
        description: variant?.title,
        quantity: quantity,
        thumbnail: product.thumbnail,
        original_total: original_total,
        sub_total: sub_total,
        total: total,
        unit_price: variant?.prices[0].amount,
        variant_id: variant?.id,
      }

      const newVariantID = payload.variant_id

      const responseWishlistItem = await axios.get(
        `${MEDUSA_BACKEND_URL}/store/wishlist-item/variant/${newVariantID}`
      )

      const wishlistItem = responseWishlistItem?.data?.wishlistItem
      let wishlistItem_id: string | undefined
      let wishlistItem_quantity: number | undefined
      let wishlistNameIdCek: string | undefined
      wishlistItem.map((item: any) => {
        wishlistItem_id = item.id
        wishlistItem_quantity = item?.quantity
        wishlistNameIdCek = item?.wishlist_name_id
      })

      if (wishlistNameId === wishlistNameIdCek) {
        let quantity = (wishlistItem_quantity || 0) + 1
        if (!inStock) {
          quantity = 0
        }
        const response = await axios.put(
          `${MEDUSA_BACKEND_URL}/store/wishlist-item/${wishlistItem_id}`,
          {
            quantity: quantity,
          }
        )
        return response
      } else {
        const response = await axios.post(
          `${MEDUSA_BACKEND_URL}/store/wishlist/${wishlistNameId}/wishlist-item`,
          payload
        )
        return response
      }
    },
    onSuccess: () => {
      reset()
      refetch()
      close()
      alert("product successfully added to wishlist")
      setSubmitting(false)
    },
    onError: (error) => {
      alert("failed product added to wishlist")
      console.log(error)
    },
  })

  const onSubmit = async (data: any) => {
    mutate(data)
  }

  return (
    <div className="flex flex-col gap-y-2">
      {product.collection && (
        <Link
          href={`/collections/${product.collection.handle}`}
          className="text-small-regular text-gray-700"
        >
          {product.collection.title}
        </Link>
      )}
      <h3 className="text-xl-regular">{product.title}</h3>

      <p className="text-base-regular">{product.description}</p>

      {product.variants.length > 1 && (
        <div className="my-8 flex flex-col gap-y-6">
          {(product.options || []).map((option) => {
            return (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={updateOptions}
                  title={option.title}
                />
              </div>
            )
          })}
        </div>
      )}

      <div className="mb-4">
        {selectedPrice ? (
          <div className="flex flex-col text-gray-700">
            <span
              className={clsx("text-xl-semi", {
                "text-rose-600": selectedPrice.price_type === "sale",
              })}
            >
              {selectedPrice.calculated_price}
            </span>
            {selectedPrice.price_type === "sale" && (
              <>
                <p>
                  <span className="text-gray-500">Original: </span>
                  <span className="line-through">
                    {selectedPrice.original_price}
                  </span>
                </p>
                <span className="text-rose-600">
                  -{selectedPrice.percentage_diff}%
                </span>
              </>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <Button onClick={addToCart}>
        {!inStock ? "Out of stock" : "Add to cart"}
      </Button>

      <Button variant="secondary" onClick={() => addtoWishlistItem()}>
        Add to Wishlist
      </Button>
      <WishlistItemAdd
        isOpen={state}
        close={close}
        onSubmit={onSubmit}
        submitting={submitting}
        errors={error}
        wishlist={wishlist}
        register={register}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default ProductActions
