export const DIVISIONS = [
  {
    id: 'labels_stickers',
    slug: 'labels-stickers',
    name: 'Labels & Stickers',
    shortName: 'Labels',
    description: 'Custom labels, product stickers and branded adhesive prints.',
    route: '/products/labels-stickers',
    icon: 'tags',
    accent: '#D97745',
    displayOrder: 1,
    active: true,
  },
  {
    id: 'race_numbers',
    slug: 'race-numbers',
    name: 'Race & Event Numbers',
    shortName: 'Race Numbers',
    description: 'Durable race numbers and event identification prints.',
    route: '/products/race-numbers',
    icon: 'flag',
    accent: '#D6A43B',
    displayOrder: 2,
    active: true,
  },
  {
    id: 'mtb_boards',
    slug: 'mtb-boards',
    name: 'MTB Boards',
    shortName: 'MTB Boards',
    description: 'Custom mountain bike number plates and boards.',
    route: '/products/mtb-boards',
    icon: 'bike',
    accent: '#78936B',
    displayOrder: 3,
    active: true,
  },
  {
    id: 'stamps',
    slug: 'stamps',
    name: 'Stamps',
    shortName: 'Stamps',
    description: 'Custom business, office and personalised stamps.',
    route: '/products/stamps',
    icon: 'stamp',
    accent: '#8B83A8',
    displayOrder: 4,
    active: true,
  },
  {
    id: 'trophies',
    slug: 'trophies',
    name: 'Trophies',
    shortName: 'Trophies',
    description: 'Personalised awards, trophies and recognition pieces.',
    route: '/products/trophies',
    icon: 'trophy',
    accent: '#C59A50',
    displayOrder: 5,
    active: true,
  },
  {
    id: 'laser_cut',
    slug: 'laser-cut',
    name: 'Laser-cut Work',
    shortName: 'Laser Cutting',
    description: 'Precision-cut custom pieces and personalised designs.',
    route: '/products/laser-cut',
    icon: 'scan',
    accent: '#6F91A1',
    displayOrder: 6,
    active: true,
  },
];

export const getDivisionBySlug = (slug) =>
  DIVISIONS.find((division) => division.slug === slug) || null;

export const getDivisionById = (id) =>
  DIVISIONS.find((division) => division.id === id) || null;

export const getActiveDivisions = () =>
  DIVISIONS.filter((division) => division.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

export default DIVISIONS;