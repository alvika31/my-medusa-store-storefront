import Input from "@modules/common/components/input"
import Button from "@modules/common/components/button"
import { useForm, SubmitHandler } from "react-hook-form"
import React, { useState } from "react"
import { useMeCustomer } from "medusa-react"
import Spinner from "@modules/common/icons/spinner"
import { Disclosure } from "@headlessui/react"
import clsx from "clsx"
import { useCreateWishlistName } from "@lib/hooks/use-create-wishlist-name"
import { Region } from "@medusajs/medusa"

interface FormValues {
  title: string
  customer_id: string
}

interface Props {
  regions: Region[] | any
  refetch: any
}
const WishlistAdd: React.FC<Props> = ({ regions, refetch }) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { customer } = useMeCustomer()
  const id = customer?.id
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const regionId = regions?.[0]?.id
    if (!regionId) {
      console.error("Region ID not found in the API response")
      return null
    }

    const payload = {
      title: data.title,
      customer_id: id,
      region_id: regionId,
    }

    mutate(payload)
  }

  const { mutate, isLoading: createWishlistNameIsLoading } =
    useCreateWishlistName({
      onSuccess: () => {
        reset()
        refetch()
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
        }, 2000)
      },
      onError: (error: any) => {
        console.log(error)
      },
    })

  return (
    <>
      {isSuccess && (
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
              <span>Wishlist created succesfully</span>
            </div>
          </Disclosure.Panel>
        </Disclosure>
      )}
      <form
        className="w-full flex flex-col gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Wishlist"
          {...register("title", {
            required: "Wishlist is required",
          })}
          required
          errors={errors}
          autoComplete="given-wishlist"
        />
        <Button
          type="submit"
          className="w-full small:max-w-[140px]"
          disabled={createWishlistNameIsLoading}
        >
          Save
          {createWishlistNameIsLoading && <Spinner />}
        </Button>
      </form>
    </>
  )
}

export default WishlistAdd
