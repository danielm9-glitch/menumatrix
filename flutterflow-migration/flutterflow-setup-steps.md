# FlutterFlow Setup Steps

You cannot upload this HTML/CSS/JavaScript app directly into FlutterFlow.
FlutterFlow apps are Flutter/Dart apps, so this project should be rebuilt there using the same screens and data.

## What You Can Upload Or Copy

- Use `menuItems.json` as the starter menu data for Firestore.
- Use `appSettings.json` as the starter design settings.
- Use `firestore-schema.md` to create the Firebase collections.
- Rebuild the screens visually in FlutterFlow.

## Suggested Build Order

1. Create a new FlutterFlow project.
2. Connect Firebase.
3. Create the `menuItems`, `users`, and `appSettings` collections.
4. Build the `MenuPage`.
5. Build the expandable `MenuItemCard` component.
6. Add admin login and permissions.
7. Add `EditItemPage`.
8. Add image uploads to Firebase Storage.
9. Add `ManageUsersPage`.
10. Add `DesignSettingsPage`.

## Important Note

The current local app stores edits in browser localStorage. FlutterFlow should use Firebase instead so changes sync across iPhone, Android, and web.

