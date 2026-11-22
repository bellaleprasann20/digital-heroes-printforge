
INSERT INTO public.categories (
    name,
    slug,
    description,
    icon,
    display_order,
    is_active
)
VALUES
(
    'Labels & Stickers',
    'labels-stickers',
    'Custom printed labels, product stickers and adhesive graphics.',
    'tags',
    1,
    TRUE
),
(
    'Race & Event Numbers',
    'race-event-numbers',
    'Custom race numbers, event bibs and participant identification.',
    'flag',
    2,
    TRUE
),
(
    'MTB Boards',
    'mtb-boards',
    'Custom mountain bike number plates and race boards.',
    'bike',
    3,
    TRUE
),
(
    'Stamps',
    'stamps',
    'Custom rubber stamps and business marking solutions.',
    'stamp',
    4,
    TRUE
),
(
    'Trophies',
    'trophies',
    'Personalized trophies, awards and recognition products.',
    'trophy',
    5,
    TRUE
),
(
    'Laser-cut Work',
    'laser-cut',
    'Precision laser-cut custom products and components.',
    'scissors',
    6,
    TRUE
)
ON CONFLICT (slug)
DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
