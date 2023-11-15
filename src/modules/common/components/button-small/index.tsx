import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"

type ButtonProps = {
  isLoading?: boolean
  variant?: "red" | "blue" | "yellow"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const ButtonSmall = ({
  children,
  className,
  isLoading = false,
  variant = "red",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        "w-full uppercase flex items-center justify-center min-h-[1px] px-1 py-[1px] text-[10px] border transition-colors duration-200 disabled:opacity-50",
        {
          "text-white bg-red-500 border-red-500 hover:bg-white hover:text-red-500 disabled:hover:bg-gray-500 disabled:hover:text-white":
            variant === "red",
          "text-white bg-blue-500 border-blue-500 hover:bg-white hover:text-blue-500 disabled:hover:bg-gray-500 disabled:hover:text-white":
            variant === "blue",
        "text-white bg-yellow-500 border-yellow-500 hover:bg-white hover:text-yellow-500 disabled:hover:bg-gray-500 disabled:hover:text-white":
            variant === "yellow",
        },
        className
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

export default ButtonSmall
