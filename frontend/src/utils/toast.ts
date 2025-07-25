import { useToast } from 'vue-toastification'

export function showSuccess(text: string, title = 'Success') {
  const toast = useToast()
  toast.success(text)
}

export function showError(text: string, title = 'Error') {
  const toast = useToast()
  toast.error(text)
}