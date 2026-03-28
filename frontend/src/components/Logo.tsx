export function Logo({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/mansio-logo.png"
      alt="Mansio Hotel Logo"
      width={size}
      height={size}
    />
  )
}
