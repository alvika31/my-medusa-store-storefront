import React from "react"
import Modal from "@modules/common/components/modal"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import NativeSelect from "@modules/common/components/native-select"
import Link from "next/link"

type WishlistItemAddProps = {
  isOpen: boolean
  close: () => void
  onSubmit: (data: any) => Promise<void>
  submitting: boolean
  errors: any
  wishlist: any
  register: any
  handleSubmit: any
}

const WishlistItemAdd: React.FC<WishlistItemAddProps> = ({
  isOpen,
  close,
  onSubmit,
  submitting,
  errors,
  wishlist,
  register,
  handleSubmit,
}) => {
  return (
    <Modal size="small" isOpen={isOpen} close={close}>
      <Modal.Title>Choose Wishlist</Modal.Title>

      <Modal.Body>
        <div className="grid grid-cols-1 gap-y-2">
          <form
            className="flex flex-col gap-y-5 mb-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <NativeSelect
              {...register("wishlist_name_id", {
                required: "Wishlist is required",
              })}
              required
              errors={errors}
            >
              {wishlist?.wishlist.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </NativeSelect>
            <Button disabled={submitting}>
              Save
              {submitting && <Spinner />}
            </Button>
          </form>
          <Link
            href="/account/wishlist"
            className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
          >
            <Button variant="secondary" className="font-semibold">
              Or Create WishlistName
            </Button>
          </Link>
        </div>
        {errors && (
          <div className="text-rose-500 text-small-regular py-2">{errors}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default WishlistItemAdd
