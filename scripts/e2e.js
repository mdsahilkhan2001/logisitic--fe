// Simple E2E smoke test for auth + product + wishlist
// Usage: npm run test:e2e (ensure backend running: python manage.py runserver)

const API = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function jsonFetch(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} -> ${JSON.stringify(data)}`)
  }
  return data
}

async function run() {
  console.log('E2E: Starting smoke test against', API)

  // 1. Login
  console.log('Login as admin...')
  const loginData = await jsonFetch('/login/', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'password' }),
  })
  const access = loginData.access
  if (!access) throw new Error('Missing access token in login response')
  console.log('Login OK, token acquired')

  const authHeaders = { Authorization: `Bearer ${access}` }

  // 2. Get products
  console.log('Fetch products list...')
  let products = await jsonFetch('/products/', { headers: authHeaders })
  console.log(`Products found: ${products.length}`)

  // 3. Create product if none
  let productId
  if (products.length === 0) {
    console.log('No products; creating one...')
    // Fallback to multipart form-data to bypass potential JSON 415 issues
    const fd = new FormData()
    fd.append('name', 'E2E Test Product')
    fd.append('description', 'Auto-created')
    fd.append('price', '9.99')
    const createdRes = await fetch(API + '/products/', { method: 'POST', headers: { Authorization: `Bearer ${access}` }, body: fd })
    if (!createdRes.ok) {
      console.warn('Product creation failed:', createdRes.status, await createdRes.text())
    } else {
      const created = await createdRes.json()
      productId = created.id
      console.log('Created product id', productId)
    }
  } else {
    productId = products[0].id
    console.log('Using existing product id', productId)
  }

  // 4. Wishlist operations
  console.log('Add product to wishlist (id=' + productId + ') ...')
  try {
    const wfd = new FormData()
    wfd.append('product_id', String(productId))
    const addRes = await fetch(API + '/wishlist/', { method: 'POST', headers: { Authorization: `Bearer ${access}` }, body: wfd })
    if (!addRes.ok) {
      console.warn('Wishlist add failed:', addRes.status, await addRes.text())
    }
  } catch (err) {
    console.warn('Wishlist add error:', err.message)
  }

  const wishlist = await jsonFetch('/wishlist/', { headers: authHeaders })
  const inWishlist = wishlist.some(w => w.product.id === productId)
  if (!inWishlist) throw new Error('Product not present in wishlist after add')
  console.log('Wishlist contains product. Total wishlist items:', wishlist.length)

  console.log('\nE2E SUCCESS')
}

run().catch(err => {
  console.error('E2E FAILED:', err.message)
  process.exit(1)
})
