import { products as mockProducts, categories as mockCategories } from './mockData';

let accessToken = null;
let useMockData = true;

// Quick check if server is available
const checkServer = async () => {
  try {
    const res = await fetch('/api/v1/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      useMockData = false;
      return true;
    }
  } catch {}
  useMockData = true;
  return false;
};

// Run check on load
checkServer();

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const API_BASE = '/api/v1';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    // Try to refresh token on 401
    if (res.status === 401 && data.code === 'TOKEN_EXPIRED') {
      const refreshed = await refreshToken();
      if (refreshed) {
        return null; // Caller should retry
      }
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const refreshToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    setAccessToken(data.data.accessToken);
    return true;
  } catch {
    return false;
  }
};

const getMockData = (endpoint) => {
  // Parse query params
  const url = new URL(endpoint, 'http://localhost');
  const path = url.pathname;
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const sort = url.searchParams.get('sort') || 'newest';
  const category = url.searchParams.get('category');    const search = url.searchParams.get('search');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const page = parseInt(url.searchParams.get('page') || '1');

  // Get i18n language
  let lang = 'uz';
  try {
    const stored = localStorage.getItem('prestige-lang');
    if (stored) lang = stored;
  } catch {}

  // Map mock products to include category name and localized name/description
  const mapProduct = (p) => ({
    ...p,
    name: p.name[lang] || p.name.en,
    description: p.description[lang] || p.description.en,
    category: {
      _id: p.category,
      name: (mockCategories.find((c) => c._id === p.category)?.name || {})[lang] || 'Gullar',
    },
    images: p.images || [{ url: '/images/flower_1.jpg' }],
  });

  // Products endpoint
  if (path === '/products' || path === '/products/') {
    let filtered = [...mockProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name[lang]?.toLowerCase().includes(q) ||
        p.name.en?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.includes(q))
      );
    }
    if (url.searchParams.get('premium') === 'true') {
      filtered = filtered.filter((p) => p.isPremium);
    }
    if (url.searchParams.get('new') === 'true') {
      filtered = filtered.filter((p) => p.isNew);
    }
    if (url.searchParams.get('gift') === 'true') {
      filtered = filtered.filter((p) => p.isGift);
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseInt(maxPrice));
    }

    // Sort
    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    else filtered.sort((a, b) => a.name[lang]?.localeCompare(b.name[lang]) || 0);

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: {
        products: paginated.map(mapProduct),
        pagination: { page, pages, total },
      },
    };
  }

  // Single product by slug
  if (path.startsWith('/products/') && path.split('/').length === 3) {
    const slug = path.split('/')[2];
    const product = mockProducts.find((p) => p.slug === slug);
    if (product) {
      return { data: { product: mapProduct(product) } };
    }
    throw new Error('Product not found');
  }

  // Related products
  if (path.includes('/related')) {
    const id = path.split('/')[2];
    const related = mockProducts
      .filter((p) => p._id !== id)
      .slice(0, 4)
      .map(mapProduct);
    return { data: { products: related } };
  }

  // Categories
  if (path === '/categories' || path === '/categories/') {
    return {
      data: {
        categories: mockCategories.map((c) => ({
          ...c,
          name: c.name[lang] || c.name.en,
        })),
      },
    };
  }

  // Favorites
  if (path === '/favorites' || path.startsWith('/favorites/')) {
    return {
      data: {
        favorites: mockProducts.slice(0, 3).map(mapProduct).map((p) => ({
          _id: p._id,
          product: p,
        })),
      },
    };
  }

  // Orders
  if (path === '/orders' || path === '/orders/') {
    return {
      data: {
        orders: [],
      },
    };
  }

  throw new Error('Not found');
};

export const api = {
  get: async (endpoint, options = {}) => {
    if (useMockData) {
      return getMockData(endpoint);
    }

    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers,
      credentials: 'include',
      ...options.fetchOptions,
    });

    const data = await handleResponse(res);
    if (data === null) {
      // Retry with new token
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers,
        credentials: 'include',
        ...options.fetchOptions,
      });
      return handleResponse(res);
    }
    return data;
  },

  post: async (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: isFormData ? body : JSON.stringify(body),
      ...options.fetchOptions,
    });

    const data = await handleResponse(res);
    if (data === null) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? body : JSON.stringify(body),
        ...options.fetchOptions,
      });
      return handleResponse(res);
    }
    return data;
  },

  put: async (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: isFormData ? body : JSON.stringify(body),
      ...options.fetchOptions,
    });

    const data = await handleResponse(res);
    if (data === null) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: isFormData ? body : JSON.stringify(body),
        ...options.fetchOptions,
      });
      return handleResponse(res);
    }
    return data;
  },

  patch: async (endpoint, body, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
      ...options.fetchOptions,
    });

    const data = await handleResponse(res);
    if (data === null) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(body),
        ...options.fetchOptions,
      });
      return handleResponse(res);
    }
    return data;
  },

  delete: async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      ...options.fetchOptions,
    });

    const data = await handleResponse(res);
    if (data === null) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
        ...options.fetchOptions,
      });
      return handleResponse(res);
    }
    return data;
  },
};
