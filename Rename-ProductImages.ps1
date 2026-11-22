param(
    [switch]$Apply
)

$ErrorActionPreference = "Stop"

# Run this script from the digital-heroes-printforge project root.
$projectRoot = (Get-Location).Path
$productsRoot = Join-Path $projectRoot "frontend\public\products"

if (-not (Test-Path $productsRoot -PathType Container)) {
    Write-Host "ERROR: frontend\public\products was not found." -ForegroundColor Red
    Write-Host "Open PowerShell in your digital-heroes-printforge folder and run this script again."
    exit 1
}

$mappingJson = @'
[
  {
    "Category": "labels_stickers",
    "OldName": "Business Address Label _ Logo Company Info Sticker.jpeg",
    "NewName": "Shipping-Address-Labels.jpeg",
    "Confidence": "High",
    "Note": "Address label; check if this is the intended shipping label."
  },
  {
    "Category": "labels_stickers",
    "OldName": "Choice TamperSafe 8_.jpeg",
    "NewName": "Tamper-Evident-Labels.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "cosmetic-jar-labels.webp",
    "NewName": "Cosmetic-Jar-Labels.webp",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Custom Die-Cut Stickers 20pcs (2cm - 10cm) - Print Your Own Design _ Logo _ High Quality Waterproof _ Laminated.jpeg",
    "NewName": "Die-Cut-Vinyl-Stickers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Custom Packaging Labels, Custom Product Labels, Waterproof Vinyl Labels, Personalized Packaging Stickers, Private Label Labels.jpeg",
    "NewName": "Custom-Product-Labels.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Custom Sign for Your Business _ Custom Vinyl Lettering Window or Door Decal _ Customized Lettering or Numbers, _ Hours or Open Sign for Office,.jpeg",
    "NewName": "Window-Vinyl-Decals.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Custom Vinyl Die Cut Stickers - Waterproof, Scratch Resistant.jpeg",
    "NewName": "Die-Cut-Logo-Decals.jpeg",
    "Confidence": "Medium",
    "Note": "Could also fit Die-Cut Vinyl Stickers; check against the other die-cut image."
  },
  {
    "Category": "labels_stickers",
    "OldName": "food-packaging-stickers.webp",
    "NewName": "Food-Packaging-Stickers.webp",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Free Laptop Sticker On Rock Mockup PSD.jpeg",
    "NewName": "Laptop-Branding-Stickers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Innoveem Freezer Labels Easy Peel Off - Frozen Food Labels Stickers that Leave No Sticky Residue After Use - Perfectly Sized Reusable Fridge Labels (6.jpeg",
    "NewName": "Freezer-Safe-Labels.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Kraft Paper Rectangular Self-Adhesive Packaging Stickers Customized Logo for Small Businesses -.jpeg",
    "NewName": "Kraft-Paper-Labels.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Minimalist Custom Business Logo & QR Code Classic Round Sticker _ Zazzle.jpeg",
    "NewName": "Round-Logo-Stickers.jpeg",
    "Confidence": "Medium",
    "Note": "Round logo sticker with QR code; QR Code Stickers is another possible match."
  },
  {
    "Category": "labels_stickers",
    "OldName": "Personalised Matt Business Logo Stickers_ Rectangle Packaging Labels for Small Businesses.jpeg",
    "NewName": "Rectangle-Logo-Stickers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "sticker pack mockup _ Download Shipping barcode sticker label template_ for free.jpeg",
    "NewName": "Barcode-Product-Labels.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "Thank You Custom Company Logo QR Code Social Media Classic Round Sticker.jpeg",
    "NewName": "QR-Code-Stickers.jpeg",
    "Confidence": "Medium",
    "Note": "Could also fit Round Logo Stickers."
  },
  {
    "Category": "labels_stickers",
    "OldName": "transparent-bottle-labels.webp",
    "NewName": "Transparent-Bottle-Labels.webp",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "labels_stickers",
    "OldName": "waterproof-product-labels.webp",
    "NewName": "Waterproof-Product-Labels.webp",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "393150242492457705.jpeg",
    "NewName": "Custom-Wooden-Keychain.jpeg",
    "Confidence": "Low",
    "Note": "Filename gives no clue; inspect this image."
  },
  {
    "Category": "laser_cut",
    "OldName": "Black Acrylic Letters - Custom Wall Decor, Wedding Sign.jpeg",
    "NewName": "Custom-Acrylic-Letters.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Boho Wooden Wall Art Set.jpeg",
    "NewName": "Wooden-Wall-Art.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Botanical Floral Laser Cut File _ Decorative Privacy Screen Panel (wall Art) - Etsy.jpeg",
    "NewName": "Laser-Cut-Decorative-Panel.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Class of 2026 Keychain Laser Cut Files Bundle SVG - Graduation Gift Wood Engraving.jpeg",
    "NewName": "Laser-Cut-Keychain.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Custom Acrylic Business Sign for Property Group Office.jpeg",
    "NewName": "Acrylic-Business-Sign.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Custom Acrylic Photo Standee _ Wedding Guest Sign In Idea.jpeg",
    "NewName": "Acrylic-Photo-Frame.jpeg",
    "Confidence": "Medium",
    "Note": "Could be Acrylic Table Display; inspect image."
  },
  {
    "Category": "laser_cut",
    "OldName": "Custom Led Backlit Wooden Business Sign.jpeg",
    "NewName": "Wooden-Corporate-Logo.jpeg",
    "Confidence": "Medium",
    "Note": "Could be another business sign product."
  },
  {
    "Category": "laser_cut",
    "OldName": "Desk Name Plate, Office Desk Decor, New Job Gift, Personalized Name Plaque, Modern Office Sign, Business Sign, Desk Accessories, Logo Sign.jpeg",
    "NewName": "Custom-Desk-Name-Sign.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "FranJohnsonHouse Personalized Custom Name Ornament _ Wood & Acrylic Keepsake Bauble, Wood.jpeg",
    "NewName": "Personalized-Acrylic-Ornament.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Happy Birthday Cake Topper — Laser Cut 3mm Plywood Decor, SVG + DXF.jpeg",
    "NewName": "Laser-Cut-Cake-Topper.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Kit com 10 Unidades Expositor Folder Com Porta Guardanapos Acrílico _ Shopee Brasil.jpeg",
    "NewName": "Acrylic-Menu-Holder.jpeg",
    "Confidence": "Medium",
    "Note": "Likely an acrylic display/napkin holder; check image."
  },
  {
    "Category": "laser_cut",
    "OldName": "Laser Cut 3D Snowflake Gift Box with Ribbon Slots SVG.jpeg",
    "NewName": "Laser-Cut-Gift-Box.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Laser Cut Acrylic Phone Holders _ Laser Cut Acrylic Ideas.jpeg",
    "NewName": "Acrylic-Table-Display.jpeg",
    "Confidence": "Low",
    "Note": "Phone holder is not an exact product-name match; inspect image."
  },
  {
    "Category": "laser_cut",
    "OldName": "Luxury Faux Brushed Gold Custom Desk Name Plate.jpeg",
    "NewName": "Custom-Acrylic-Nameplate.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Makeup Artist Name Plate, Custom Beauty Salon Desk Sign Engraved Plaque for MUA Vanity Studio Decor.jpeg",
    "NewName": "Custom-Desk-Name-Sign-2.jpeg",
    "Confidence": "Medium",
    "Note": "Possible alternative to Custom Desk Name Sign; adjust if needed."
  },
  {
    "Category": "laser_cut",
    "OldName": "Personalized Infinity Heart Wooden Plaque, Custom Couple Anniversary Gift, Romantic Wedding Keepsake Decor.jpeg",
    "NewName": "Laser-Cut-Wedding-Decor.jpeg",
    "Confidence": "Medium",
    "Note": "Could be wedding decor; inspect image."
  },
  {
    "Category": "laser_cut",
    "OldName": "Personalized Name Plate for house door 🚪_Name….jpeg",
    "NewName": "Wooden-Door-Nameplate.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Premium Customized Gold & Black Acrylic QR Code Stand with Business Logo.jpeg",
    "NewName": "Acrylic-QR-Code-Stand.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "laser_cut",
    "OldName": "Wooden Wedding Favors - Create Memorable Keepsakes for Your Guests.jpeg",
    "NewName": "Laser-Cut-Wedding-Decor-2.jpeg",
    "Confidence": "Medium",
    "Note": "Possible alternative to the infinity-heart plaque; correct one of these if needed."
  },
  {
    "Category": "mtb_boards",
    "OldName": "4d Gloss finish bike Motorbike _ Motorcycle Rear Number Plate - 9x7 - Premium 100% ROAD_MOT Legal.jpeg",
    "NewName": "Custom-Motorcycle-Number-Boards.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "672936369322301867.jpeg",
    "NewName": "Professional-Race-Boards.jpeg",
    "Confidence": "Low",
    "Note": "Numeric filename; inspect image."
  },
  {
    "Category": "mtb_boards",
    "OldName": "Awesome number plates for a dirtbike_.jpeg",
    "NewName": "Motocross-Front-Boards.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Custom Design BMX Numberplate Sticker _ Bmx Race _ Box numberplate _ Custom Racing Plate _ Bmx World Championship _ USA BMX Grands _ Decal.jpeg",
    "NewName": "BMX-Race-Number-Plates.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Custom Mountain Bike plate sticker for ODI DH plate surron talaria eride.jpeg",
    "NewName": "Downhill-Bike-Number-Plates.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Custom ODI, E Bike Front Plate Sticker - Personalized MTB, DH, Sur Ron Bike Decal.jpeg",
    "NewName": "Custom-MTB-Front-Number-Plate.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Cycling Jerseys _ Custom _ Road _ Enduro _ MTB _ Run.jpeg",
    "NewName": "Team-MTB-Branding-Boards.jpeg",
    "Confidence": "Low",
    "Note": "Jersey image may not match a number board; inspect."
  },
  {
    "Category": "mtb_boards",
    "OldName": "FANCY LASER PLATES 🇨🇦.jpeg",
    "NewName": "Acrylic-MTB-Number-Boards.jpeg",
    "Confidence": "Medium",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Kids Personalized License Plate Name Sign Custom Bike Name Plate Toy Car Personalized Kids Name Sign.jpeg",
    "NewName": "Custom-Rider-Name-Plates.jpeg",
    "Confidence": "Medium",
    "Note": "Personalized bike plate; verify."
  },
  {
    "Category": "mtb_boards",
    "OldName": "Lamborghini Decal Stickers on Bike_ Lamborghini Decals - Etsy.jpeg",
    "NewName": "Bike-Frame-Decal-Kits.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Motone Sidekick Side Mount Number Plate Kit for Triumph Bobber - No Tail Light.jpeg",
    "NewName": "MTB-Side-Number-Plates.jpeg",
    "Confidence": "Low",
    "Note": "This is a motorcycle side plate, not necessarily an MTB board."
  },
  {
    "Category": "mtb_boards",
    "OldName": "MTB.jpeg",
    "NewName": "Custom-MTB-Number-Plates.jpeg",
    "Confidence": "Low",
    "Note": "Generic filename; inspect image."
  },
  {
    "Category": "mtb_boards",
    "OldName": "Personalized Moto Pit Board _ Custom Motocross Race Sign _ Dirt Bike Pit Board with Name & Number _ MX Track Accessory.jpeg",
    "NewName": "Professional-Race-Boards-2.jpeg",
    "Confidence": "Medium",
    "Note": "Possible alternative to Professional Race Boards; inspect image."
  },
  {
    "Category": "mtb_boards",
    "OldName": "Premium Motorcycle Motorbike Novelty 2d 6x4_ Show Number Plate.jpeg",
    "NewName": "Mini-MTB-Number-Plates.jpeg",
    "Confidence": "Low",
    "Note": "Motorcycle novelty plate; may not be an MTB product."
  },
  {
    "Category": "mtb_boards",
    "OldName": "Race Car License Plate 24 Hour Race Sticker.jpeg",
    "NewName": "Race-Plate-Sponsor-Graphics.jpeg",
    "Confidence": "Low",
    "Note": "Race-car plate may not match an MTB product; inspect image."
  },
  {
    "Category": "mtb_boards",
    "OldName": "SPACE MOTO Grafische stickers en sets voor KTM EXC 125 200 250 300 350 450 500 2012 2013, met.jpeg",
    "NewName": "Motocross-Side-Graphics.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "mtb_boards",
    "OldName": "Wp520 Kompatible Aufkleber Rockshox Pike 2022-2024 Set Decals.jpeg",
    "NewName": "Matte-Finish-Race-Plates.jpeg",
    "Confidence": "Low",
    "Note": "Fork decals are not a direct number-plate match; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "1 2 3 4 5 6 7 8 9 0 Numbers AI Text Effect _ Cricket Text Effect.jpeg",
    "NewName": "Cricket-Tournament-Numbers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "5Sets Bicycle Number Plate Bracket Headlight Mount Road Racing Bike Accessories.jpeg",
    "NewName": "Cycling-Race-Numbers.jpeg",
    "Confidence": "Medium",
    "Note": "Bracket/accessory rather than number graphic; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "Aangepaste marathonraceslabbetjes met veiligheidsspelden Waterdichte scheurbestendige nummerlabels.jpeg",
    "NewName": "Marathon-Bib-Numbers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "another day, another philly 10k.jpeg",
    "NewName": "Running-Event-Stickers.jpeg",
    "Confidence": "Medium",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "Custom Race Number & Name Stickers - UV Laminated - Motorcycle, Kart, Car - 3x.jpeg",
    "NewName": "Custom-Team-Race-Numbers.jpeg",
    "Confidence": "Medium",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "Custom Racing Number Stickers & Magnets - Personalized Name, Flag Decals, Rectangular, Matte Vinyl or 3D Domed Epoxy.jpeg",
    "NewName": "Car-Rally-Number-Decals.jpeg",
    "Confidence": "Medium",
    "Note": "Could fit custom team numbers; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "download (5).jpeg",
    "NewName": "Event-Number-Stickers.jpeg",
    "Confidence": "Low",
    "Note": "Generic filename; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "download (6).jpeg",
    "NewName": "Race-Timing-Stickers.jpeg",
    "Confidence": "Low",
    "Note": "Generic filename; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "Football Bibs for Adult Youth, 24 Pack Sports Training Mesh Bibs, Numbered Practice Vest Pennies for Soccer Basketball Football Volleyball - Orange &.jpeg",
    "NewName": "Football-Training-Numbers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "MAGNET Custom Track Autocross Race Car Number Plate - Reusable 1x Piece - Etsy.jpeg",
    "NewName": "Go-Kart-Number-Stickers.jpeg",
    "Confidence": "Medium",
    "Note": "Could instead be Car Rally Number Decals; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "Number plates #bikeart.jpeg",
    "NewName": "Triathlon-Bib-Numbers.jpeg",
    "Confidence": "Low",
    "Note": "Image title suggests bike number plates; this product name may be a poor match."
  },
  {
    "Category": "race_numbers",
    "OldName": "Polbeng Run 2026 Custom Race Bibs _ SPUNKYⓢ Event Essentials.jpeg",
    "NewName": "Trail-Running-Bibs.jpeg",
    "Confidence": "Medium",
    "Note": "Could be general event bibs; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "Reflective Kanjo Osaka Japanese JDM Racing Team Vinyl Decal Sticker for Car Windshield Truck Decor.jpeg",
    "NewName": "Reflective-Race-Decals.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "Sports day Stickers.jpeg",
    "NewName": "School-Sports-Bibs.jpeg",
    "Confidence": "Low",
    "Note": "Generic sports-day image; inspect image."
  },
  {
    "Category": "race_numbers",
    "OldName": "Swimming Starting Blocks_ Starting platforms with numbers for swimming races #Sponsored , #SPONSORED, #SPONSORED, #Starting, #swimming, #races, #Blocks.jpeg",
    "NewName": "Swimming-Competition-Numbers.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "race_numbers",
    "OldName": "TOMAIX 12_24 Pack Sports Bibs, Breathable Training Vests for Teams _ Lightweight practice pinnies for kids, youths and adults, football, basketball,.jpeg",
    "NewName": "Event-Sponsor-Bibs.jpeg",
    "Confidence": "Medium",
    "Note": "Sports training bibs; may fit School Sports Bibs instead."
  },
  {
    "Category": "race_numbers",
    "OldName": "⚡🏃Running Stickers Pack ( 50 pcs ) Rare__These stickers are 100% unique + original designs, crafted with passion for the running community 🏃🔥__✔️ Instant Download (PDF)_✔️ 50 vector stickers – 7×7 cm each_✔️ Fu.jpeg",
    "NewName": "Mountain-Race-Numbers.jpeg",
    "Confidence": "Low",
    "Note": "Running sticker pack may not match a race-number product."
  },
  {
    "Category": "stamps",
    "OldName": "1100989440168468664.jpeg",
    "NewName": "Industrial-Marking-Stamp.jpeg",
    "Confidence": "Low",
    "Note": "Numeric filename; inspect image."
  },
  {
    "Category": "stamps",
    "OldName": "Approved stock photo_ Image of success, control, quality - 12421078.jpeg",
    "NewName": "Approved-Office-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Business Return Address _ Professional Logo Modern Self-inking Stamp.jpeg",
    "NewName": "Company-Address-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Custom Rubber Roller Stamp Personalized Business Logo Seal Large Size for Kraft Paper Bags Packaging.jpeg",
    "NewName": "Business-Logo-Stamp.jpeg",
    "Confidence": "Medium",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Custom Rubber Stamp _ Handmade by_ Made with Love by _ Self Inking _ Crochet _ Personalised _ Business _ Rectangle 14mm x 38mm _SKU Rec001.jpeg",
    "NewName": "Custom-Craft-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Custom Star & School Logo Embosser Seal _ Personalized Stamp Stamprints.jpeg",
    "NewName": "Embossing-Seal-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Individuell gestaltbarer Selbstfärbestempel, personalisierter Logostempel, Monogrammstempel, Nachfüllstempel, personalisierter Hochzeitseinladungsstempel, Stempel für Paare.jpeg",
    "NewName": "Custom-Self-Inking-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Loyalty Card with Purchase Rewards Thank You for Support! 10 Stamps for Special Offers.jpeg",
    "NewName": "Loyalty-Card-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Mark 2000 5440 Professional Self Inking Date Stamp with Custom Text - Up to 4 Lines of Text.jpeg",
    "NewName": "Date-Self-Inking-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Maryland Notary Round Seal - Choose Stamp or Embosser.jpeg",
    "NewName": "Notary-Style-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Paid Self-Inking Rubber Business Stamper for Office - Red Ink _ Quick Document Stamp, Refillable, Clear Impressions, Compact, Lightweight, Durable,.jpeg",
    "NewName": "Paid-Office-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Personalized Handmade By Stamp, Custom Name Etsy Shop Stamp, Business Card Stamp, Handmade Stamp, Floral Eucalyptus Small Business Gift Tag.jpeg",
    "NewName": "Wooden-Handle-Rubber-Stamp.jpeg",
    "Confidence": "Medium",
    "Note": "Could instead be Custom Craft Stamp; inspect handle style."
  },
  {
    "Category": "stamps",
    "OldName": "Pocket Signature Stamp, Personalized Self-Inking Name Stamp, Custom Handwriting Stamp for Office, Business & Teachers, DIY Craft Supplies.jpeg",
    "NewName": "Pocket-Self-Inking-Stamp.jpeg",
    "Confidence": "Medium",
    "Note": "Could fit Signature Rubber Stamp."
  },
  {
    "Category": "stamps",
    "OldName": "Pre-Inked Rubber Stamps Online Rubber stamps are….jpeg",
    "NewName": "Large-Format-Rubber-Stamp.jpeg",
    "Confidence": "Low",
    "Note": "Generic listing; inspect image."
  },
  {
    "Category": "stamps",
    "OldName": "Product packaging stamp.jpeg",
    "NewName": "Packaging-Inspection-Stamp.jpeg",
    "Confidence": "Medium",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Professional Business Logo _ Return Address _ Self-inking Stamp _ Zazzle.jpeg",
    "NewName": "Round-Company-Seal.jpeg",
    "Confidence": "Medium",
    "Note": "Could be Business Logo Stamp; inspect shape."
  },
  {
    "Category": "stamps",
    "OldName": "Promot Self-Inking Received Rubber Stamp with Red Ink.jpeg",
    "NewName": "Received-Office-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Shop Custom Small Business Logo Stamps for Handmade Products with Custom Artwork.jpeg",
    "NewName": "Signature-Rubber-Stamp.jpeg",
    "Confidence": "Low",
    "Note": "Could be Business Logo Stamp; inspect image."
  },
  {
    "Category": "stamps",
    "OldName": "Teacher Stamps for Classroom, Self Inking Grading Stamps Set.jpeg",
    "NewName": "Teacher-Reward-Stamp.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "stamps",
    "OldName": "Top 6 Rubber Stamping Techniques to Enhance Your___.jpeg",
    "NewName": "Custom-Rubber-Stamp.jpeg",
    "Confidence": "Low",
    "Note": "Article/technique image may not show a product; inspect image."
  },
  {
    "Category": "trophies",
    "OldName": "511088257734371264.jpeg",
    "NewName": "Best-Performer-Award.jpeg",
    "Confidence": "Low",
    "Note": "Numeric filename; inspect image."
  },
  {
    "Category": "trophies",
    "OldName": "752804894009504611.jpeg",
    "NewName": "Sports-Championship-Trophy.jpeg",
    "Confidence": "Low",
    "Note": "Numeric filename; inspect image."
  },
  {
    "Category": "trophies",
    "OldName": "885520345507760699.jpeg",
    "NewName": "Premium-Gold-Finish-Trophy.jpeg",
    "Confidence": "Low",
    "Note": "Numeric filename; inspect image."
  },
  {
    "Category": "trophies",
    "OldName": "ballet trophy edited.jpeg",
    "NewName": "Dance-Competition-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Custom Award Shield Printing in Lahore – Acrylic & Wooden Options.jpeg",
    "NewName": "Custom-Acrylic-Award.jpeg",
    "Confidence": "Medium",
    "Note": "Shield award; verify acrylic/wood material."
  },
  {
    "Category": "trophies",
    "OldName": "Custom ICC Champions Trophy Replica - Solid Brass & Steel Metal Collectible.jpeg",
    "NewName": "Cricket-Tournament-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Custom Medal & Trophy Design Ideas _ Triumph Gifts Awards Inspiration.jpeg",
    "NewName": "Custom-Medal-and-Trophy-Set.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Custom Student of the Week Trophy Cup - Personalized Classroom Trophy Award - Achievement Gifts.jpeg",
    "NewName": "Academic-Achievement-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Customized Memento.jpeg",
    "NewName": "Wooden-Plaque-Award.jpeg",
    "Confidence": "Medium",
    "Note": "Check if the memento is wooden."
  },
  {
    "Category": "trophies",
    "OldName": "Employee Of The Month Trophy 7_ Tall As Low As $3_99 Each T03n11.jpeg",
    "NewName": "Employee-Recognition-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Large Engraved Running Trophy, 15_75 Inches Tall, Personalized Race Champion Award, Track and Field, Marathon Winner, Resin and Crystal.jpeg",
    "NewName": "Marathon-Finisher-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Modern Crystal Trophy for Achievement Ceremony.jpeg",
    "NewName": "Crystal-Achievement-Award.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Nothing beats the moment a footballer lifts the….jpeg",
    "NewName": "Football-Winner-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Personalized Crystal and Wood Award, Custom Corporate Recognition Trophy, Executive Appreciation Gift.jpeg",
    "NewName": "Corporate-Excellence-Award.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Personalized Cycling Trophy_ Engraved Resin Bike Award, Choice Of 2 Sizes.jpg",
    "NewName": "Cycling-Champion-Trophy.jpg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Personalized Music Award Trophy 12_( 30 Cm)- Custom Engraved Student Recognition Recital Award.jpeg",
    "NewName": "Music-Competition-Award.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Personalized Star Acrylic Award - Multiple Sizes, Clear_Blue_Jade Colors - Custom Engraved Recognition Award.jpeg",
    "NewName": "Acrylic-Star-Award.jpeg",
    "Confidence": "High",
    "Note": ""
  },
  {
    "Category": "trophies",
    "OldName": "Personalized _ Academic Award _ Custom Engraved _ Academic Trophy _ Graduation Award _ Student Achievement _ Teacher Gift.jpeg",
    "NewName": "School-Sports-Trophy.jpeg",
    "Confidence": "Low",
    "Note": "Academic trophy is not necessarily a school sports trophy; correct target if needed."
  },
  {
    "Category": "trophies",
    "OldName": "Visual Arts Award, Personalized Laser Engraved Clear Acrylic Trophy.jpeg",
    "NewName": "Laser-Engraved-Acrylic-Trophy.jpeg",
    "Confidence": "High",
    "Note": ""
  }
]
'@

$mappings = $mappingJson | ConvertFrom-Json

Write-Host ""
if ($Apply) {
    Write-Host "APPLY MODE: files will now be renamed." -ForegroundColor Yellow
} else {
    Write-Host "PREVIEW MODE: no files will be changed." -ForegroundColor Cyan
    Write-Host "Review this list first. To actually rename, run: .\Rename-ProductImages.ps1 -Apply"
}
Write-Host ""

$renamed = 0
$skipped = 0

foreach ($item in $mappings) {
    $folder = Join-Path $productsRoot $item.Category
    $source = Join-Path $folder $item.OldName
    $destination = Join-Path $folder $item.NewName

    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        Write-Host "[MISSING] $($item.Category)\$($item.OldName)" -ForegroundColor Yellow
        $skipped++
        continue
    }

    if ((Test-Path -LiteralPath $destination) -and ($source -ne $destination)) {
        Write-Host "[EXISTS - SKIPPED] $($item.Category)\$($item.NewName)" -ForegroundColor Yellow
        $skipped++
        continue
    }

    if ($source -eq $destination) {
        Write-Host "[ALREADY NAMED] $($item.Category)\$($item.NewName)" -ForegroundColor DarkGray
        continue
    }

    if ($Apply) {
        Rename-Item -LiteralPath $source -NewName $item.NewName
        Write-Host "[RENAMED] $($item.Category)\$($item.OldName)  ->  $($item.NewName)" -ForegroundColor Green
        $renamed++
    } else {
        Write-Host "[PREVIEW] $($item.Category)\$($item.OldName)  ->  $($item.NewName)"
        $renamed++
    }
}

Write-Host ""
if ($Apply) {
    Write-Host "Finished. Renamed: $renamed | Skipped: $skipped" -ForegroundColor Green
} else {
    Write-Host "Preview complete. Would rename: $renamed | Skipped: $skipped" -ForegroundColor Cyan
    Write-Host "No files have been changed."
}
