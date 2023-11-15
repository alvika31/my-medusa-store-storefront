import { useQuery } from "@tanstack/react-query"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import axios from "axios"
import { Customer } from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"

export const useCreateWishlistName = ({ onSuccess, onError }: any) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        `${MEDUSA_BACKEND_URL}/store/wishlist`,
        payload
      )
      return response
    },
    onSuccess,
    onError,
  })
}
