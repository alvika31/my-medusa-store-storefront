import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { MEDUSA_BACKEND_URL } from "@lib/config"

export const useUpdateWishlist = ({ onSuccess, onError }: any) => {
  return useMutation({
    mutationFn: (payload: any) => {
      const response = axios.put(
        `${MEDUSA_BACKEND_URL}/store/wishlist/${payload.id}`,
        payload
      )
      return response
    },
    onSuccess,
    onError,
  })
}
