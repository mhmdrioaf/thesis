interface Props {
  children: React.ReactNode;
}

export default function DashboardContainer({ children }: Props) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 overflow-hidden">
      {children}
    </div>
  );
}

export function DashboardRightRow({ children }: Props) {
  return (
    <div className="w-full flex flex-col gap-4 border border-gray-300 rounded-md px-4 py-4">
      {children}
    </div>
  );
}

export function DashboardLeftRow({ children }: Props) {
  return (
    <div className="h-fit flex flex-row lg:flex-col gap-4 border border-gray-300 rounded-md px-4 py-4 flex-shrink-0 overflow-x-auto">
      {children}
    </div>
  );
}
