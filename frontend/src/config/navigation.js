import {
  LayoutDashboard,
  Package,
  Palette,
  FileCheck,
  ShoppingBag,
  UserRound,
  Settings,
  Users,
  Tags,
  ClipboardList,
  Factory,
  ChartNoAxesCombined,
  Archive,
  Image,
  CircleHelp,
} from 'lucide-react';

import { DIVISIONS } from './divisions';

export const PUBLIC_NAVIGATION = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Products',
    path: '/products',
    children: DIVISIONS.map((division) => ({
      label: division.name,
      path: division.route,
    })),
  },
  {
    label: 'Gallery',
    path: '/gallery',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

export const CUSTOMER_NAVIGATION = [
  {
    label: 'Overview',
    path: '/account/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My Orders',
    path: '/account/orders',
    icon: ShoppingBag,
  },
  {
    label: 'My Designs',
    path: '/account/designs',
    icon: Palette,
  },
  {
    label: 'My Proofs',
    path: '/account/proofs',
    icon: FileCheck,
  },
  {
    label: 'Reorder',
    path: '/account/reorder',
    icon: Package,
  },
  {
    label: 'Profile',
    path: '/account/profile',
    icon: UserRound,
  },
];

export const ADMIN_NAVIGATION = [
  {
    label: 'Overview',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Analytics',
    path: '/admin/reports',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Proof Management',
    path: '/admin/proofs',
    icon: FileCheck,
  },
  {
    label: 'Production Queue',
    path: '/admin/production',
    icon: Factory,
  },
  {
    label: 'Archive',
    path: '/admin/archive',
    icon: Archive,
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: Package,
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: Tags,
  },
  {
    label: 'Templates',
    path: '/admin/templates',
    icon: Image,
  },
  {
    label: 'Customers',
    path: '/admin/customers',
    icon: Users,
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
];

export const ADMIN_ORDER_PIPELINE = [
  { id: 'quote', label: 'Quote', order: 1 },
  { id: 'order', label: 'Order', order: 2 },
  { id: 'artwork', label: 'Artwork', order: 3 },
  { id: 'proof', label: 'Proof', order: 4 },
  { id: 'production', label: 'Production', order: 5 },
  { id: 'completed', label: 'Completed', order: 6 },
];

export const FOOTER_NAVIGATION = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ],
  support: [
    { label: 'My Account', path: '/account/dashboard' },
    { label: 'My Orders', path: '/account/orders' },
    { label: 'Help & Support', path: '/contact' },
  ],
};

export const ICONS = {
  dashboard: LayoutDashboard,
  products: Package,
  designs: Palette,
  proofs: FileCheck,
  orders: ClipboardList,
  profile: UserRound,
  support: CircleHelp,
};

export default {
  PUBLIC_NAVIGATION,
  CUSTOMER_NAVIGATION,
  ADMIN_NAVIGATION,
  ADMIN_ORDER_PIPELINE,
  FOOTER_NAVIGATION,
};