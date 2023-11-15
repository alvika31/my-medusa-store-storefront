import AddressesTemplate from "@modules/account/templates/addresses-template"
import { Metadata } from "next"
import WishlistTemplate from "@modules/account/templates/wishlist-template"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your wishlist",
}

export default function Wishlist() {
  return <WishlistTemplate />
}
