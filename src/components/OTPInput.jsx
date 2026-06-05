import { useRef, useEffect } from 'react'

export default function OTPInput({ length = 6, value, onChange }) {
  const inputRefs = useRef([])

  const digits = value.split('').concat(Array(length - value.length).fill(''))

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, e) => {
    const val = e.target.value
    if (!/^\d*$/.test(val)) return

    const newDigits = [...digits]
    newDigits[index] = val.slice(-1)
    const newValue = newDigits.join('')
    onChange(newValue)

    // Auto-focus next
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted)
      const focusIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none ${
            digit
              ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-glow'
              : 'border-surface-200 bg-white text-surface-900 focus:border-brand-500'
          }`}
        />
      ))}
    </div>
  )
}
