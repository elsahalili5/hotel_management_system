// import React from 'react'

// interface InputProps {
//   label: string
//   name: string
//   type: string
//   placeholder?: string
//   register: UseFormRegister<any>
//   required?: boolean
//   className?: string
//   labelClass?: string
//   inputClass?: string
// }
// const inputClass =
//   'w-full bg-white border border-mansio-linen/60 rounded-sm px-4 py-3 text-sm text-mansio-espresso placeholder-mansio-linen focus:outline-none focus:border-mansio-gold transition-colors'
// const labelClass =
//   'text-xs font-medium tracking-widest uppercase text-mansio-taupe mb-1.5 block'

// const Input: React.FC<InputProps> = ({
//   label,
//   name,
//   type,
//   placeholder,
//   register,
//   required = false,
//   className,
//   labelClass,
//   inputClass,
// }) => {
//   return (
//     <div className={className}>
//       <label className={labelClass}>{label}</label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         className={inputClass}
//         {...register(name, { required })}
//       />
//     </div>
//   )
// }

// export default Input
