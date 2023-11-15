import { useQuery } from "@tanstack/react-query"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import axios from "axios"
import { Customer } from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"

export const useCreateWishlistItem = ({
  onSuccess,
  onError,
  wishlistNameId,
}: any) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        `${MEDUSA_BACKEND_URL}/store/wishlist/${wishlistNameId}/wishlist-item`,
        payload
      )
      return response
    },
    onSuccess,
    onError,
  })
}
