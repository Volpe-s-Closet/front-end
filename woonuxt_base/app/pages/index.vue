<script lang="ts" setup>
import { ProductsSlider } from '#components';
import { ProductsOrderByEnum } from '#woo';
const { siteName, description, shortDescription, siteImage } = useAppConfig();

const { data } = await useAsyncGql('getProductCategories', { first: 6 });
const productCategories = data.value?.productCategories?.nodes || [];

const { data: productData } = await useAsyncGql('getProducts', { first: 5, orderby: ProductsOrderByEnum.POPULARITY });
const popularProducts = productData.value.products?.nodes || [];

// Mock blog posts data
const blogPosts = [
  {
    id: '1',
    databaseId: 1,
    title: 'The Future of E-commerce: Trends to Watch',
    slug: 'future-of-ecommerce-trends',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    date: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'E-commerce trends',
      },
    },
    author: {
      node: {
        name: 'John Doe',
        slug: 'john-doe',
      },
    },
    categories: {
      nodes: [
        { name: 'Business', slug: 'business' },
        { name: 'Technology', slug: 'technology' },
      ],
    },
  },
  {
    id: '2',
    databaseId: 2,
    title: 'Building Customer Trust in Online Shopping',
    slug: 'building-customer-trust-online',
    excerpt:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    date: new Date(Date.now() - 86400000).toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Customer trust',
      },
    },
    author: {
      node: {
        name: 'Jane Smith',
        slug: 'jane-smith',
      },
    },
    categories: {
      nodes: [
        { name: 'Customer Service', slug: 'customer-service' },
        { name: 'Tips', slug: 'tips' },
      ],
    },
  },
  {
    id: '3',
    databaseId: 3,
    title: 'Sustainable Fashion: The New Consumer Demand',
    slug: 'sustainable-fashion-consumer-demand',
    excerpt:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.',
    date: new Date(Date.now() - 172800000).toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Sustainable fashion',
      },
    },
    author: {
      node: {
        name: 'Mike Johnson',
        slug: 'mike-johnson',
      },
    },
    categories: {
      nodes: [
        { name: 'Fashion', slug: 'fashion' },
        { name: 'Sustainability', slug: 'sustainability' },
      ],
    },
  },
];

useSeoMeta({
  title: `Home`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <HeroCarrousel />

    <!-- Product slider -->
    <section class="container my-16" v-if="popularProducts">
      <ProductsSlider :products="popularProducts" />
    </section>

    <!-- Random text -->
    <p class="text-center uppercase m-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet.</p>

    <!-- Categories -->
    <section class="my-16">
      <div class="grid grid-cols-2 md:grid-cols-3">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full aspect-square rounded-none" :node="category" />
      </div>
    </section>

    <!-- Newsletter preview-->
    <section class="my-16">
      <Newsletter />
    </section>

    <!-- Blog -->
    <section class="my-16">
      <BlogGrid :posts="blogPosts" :columns="3" />
    </section>
  </main>
</template>

<style scoped>
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}
</style>
