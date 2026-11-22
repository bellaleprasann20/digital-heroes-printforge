
# Pricing Logic

## 1. Purpose

The PrintForge pricing engine calculates accurate product quotations based on product specifications, dimensions, materials, quantities, optional services, discounts, and taxes.

All final calculations are performed on the backend.

## 2. Pricing Inputs

- Product ID
- Quantity
- Width
- Height
- Measurement unit
- Material
- Orientation
- Additional options
- Applicable discount rules
- Tax configuration

## 3. Measurement Conversion

The pricing engine converts dimensions into a consistent measurement unit before calculations.

Conversions:

- 1 cm = 10 mm
- 1 inch = 25.4 mm

Area in square metres:

Area = (Width in mm × Height in mm) / 1,000,000

## 4. Base Pricing

Different product divisions may use different pricing models.

### Area-Based Products

Examples:
- Labels
- Stickers
- MTB boards
- Some laser-cut products

Base Amount = Area × Rate per Square Metre × Quantity

### Unit-Based Products

Examples:
- Race numbers
- Stamps
- Trophies

Base Amount = Unit Price × Quantity

### Custom Products

Some products require additional production factors such as:
- Material type
- Thickness
- Finishing
- Engraving
- Cutting complexity
- Setup charges

These factors must be configured by product.

## 5. Material Adjustments

Material adjustments can be configured as:

- Fixed additional amount.
- Percentage multiplier.
- Per-unit surcharge.
- Area-based surcharge.

The backend must use the product's active material configuration.

## 6. Additional Options

Optional services can include:
- Lamination
- Protective coating
- Special finishing
- Custom cutting
- Premium material
- Additional artwork preparation

Each option must have a defined pricing method.

## 7. Volume Discounts

Illustrative discount structure:

| Quantity | Discount |
|---|---:|
| 1–49 | 0% |
| 50–99 | 5% |
| 100–249 | 10% |
| 250–499 | 15% |
| 500+ | 20% |

These are initial example values. Actual discount tiers should be approved and configured by the business.

Discount Amount = Eligible Subtotal × Discount Percentage

## 8. Tax Calculation

For an illustrative 18% tax configuration:

Tax Amount = Taxable Amount × 0.18

Tax rates and tax treatment must be configurable according to the applicable product and Indian tax requirements.

If prices are tax-inclusive, the tax must be extracted rather than added again.

For an inclusive tax rate:

Tax Component = Inclusive Amount × Tax Rate / (100 + Tax Rate)

## 9. Final Pricing Formula

For an exclusive-tax example:

Subtotal = Base Amount + Material Adjustments + Option Charges

Discounted Subtotal = Subtotal - Discount Amount

Tax Amount = Discounted Subtotal × Tax Rate

Final Total = Discounted Subtotal + Tax Amount + Shipping

## 10. Rounding

- Use decimal arithmetic or integer paise for monetary calculations.
- Store database amounts using NUMERIC.
- Round according to the approved currency and tax rules.
- Avoid JavaScript floating-point arithmetic for financial totals.

## 11. Quote Management

Each quotation should store:
- Customer ID
- Product configuration
- Quantity
- Pricing breakdown
- Tax rate
- Final amount
- Currency
- Creation time
- Expiration time
- Quote status

The order must reference a valid quote.

## 12. Security

The backend must:
- Validate product IDs.
- Validate dimensions.
- Validate minimum and maximum quantities.
- Validate active materials.
- Reject unsupported options.
- Recalculate prices.
- Verify quote ownership.
- Reject expired quotes.

The frontend displays estimated pricing but never determines the final payable amount.

## 13. Example

Illustrative calculation:

Product area: 0.5 m²

Rate: ₹500/m²

Quantity: 100

Base amount:

0.5 × 500 × 100 = ₹25,000

Discount: 10%

Discount amount: ₹2,500

Taxable amount: ₹22,500

Illustrative tax at 18%: ₹4,050

Final amount: ₹26,550

Shipping is excluded from this example.
