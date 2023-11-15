import Trash from "@modules/common/icons/trash"
import Edit from "@modules/common/icons/edit"
import Package from "@modules/common/icons/package"
import { useDeleteWishlist } from "@lib/hooks/use-delete-wishlist"
import { useState } from "react"
import { Disclosure } from "@headlessui/react"
import clsx from "clsx"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useForm } from "react-hook-form"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import WishlistItem from "./wishlist-item"
import Link from "next/link"
import { useUpdateWishlist } from "@lib/hooks/use-update-wishlist"
import { formatAmount } from "medusa-react"

type FormValues = {
  title: string
}
const defaultFormValues = {
  title: undefined,
}
const WishlistCard = ({ wishlist, refetch }: any) => {
  const [isSuccess, setIsSuccess] = useState<
    { type: string; status: boolean } | undefined
  >(undefined)
  const { state, open, close } = useToggleState(false)
  const [id, setId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  })

  const onEditClik = (item: any) => {
    setValue("title", item.title || undefined)
    setId(item.id)
    open()
  }

  const { mutate: updateWishlist } = useUpdateWishlist({
    onSuccess: () => {
      setSubmitting(false)
      refetch()
      close()
      setIsSuccess({ type: "success-update", status: true })
      setTimeout(() => {
        setIsSuccess({ type: "success-update", status: false })
      }, 2000)
    },
    onError: (error: any) => {
      setSubmitting(false)
      setError("Failed to update wishlist, please try again.")
      console.log(error)
    },
  })

  const submit = handleSubmit(async (data: FormValues) => {
    setSubmitting(true)
    setError(undefined)

    const payload = {
      title: data.title,
      id: id,
    }

    updateWishlist(payload)
  })

  const { mutate: deleteWishlist } = useDeleteWishlist({
    onSuccess: () => {
      refetch()
      setIsSuccess({ type: "success-delete", status: true })
      setTimeout(() => {
        setIsSuccess({ type: "success-delete", status: false })
      }, 2000)
    },
  })

  const confirmDeleteWishlist = (wishlist_id: any) => {
    const shouldDelete = confirm("Are You Sure")
    if (shouldDelete) {
      deleteWishlist(wishlist_id)
    }
  }

  return (
    <>
      {wishlist?.wishlist.length === 0 && (
        <div className="bg-red-200 text-red-500 p-3 rounded">
          Wishlist Is Empty
        </div>
      )}
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
                  "Wishlist deleted succesfully"}
              </span>
              <span>
                {isSuccess?.type === "success-update" &&
                  "Wishlist updated succesfully"}
              </span>
            </div>
          </Disclosure.Panel>
        </Disclosure>
      )}
      {wishlist?.wishlist.map(
        (
          item: {
            id: string
            title: string
            wishlists: any
            region: any
            total: number
          },
          index: number
        ) => (
          <div key={item.id}>
            <div className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-y-3">
              <p className="text-base-regular font-medium">
                {" "}
                {index + 1}. {item.title}
              </p>
              <div className="flex items-center gap-x-4">
                <Link
                  href="/store"
                  className="text-small-regular text-gray-700 flex items-center gap-x-2"
                >
                  <Package size={16} />
                  Add Product
                </Link>
                <button
                  onClick={() => onEditClik(item)}
                  className="text-small-regular text-gray-700 flex items-center gap-x-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className="text-small-regular text-gray-700 flex items-center gap-x-2"
                  onClick={() => confirmDeleteWishlist(item.id)}
                >
                  <Trash />
                  Remove
                </button>
                <div className="text-small-regular text-gray-700 flex items-center gap-x-2">
                  <p>Total:</p>
                  {formatAmount({
                    amount: item.total || 0,
                    region: item.region,
                    includeTaxes: false,
                  })}
                </div>
              </div>
            </div>
            <WishlistItem
              wishlist={item.wishlists}
              region={item.region}
              refetch={refetch}
            />
            {item.wishlists.length === 0 && (
              <div className="bg-red-200 text-red-500 p-3 rounded">
                Wishlist Items Is Empty
              </div>
            )}
          </div>
        )
      )}
      <Modal isOpen={state} close={close}>
        <Modal.Title>Edit Wishlist</Modal.Title>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-y-2">
            <Input
              label="Title"
              {...register("title", {
                required: "Title is required",
              })}
              required
              errors={errors}
              autoComplete="given-name"
            />
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            Save
            {submitting && <Spinner />}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default WishlistCard
