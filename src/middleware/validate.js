export function validateBooking(req, res, next) {
  const {
    zoneSlug,
    name,
    email,
    phone,
    date,
    slot,
    packageSlug,
    packageTitle,
    packagePrice,
  } = req.body

  const errors = []

  if (!zoneSlug || typeof zoneSlug !== 'string') {
    errors.push({ field: 'zoneSlug', message: 'Zone slug is required' })
  }

  if (!name || typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' })
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push({ field: 'email', message: 'A valid email is required' })
  }

  if (!phone || typeof phone !== 'string') {
    errors.push({ field: 'phone', message: 'Phone is required' })
  }

  if (!date || isNaN(Date.parse(date))) {
    errors.push({ field: 'date', message: 'A valid date is required' })
  }

  if (!slot || typeof slot !== 'string') {
    errors.push({ field: 'slot', message: 'Slot is required' })
  }

  if (!packageSlug || typeof packageSlug !== 'string') {
    errors.push({ field: 'packageSlug', message: 'Package selection is required' })
  }

  if (!packageTitle || typeof packageTitle !== 'string') {
    errors.push({ field: 'packageTitle', message: 'Package title is required' })
  }

  if (typeof packagePrice !== 'number' || Number.isNaN(packagePrice) || packagePrice <= 0) {
    errors.push({ field: 'packagePrice', message: 'Package price must be a positive number' })
  }

  if (errors.length) {
    return res.status(400).json({ errors })
  }

  next()
}
