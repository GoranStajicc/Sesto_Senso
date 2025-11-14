-- Export all menu items with their categories
SELECT 
    mi.id,
    mi.category_id,
    c.name as category_name,
    mi.name,
    mi.description,
    mi.price,
    mi.image_url,
    mi.is_available,
    mi.is_featured,
    mi.display_order
FROM menu_items mi
JOIN categories c ON mi.category_id = c.id
ORDER BY c.display_order, mi.display_order;
