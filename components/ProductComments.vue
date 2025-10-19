<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoadingSettings || isLoadingPurchaseStatus" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Existing Review Status -->
    <div v-if="hasUserReviewed && userReview && !isEditingReview" class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3 flex-1">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-medium text-blue-800">Your Review</h4>
            <div class="mt-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="flex items-center">
                  <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                    {{ i <= userReview.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-blue-600">
                  {{ userReview.status === 'approved' ? 'Published' : 'Pending Moderation' }}
                </span>
              </div>
              <p class="text-sm text-blue-700" v-html="userReview.review"></p>
              <p class="text-xs text-blue-600 mt-2">
                Submitted {{ formatDateTime(userReview.date_created) }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex-shrink-0 ml-4">
          <button
            @click="startEditingReview"
            class="text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Comment Form -->
    <div v-if="canComment && (!hasUserReviewed || isEditingReview)" class="bg-gray-50 p-6 rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ hasUserReviewed ? 'Update Your Review' : 'Write a Review' }}
        </h3>
        <button
          v-if="isEditingReview"
          @click="cancelEditingReview"
          class="text-sm text-gray-600 hover:text-gray-800 underline focus:outline-none"
        >
          Cancel
        </button>
      </div>
      
      <form @submit.prevent="submitComment" class="space-y-4">
        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
          <div class="flex items-center space-x-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              class="text-2xl focus:outline-none transition-colors"
              :class="star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
            >
              ★
            </button>
          </div>
        </div>

        <!-- Comment Text -->
        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            v-model="commentText"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Share your thoughts about this product..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span class="text-red-500">*</span> Required fields
            <div v-if="moderationRequired && !hasUserReviewed" class="text-xs text-gray-500 mt-1">
              Reviews require approval before being published
            </div>
          </div>
          <BaseButton
            type="submit"
            :disabled="isSubmitting || !rating || !commentText.trim()"
            :text="isSubmitting ? 'Submitting...' : (hasUserReviewed ? 'Update Review' : 'Submit Review')"
            class="bg-gray-900 hover:bg-gray-800 text-white"
          />
        </div>
      </form>
    </div>

    <!-- Write Review Button for users without reviews -->
    <div v-else-if="canComment && !hasUserReviewed" class="text-center py-6">
      <button
        @click="isEditingReview = true"
        class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Write a Review
      </button>
    </div>

    <!-- Login Required Message -->
    <div v-else-if="!isAuthenticated && !isLoadingSettings" class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            Please <NuxtLink to="/login" class="font-medium underline hover:text-blue-600">log in</NuxtLink> to write a review.
          </p>
        </div>
      </div>
    </div>



    <!-- Purchase Required Message -->
    <div v-else-if="!hasPurchased && requiresPurchase && !isLoadingPurchaseStatus" class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-orange-700">
            Only customers who have purchased this product can write a review.
          </p>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="comments && comments.length > 0" class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">
        Customer Reviews ({{ comments.length }})
      </h3>
      
      <div class="space-y-6">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="border-b border-gray-100 pb-6 last:border-b-0"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="font-semibold text-gray-900">{{ comment.reviewer }}</h4>
              <div class="flex items-center mt-1">
                <div class="flex items-center">
                  <span v-for="i in 5" :key="i" class="text-yellow-400">
                    {{ i <= comment.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="ml-2 text-sm text-gray-500">
                  {{ formatDateTime(comment.date_created) }}
                </span>
                <span v-if="comment.verified" class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified Purchase
                </span>
                <span v-if="comment.status === 'hold'" class="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pending Moderation
                </span>
              </div>
            </div>
          </div>
          <div class="prose prose-sm text-gray-700" v-html="comment.review"></div>
        </div>
      </div>
    </div>

    <!-- No Comments Message -->
    <div v-else class="text-center py-8 text-gray-500">
      <p class="text-lg">No reviews yet.</p>
      <p class="text-sm">Be the first to review this product!</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  },
  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['comment-added', 'refresh-comments'])

const { user, isAuthenticated } = useAuth()
const { createProductReview, checkPurchaseStatus, getReviewSettings } = useProducts()
const { customerData, loadCustomerProfile } = useCustomer()

// Reactive data
const rating = ref(0)
const commentText = ref('')
const isSubmitting = ref(false)
const hasPurchased = ref(false)
const requiresPurchase = ref(false) // Default to false - allow reviews unless WooCommerce says otherwise
const hasUserReviewed = ref(false)
const userReview = ref(null) // Store the user's existing review
const moderationRequired = ref(false)
const isLoadingPurchaseStatus = ref(false)
const isLoadingSettings = ref(false)
const isEditingReview = ref(false)

// Check if user has purchased this product
const checkUserPurchaseStatus = async () => {
  if (!isAuthenticated.value || !user.value) {
    hasPurchased.value = false
    return
  }

  isLoadingPurchaseStatus.value = true
  try {
    const customerId = customerData.value?.id || user.value.id
    if (!customerId) {
      hasPurchased.value = false
      return
    }

    hasPurchased.value = await checkPurchaseStatus(props.productId, customerId)
    console.log('Purchase status check:', {
      productId: props.productId,
      customerId,
      hasPurchased: hasPurchased.value,
      requiresPurchase: requiresPurchase.value
    })
  } catch (error) {
    console.error('Error checking purchase status:', error)
    hasPurchased.value = false
  } finally {
    isLoadingPurchaseStatus.value = false
  }
}

// Check if user has already reviewed this product
const checkExistingReview = () => {
  if (!isAuthenticated.value || !user.value || !props.comments) {
    hasUserReviewed.value = false
    userReview.value = null
    return
  }

  const userEmail = user.value.email
  const existingReview = props.comments.find(comment => 
    comment.reviewer_email === userEmail
  )

  if (existingReview) {
    hasUserReviewed.value = true
    userReview.value = existingReview
    rating.value = existingReview.rating
    commentText.value = existingReview.review.replace(/<[^>]*>/g, '') // Strip HTML
    isEditingReview.value = false // Reset edit mode
  } else {
    hasUserReviewed.value = false
    userReview.value = null
    rating.value = 0
    commentText.value = ''
    isEditingReview.value = false
  }
}

// Get WooCommerce settings for review requirements
const loadReviewSettings = async () => {
  isLoadingSettings.value = true
  try {
    const settings = await getReviewSettings()
    requiresPurchase.value = settings.purchase_verification_required
    moderationRequired.value = settings.moderation_required
    console.log('Review settings loaded:', settings)
  } catch (error) {
    console.error('Error fetching review settings:', error)
    requiresPurchase.value = false
    moderationRequired.value = false
  } finally {
    isLoadingSettings.value = false
  }
}

// Computed property to determine if user can comment
const canComment = computed(() => {
  if (!isAuthenticated.value) return false
  
  // If purchase verification is required and user hasn't purchased, deny access
  if (requiresPurchase.value && !hasPurchased.value) return false
  
  // User can always edit their existing review or create a new one if they haven't reviewed yet
  return true
})

// Submit comment
const submitComment = async () => {
  if (!canComment.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const reviewData = {
      product_id: parseInt(props.productId),
      review: commentText.value,
      reviewer: user.value.display_name || user.value.username || 'Anonymous',
      reviewer_email: user.value.email,
      rating: rating.value
    }

    // If updating existing review, add the review ID
    if (hasUserReviewed.value && userReview.value) {
      reviewData.id = userReview.value.id
    }

    await createProductReview(reviewData)

    // Emit events to parent component
    emit('comment-added')
    emit('refresh-comments')

    // Exit edit mode and show success message
    isEditingReview.value = false
    
    const { showNotification } = useNotifications()
    const message = hasUserReviewed.value 
      ? 'Review updated successfully!' 
      : moderationRequired.value 
        ? 'Review submitted successfully! It will appear after moderation.'
        : 'Review submitted successfully!'
    
    showNotification(message, 'success')

  } catch (error) {
    console.error('Error submitting review:', error)
    const { showNotification } = useNotifications()
    showNotification('Failed to submit review. Please try again.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Format date with time
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Toggle edit mode
const startEditingReview = () => {
  isEditingReview.value = true
}

const cancelEditingReview = () => {
  isEditingReview.value = false
  // Reset form to original values
  if (userReview.value) {
    rating.value = userReview.value.rating
    commentText.value = userReview.value.review.replace(/<[^>]*>/g, '')
  }
}

// Initialize component
onMounted(async () => {
  await loadReviewSettings()
  if (isAuthenticated.value) {
    // Load customer profile first to ensure we have the customer ID
    if (!customerData.value) {
      await loadCustomerProfile(user.value)
    }
    await checkUserPurchaseStatus()
    checkExistingReview()
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue) {
    // Load customer profile first
    if (!customerData.value) {
      await loadCustomerProfile(user.value)
    }
    await checkUserPurchaseStatus()
    checkExistingReview()
  } else {
    hasPurchased.value = false
    hasUserReviewed.value = false
  }
})

// Watch for comments changes
watch(() => props.comments, () => {
  checkExistingReview()
})
</script>