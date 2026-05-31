# Firestore Schema For FlutterFlow

## menuItems

- `name` string
- `description` string
- `details` string
- `category` string: `starters`, `mains`, `drinks`
- `diet` string
- `heat` integer
- `price` double
- `allergens` list of strings
- `imageUrl` string
- `isActive` boolean
- `sortOrder` integer

## users

- `uid` string
- `displayName` string
- `email` string
- `role` string: `admin`, `editor`, `viewer`
- `permissions` list of strings: example `["drinks"]`
- `status` string: `active`, `invited`

## appSettings

Use one document, for example `global`.

- `heroImageUrl` string
- `primaryColor` string
- `accentColor` string
- `priceColor` string
- `backgroundColor` string
- `panelColor` string

