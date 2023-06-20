interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function TextField({ className, ...props }: Props) {
  return (
    <input
      className={`w-full outline-none border border-gray-300 rounded-md px-2 py-2 ${className}`}
      {...props}
    />
  );
}
