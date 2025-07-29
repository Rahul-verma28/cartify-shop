"use client"

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/use-redux'
import { 
  fetchCategories, 
  fetchCollections, 
  selectCategories, 
  selectCollections,
  selectNavigationLoading,
  selectNavigationErrors
} from '@/lib/redux/slices/navigationSlice'

export const useNavigation = () => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const collections = useAppSelector(selectCollections)
  const loading = useAppSelector(selectNavigationLoading)
  const errors = useAppSelector(selectNavigationErrors)
  const lastCategoriesFetch = useAppSelector(state => state.navigation.lastFetched.categories)
  const lastCollectionsFetch = useAppSelector(state => state.navigation.lastFetched.collections)

  useEffect(() => {
    // Check if data needs to be fetched (cache for 5 minutes)
    const now = Date.now()
    const cacheTime = 5 * 60 * 1000 // 5 minutes

    // Fetch categories if not cached or cache expired
    if (!lastCategoriesFetch || (now - lastCategoriesFetch) > cacheTime) {
      dispatch(fetchCategories())
    }

    // Fetch collections if not cached or cache expired
    if (!lastCollectionsFetch || (now - lastCollectionsFetch) > cacheTime) {
      dispatch(fetchCollections())
    }
  }, [dispatch, lastCategoriesFetch, lastCollectionsFetch])

  const refetchCategories = () => dispatch(fetchCategories())
  const refetchCollections = () => dispatch(fetchCollections())

  return {
    categories,
    collections,
    loading,
    errors,
    refetchCategories,
    refetchCollections
  }
}
