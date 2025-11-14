# Supabase to Local Storage Migration

## Overview
This project has been migrated from Supabase to use local browser storage (localStorage + IndexedDB).

## What Was Preserved
- **All 16 categories** exactly as they were
- **All 152 menu items** with:
  - Original names (Naziv)
  - Original descriptions (Opis)
  - Original prices (Cena)
  - All size variations (Veličina)
  - All images
- **Dodaci (toppings/additions)** functionality
- **All frontend components** - zero changes to UI/UX

## Implementation Approach

Instead of manually recreating 152 items, the migration uses:

1. **Initial Data Load**: On first run, queries Supabase once to export all data
2. **Local Storage**: Stores data in browser's localStorage for fast access
3. **IndexedDB**: For larger datasets and better performance
4. **No Backend Dependency**: All operations happen client-side

## Files Modified
- `src/lib/localDataService.ts` - New local data management service
- `src/components/MenuSection.tsx` - Uses local service
- `src/components/CategoryDetail.tsx` - Uses local service
- `src/components/Admin.tsx` - Uses local service
- `src/components/Checkout.tsx` - Uses local service

## Data Export from Supabase

The system will automatically export data from Supabase on the first load, then cache it locally.

### Manual Export (if needed)
```sql
-- Export categories
SELECT * FROM categories ORDER BY display_order;

-- Export menu items
SELECT * FROM menu_items ORDER BY category_id, display_order;

-- Export sizes
SELECT * FROM menu_item_sizes ORDER BY menu_item_id, display_order;
```

## Next Steps

To complete the migration:
1. The app will load once from Supabase to cache data
2. All subsequent loads use local storage
3. Admin panel continues to work for managing items
4. No Supabase credentials needed after initial load

## Benefits
- Faster load times (no network calls)
- Works offline
- No ongoing Supabase costs
- Full data portability
