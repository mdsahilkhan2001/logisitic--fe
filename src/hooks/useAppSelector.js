import { useSelector, useDispatch } from 'react-redux'

// Custom typed hooks for better TypeScript support
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

// Utility hook for accessing state
export const useStore = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const ui = useAppSelector((state) => state.ui)
  
  return { dispatch, auth, ui }
}
