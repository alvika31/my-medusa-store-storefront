import { useQuery } from "@tanstack/react-query"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import axios from "axios"

export const useWishlistItemByVariant = (variant_id: string) => {
  return useQuery(["wishlistItem"], {
    queryFn: async () => {
      const wishlistItemResponse = await axios.get(
        `${MEDUSA_BACKEND_URL}/store/wishlist-item/variant/${variant_id}`
      )
      return wishlistItemResponse
    },
  })
}
