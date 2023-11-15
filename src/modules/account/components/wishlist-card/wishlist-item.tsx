import Image from "next/image"
import Trash from "@modules/common/icons/trash"
import React, { useState } from "react"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import NativeSelect from "@modules/common/components/native-select"
import { useDeleteWishlistItem } from "@lib/hooks/use-delete-wishlist-item"
import { Disclosure } from "@headlessui/react"
import clsx from "clsx"
import { useUpdateWishlistItem } from "@lib/hooks/use-update-wishlist-item"
import { ProductVariant } from "@medusajs/medusa"

const WishlistItem = ({ wishlist, region, refetch }: any) => {
  const [isSuccess, setIsSuccess] = useState<
    { type: string; status: boolean } | undefined
  >(undefined)

  const { mutate: updateWishlist } = useUpdateWishlistItem({
    onSuccess: () => {
      refetch()
      setIsSuccess({ type: "success-update", status: true })
      setTimeout(() => {
        setIsSuccess({ type: "success-update", status: false })
      }, 2000)
    },
    onError: (error: any) => {
      console.log(error)
    },
  })

  const updateWishlistItem = async (payload: {
    id: string
    quantity: number
  }) => {
    const data = {
      id: payload.id,
      quantity: payload.quantity,
    }
    updateWishlist(data)
  }

  const { mutate: deleteWishlist } = useDeleteWishlistItem({
    onSuccess: () => {
      refetch()
      setIsSuccess({ type: "success-delete", status: true })
      setTimeout(() => {
        setIsSuccess({ type: "success-delete", status: false })
      }, 2000)
    },
  })

  const confirmDeleteWishlistItem = (wishlist_id: any) => {
    const shouldDelete = confirm("Are You Sure")
    if (shouldDelete) {
      deleteWishlist(wishlist_id)
    }
  }
  return (
    <div className="my-3">
      {isSuccess?.status && (
        <Disclosure>
          <Disclosure.Panel
            static
            className={clsx(
              "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
              {
                "max-h-[1000px] opacity-100": isSuccess,
                "max-h-0 opacity-0": !isSuccess,
              }
            )}
          >
            <div className="bg-green-100 text-green-500 p-4 my-4">
              <span>
                {isSuccess?.type === "success-delete" &&
                  "Wishlist item deleted succesfully"}
              </span>
              <span>
                {isSuccess?.type === "success-update" &&
                  "Wishlist item updated succesfully"}
              </span>
            </div>
          </Disclosure.Panel>
        </Disclosure>
      )}
      <p className="text-base-regular font-medium mt-2">Item Wishlist: </p>

      {wishlist.map(
        (item: {
          products: (number | string)[]
          id: string
          title: string
          variant: any
          thumbnail: string
          quantity: number
        }) => (
          <div key={item.id}>
            <div className="flex gap-x-3 mt-4 justify-between">
              <div className="flex gap-x-3">
                <Image
                  src={item?.thumbnail}
                  width={100}
                  height={100}
                  alt={item?.title}
                  sizes=""
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-medium">{item?.title}</p>
                    <LineItemOptions variant={item?.variant} />
                  </div>
                  <button
                    className="text-small-regular text-gray-700 flex items-center gap-x-2"
                    onClick={() => confirmDeleteWishlistItem(item.id)}
                  >
                    <Trash />
                    Remove
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                {item.quantity === 0 ? (
                  <div className="bg-red-200 text-red-500 p-2 text-xs rounded">
                    Sold Out
                  </div>
                ) : (
                  <NativeSelect
                    value={item.quantity}
                    onChange={(value) =>
                      updateWishlistItem({
                        id: item.id,
                        quantity: parseInt(value.target.value),
                      })
                    }
                    className="max-h-[35px] w-[75px]"
                  >
                    {Array.from(
                      [
                        ...Array(
                          item.variant.inventory_quantity > 0
                            ? item.variant.inventory_quantity
                            : 10
                        ),
                      ].keys()
                    )
                      .slice(0, 10)
                      .map((i) => {
                        const value = i + 1
                        return (
                          <option value={value} key={i}>
                            {value}
                          </option>
                        )
                      })}
                  </NativeSelect>
                )}

                <LineItemPrice item={item} region={region} />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default WishlistItem
