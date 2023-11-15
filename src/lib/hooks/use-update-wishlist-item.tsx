import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { MEDUSA_BACKEND_URL } from "@lib/config"

export const useUpdateWishlistItem = ({ onSuccess, onError }: any) => {
  return useMutation({
    mutationFn: (payload: { id: string; quantity: number }) => {
      const response = axios.put(
        `${MEDUSA_BACKEND_URL}/store/wishlist-item/${payload?.id}`,
        {
          quantity: payload?.quantity,
        }
      )
      return response
    },
    onSuccess,
    onError,
  })
}
