# Product Mapping Reference - Uniform Catalog System

This document provides a comprehensive reference of all product sections that have been mapped with unique identifiers for future image integration and asset management.

## Product Catalog (Main Distribution Step)

All 17 uniform products in the catalog have been mapped with the following structure:

### Container Identifiers
Each product card uses:
- **ID Pattern**: `id="product-{product-id}"`
- **Data Attributes**:
  - `data-product-id="{product-id}"` - Unique product identifier
  - `data-product-category="{category}"` - Product category (camisa, calca, jaleco, etc.)
  - `data-has-image="true|false"` - Boolean flag indicating if product has an image

### CSS Classes Applied
- `.uniform-product-card` - Main product card container
- `.product-image` - Product image element (when image exists)
- `.product-image-placeholder` - Placeholder div (when no image)
- `.product-name` - Product name/title
- `.product-quantity-section` - Quantity input wrapper
- `.product-quantity-input` - Quantity input field
- `.product-details` - Additional product details (gender, fabric)
- `.product-gender-section` - Gender selection section
- `.product-fabric-section` - Fabric selection section

### Complete Product List (17 Products)

| Product ID | Product Name | Category | Location |
|------------|-------------|----------|----------|
| `product-camisa-gola-redonda` | Camisa Gola Redonda | camisa | DistributionStep.tsx |
| `product-camisa-gola-v` | Camisa Gola V | camisa | DistributionStep.tsx |
| `product-camisa-gola-v-raglan` | Camisa Gola V Manga Raglan | camisa | DistributionStep.tsx |
| `product-camisa-polo` | Camisa Polo | camisa | DistributionStep.tsx |
| `product-camisa-social-masculina` | Camisa Social Masculina | camisa | DistributionStep.tsx |
| `product-camisa-social-feminina` | Camisa Social Feminina | camisa | DistributionStep.tsx |
| `product-calca-social-masculina` | Calça Social Masculina | calca | DistributionStep.tsx |
| `product-calca-social-feminina` | Calça Social Feminina | calca | DistributionStep.tsx |
| `product-calca-elastico-cordao` | Calça Elástico com Cordão | calca | DistributionStep.tsx |
| `product-jaleco-consultorio` | Jaleco de Consultório | jaleco | DistributionStep.tsx |
| `product-jaleco-operacional-botao` | Jaleco Operacional (Botão) | jaleco | DistributionStep.tsx |
| `product-jaleco-operacional-polo` | Jaleco Operacional (Polo) | jaleco | DistributionStep.tsx |
| `product-blazer-feminino` | Blazer Feminino Forrado | blazer | DistributionStep.tsx |
| `product-colete-feminino` | Colete Feminino com Zíper | colete | DistributionStep.tsx |
| `product-blusa-gola-drape` | Blusa Gola Drape | blusa | DistributionStep.tsx |
| `product-blusa-gola-redonda` | Blusa Gola Redonda | blusa | DistributionStep.tsx |
| `product-guarda-po-operacional` | Guarda-Pó Operacional | guarda | DistributionStep.tsx |

## Quote/Review Page Product References

### Distribution Summary Section
- **Container ID**: `id="quote-distribution-summary"`
- **Individual Items**: Each product has `data-product-type="{product-id}"`
- **Location**: OrcamentoPage.tsx, lines 280-297

### Detailed Distribution Section
- **Container ID**: `id="quote-distribution-detailed"`
- **Individual Items**: 
  - Class: `.product-distribution-item`
  - `data-product-type="{product-id}"`
  - `data-product-quantity="{quantity}"`
- **Location**: OrcamentoPage.tsx, lines 344-397

## Saved Quotes Modal

### Quotes List Container
- **Container ID**: `id="saved-quotes-list"`
- **Quote Cards**: 
  - Class: `.saved-quote-card`
  - `data-quote-index="{index}"`
  - `data-quote-cnpj="{cnpj}"`
- **Product Tags**:
  - Class: `.product-tag`
  - `data-product-type="{product-id}"`
  - `data-product-quantity="{quantity}"`
- **Location**: SavedQuotesModal.tsx

## Quiz/Distribution Step Context

### Step 2 Container
- **Container ID**: `id="quizStep2Loaded"`
- **Data Attribute**: `data-quiz-step="distribution"`
- **Location**: Quiz.tsx

## Help Modal

### Help Content Areas
- **Container**: `data-help-context="modal-content"`
- **Categories Step**: `data-help-step="categories"`
- **FAQ Step**: 
  - `data-help-step="faq"`
  - `data-help-category="{category-id}"`
- **Location**: HelpModal.tsx

## Usage Examples

### JavaScript/TypeScript Access

```javascript
// Access a specific product card
const productCard = document.getElementById('product-camisa-social-masculina');

// Access product image
const productImage = document.querySelector('[data-product-id="camisa-social-masculina"] .product-image');

// Access all products in a category
const allShirts = document.querySelectorAll('[data-product-category="camisa"]');

// Access products with images
const productsWithImages = document.querySelectorAll('[data-has-image="true"]');

// Access distribution items
const distributionItems = document.querySelectorAll('.product-distribution-item');

// Access specific product in quote
const quotedProduct = document.querySelector('[data-product-type="camisa-polo"]');
```

### CSS Styling

```css
/* Style all product cards */
.uniform-product-card {
  /* styles */
}

/* Style product images */
.product-image {
  /* styles */
}

/* Style image placeholders */
.product-image-placeholder {
  /* styles */
}

/* Target specific product by ID */
#product-camisa-social-masculina {
  /* styles */
}

/* Target products by category */
[data-product-category="jaleco"] {
  /* styles */
}

/* Style products without images */
[data-has-image="false"] .product-image-placeholder {
  /* styles */
}
```

## Image Integration Workflow

When adding product images in the future:

1. **Update the product data** in `DistributionStep.tsx` (lines 21-213):
   ```typescript
   {
     id: 'camisa-social-masculina',
     name: 'Camisa Social Masculina',
     image: '/path/to/image.jpg' // Add image path here
   }
   ```

2. **The system will automatically**:
   - Display the image instead of placeholder
   - Set `data-has-image="true"`
   - Set `data-image-status="loaded"`
   - Apply `.product-image` class instead of `.product-image-placeholder`

3. **No additional code changes needed** - all identifiers are in place

## Summary Statistics

- **Total Unique Product IDs**: 17
- **Main Catalog Cards**: 17 (DistributionStep.tsx)
- **Distribution Display Contexts**: 2 (OrcamentoPage.tsx)
- **Saved Quotes Contexts**: 1 (SavedQuotesModal.tsx)
- **Total Identifiable Elements**: 50+ across all contexts

## File Locations

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Product Catalog | `src/components/DistributionStep.tsx` | Main uniform catalog with all 17 products |
| Quote Review | `src/components/OrcamentoPage.tsx` | Display selected products in quote |
| Saved Quotes | `src/components/SavedQuotesModal.tsx` | Display products in saved quotes |
| Quiz Steps | `src/components/Quiz.tsx` | Quiz flow with distribution step |
| Help System | `src/components/HelpModal.tsx` | Help modal with context tracking |

## Notes

- All existing functionality preserved - no logic changes
- Identifiers follow consistent naming pattern
- Ready for image integration without breaking changes
- All data attributes are optional and non-breaking
- CSS classes follow BEM-like naming convention
- System supports both static images and dynamic loading
