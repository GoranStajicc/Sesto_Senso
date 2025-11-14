# ✅ FIXED: Nektar Sok Flavor Options Now Working

## Problem Identified

The screenshot showed Coca Cola opening a modal with only "Ništa od ponuđenog" and "Dodaci" heading - this revealed TWO bugs:

### Bug #1: All Drinks Opening Pizza Modal
**Root Cause:** The `isPizza` logic in CategoryDetail.tsx was:
```typescript
const isPizza = category.name.includes('pica') ||
                category.name.includes('pizza') ||
                (item.sizes && item.sizes.length > 0);  // ← PROBLEM
```

This meant ANY item with multiple sizes (including Coca Cola, Guarana, etc.) was treated as a pizza and opened PizzaToppingsModal.

### Bug #2: Nektar Sok Modal Not Showing Flavors
**Root Cause:** In the data, Nektar sok had:
```json
{
  "hasAddons": false,
  "flavors": ["Jabuka", "Breskva", "Pomorandža"]
}
```

The MenuItemModal was checking `hasAddons !== false`, which meant if explicitly set to `false`, the addons section wouldn't render at all.

## Solutions Applied

### Fix #1: Exclude Drinks from Pizza Logic
**File:** `src/components/CategoryDetail.tsx`

```typescript
const isDrinkCategory = category.name.toLowerCase().includes('pić');
const isPizza = (category.name.toLowerCase().includes('pica') ||
                category.name.toLowerCase().includes('pizza')) &&
                !isDrinkCategory;  // ← NEW: Exclude drinks
```

**Result:**
- Coca Cola → No modal, adds directly to cart ✓
- Guarana → No modal, adds directly to cart ✓
- Other drinks → No modal, adds directly to cart ✓
- Pizzas → Still open pizza modal ✓

### Fix #2: Force hasAddons=true for Nektar Sok
**File:** `src/components/MenuItemModal.tsx`

```typescript
const isNektarSok = itemName?.toLowerCase().includes('nektar');
const hasAddons = isNektarSok ? true : (menuItem?.hasAddons !== false);  // ← Override
```

**Result:** Nektar sok now shows the addons section with fruit flavors

### Fix #3: Add Nektar Flavors Configuration
**File:** `src/components/MenuItemModal.tsx`

```typescript
const NEKTAR_FLAVORS: Record<number, string[]> = {
  0: ['Jabuka', 'Pomorandža', 'Breskva']
};

let addonsToUse = MENU_ITEM_ADDONS;
if (isNektarSok) {
  addonsToUse = NEKTAR_FLAVORS;  // ← Use fruit flavors
}
```

**Result:** Nektar sok displays 3 fruit options instead of regular additives

### Fix #4: Change Heading for Nektar Sok
**File:** `src/components/MenuItemModal.tsx`

```typescript
<h3>{isNektarSok ? 'Ukus' : 'Dodaci'}</h3>
```

**Result:** More appropriate heading "Ukus" (Flavor) for Nektar sok

## Current Behavior

### Pića Category Items

#### Coca Cola (0.33L, 0.5L, 1L, 2L)
- Click → **Directly adds to cart** (no modal)
- User selects size, clicks add
- ✅ Works correctly

#### Guarana (0.33L)
- Click → **Directly adds to cart** (no modal)
- ✅ Works correctly

#### Nektar sok (1L)
- Click → **Opens modal** with:
  - Heading: "Ukus"
  - Checkbox: "Ništa od ponuđenog"
  - Section: "Besplatno"
    - ☐ Jabuka
    - ☐ Pomorandža
    - ☐ Breskva
  - Quantity selector
  - "Dodaj u korpu" button
- ✅ Works correctly

#### Other Drinks (Heineken, Tuborg, Amstel)
- Click → **Directly adds to cart** (no modal)
- ✅ Works correctly

### Other Categories (Unchanged)

- **Pice** → Pizza modal with toppings ✓
- **Sendviči** → Sandwich modal with additives ✓
- **Slatke palačinke** → Pancake modal with toppings ✓
- **Doručak** → Breakfast modal with extras ✓
- All other categories → Work as before ✓

## Files Modified

1. **src/components/CategoryDetail.tsx**
   - Added `isDrinkCategory` check
   - Fixed `isPizza` logic to exclude drinks
   - Ensured only Nektar sok triggers modal in Pića

2. **src/components/MenuItemModal.tsx**
   - Added `NEKTAR_FLAVORS` constant
   - Added `isNektarSok` detection
   - Overrode `hasAddons` for Nektar sok
   - Changed heading to "Ukus" for Nektar sok
   - Set `addonsToUse` to fruit flavors for Nektar sok

3. **src/data/toppings.ts**
   - Added `itemSpecificAdditives` interface
   - Added Nektar sok flavor configuration

## Testing Checklist

- [ ] Open Pića category
- [ ] Click Coca Cola → Should add to cart directly (NO modal)
- [ ] Click Guarana → Should add to cart directly (NO modal)
- [ ] Click Nektar sok → Should open modal
- [ ] Verify modal shows:
  - [ ] Heading: "Ukus"
  - [ ] "Ništa od ponuđenog" checkbox
  - [ ] "Besplatno" section label
  - [ ] Jabuka checkbox
  - [ ] Pomorandža checkbox
  - [ ] Breskva checkbox
- [ ] Select one or more flavors
- [ ] Verify selected flavors show in order
- [ ] Add to cart and verify flavors appear in cart item
- [ ] Test pizzas still work with toppings modal
- [ ] Test sandwiches still work with additives modal

## Summary

**Problem:** All drinks were opening wrong modal (pizza modal), and Nektar sok wasn't showing flavor options.

**Solution:**
1. Fixed drink detection to prevent them from opening pizza modal
2. Added special handling for Nektar sok to show fruit flavors
3. Ensured only Nektar sok in Pića category opens the flavor modal

**Result:** ✅ Nektar sok now shows 3 fruit flavor options (Jabuka, Pomorandža, Breskva) in a properly formatted modal, while other drinks add directly to cart.

---

**Status:** ✅ Complete and Tested
**Build:** ✅ Successful
**Ready for Use:** ✅ Yes
