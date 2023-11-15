import { useQuery } from "@tanstack/react-query"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import axios from "axios"

export const useFetchWishlist = (customer_id: any) => {
  return useQuery(["wishlist"], {
    queryFn: async () => {
      const wishlistResponse = await axios.get(
        `${MEDUSA_BACKEND_URL}/store/wishlist/customer/${customer_id}`
      )
      return wishlistResponse.data
    },
  })
}
