export type ImportScreenState =
  | 'upload_file'
  | 'file_selected'
  | 'map_columns'
  | 'customer_preview'
  | 'importing'
  | 'import_complete'
  | 'complete_with_skipped'
  | 'import_failed';

export interface CustomerFieldDefinition {
  order: number;
  field: string;
  label: string;
  group: 'Identity' | 'Contact' | 'Platform' | 'Loyalty' | 'Account' | 'Dates' | 'Location';
  exampleValue: string;
}

export const CUSTOMER_IMPORT_FIELDS: CustomerFieldDefinition[] = [
  { order: 1, field: 'first_name', label: 'First name', group: 'Identity', exampleValue: 'Asha' },
  { order: 2, field: 'last_name', label: 'Last name', group: 'Identity', exampleValue: 'Shrestha' },
  { order: 3, field: 'email', label: 'Email', group: 'Contact', exampleValue: 'asha@example.com' },
  { order: 4, field: 'platform_id', label: 'Platform ID', group: 'Platform', exampleValue: 'shopify_10482' },
  { order: 5, field: 'platform_type', label: 'Platform type', group: 'Platform', exampleValue: 'Shopify' },
  { order: 6, field: 'phone_number', label: 'Phone number', group: 'Contact', exampleValue: '+977 9800000000' },
  { order: 7, field: 'anniversary_date', label: 'Anniversary date', group: 'Dates', exampleValue: '2022-11-18' },
  { order: 8, field: 'date_of_birth', label: 'Date of birth', group: 'Dates', exampleValue: '1994-04-12' },
  { order: 9, field: 'loyalty_member', label: 'Loyalty member', group: 'Loyalty', exampleValue: 'Yes' },
  { order: 10, field: 'points_balance', label: 'Points balance', group: 'Loyalty', exampleValue: '640' },
  { order: 11, field: 'lifetime_points', label: 'Lifetime points', group: 'Loyalty', exampleValue: '1840' },
  { order: 12, field: 'is_active', label: 'Active status', group: 'Account', exampleValue: 'Yes' },
  { order: 13, field: 'username', label: 'Username', group: 'Account', exampleValue: 'asha.s' },
  { order: 14, field: 'joined_at', label: 'Joined at', group: 'Dates', exampleValue: '2024-02-21' },
  { order: 15, field: 'city', label: 'City', group: 'Location', exampleValue: 'Kathmandu' },
  { order: 16, field: 'region', label: 'Region', group: 'Location', exampleValue: 'Bagmati' },
  { order: 17, field: 'country', label: 'Country', group: 'Location', exampleValue: 'Nepal' },
  { order: 18, field: 'postal_code', label: 'Postal code', group: 'Location', exampleValue: '44600' },
];

export interface PreviewCustomer {
  id: string;
  name: string;
  email: string;
  platform: string;
  phone: string;
  loyaltyMember: boolean;
  pointsBalance: number;
  lifetimePoints: number;
  status: 'Active' | 'Inactive';
  location: string;
  avatarColor: string;
}

export const PREVIEW_CUSTOMERS: PreviewCustomer[] = [
  {
    id: 'cust-1',
    name: 'Asha Shrestha',
    email: 'asha@example.com',
    platform: 'Shopify (shopify_10482)',
    phone: '+977 9800000000',
    loyaltyMember: true,
    pointsBalance: 640,
    lifetimePoints: 1840,
    status: 'Active',
    location: 'Kathmandu, Nepal',
    avatarColor: 'bg-violet-100 text-[#5f3ed8]',
  },
  {
    id: 'cust-2',
    name: 'Devendra Maharjan',
    email: 'devendra.m@outlook.com',
    platform: 'Shopify (shopify_10483)',
    phone: '+977 9811122334',
    loyaltyMember: true,
    pointsBalance: 1220,
    lifetimePoints: 3450,
    status: 'Active',
    location: 'Lalitpur, Nepal',
    avatarColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'cust-3',
    name: 'Pooja Gurung',
    email: 'pooja.g@gmail.com',
    platform: 'Shopify (shopify_10484)',
    phone: '+977 9845566778',
    loyaltyMember: false,
    pointsBalance: 0,
    lifetimePoints: 120,
    status: 'Active',
    location: 'Pokhara, Nepal',
    avatarColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'cust-4',
    name: 'Rohan Tamang',
    email: 'rohan.tamang@gmail.com',
    platform: 'Shopify (shopify_10485)',
    phone: '+977 9860011223',
    loyaltyMember: true,
    pointsBalance: 450,
    lifetimePoints: 980,
    status: 'Active',
    location: 'Bhaktapur, Nepal',
    avatarColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'cust-5',
    name: 'Sunita Karki',
    email: 'sunita.k@icloud.com',
    platform: 'Shopify (shopify_10486)',
    phone: '+977 9823344556',
    loyaltyMember: true,
    pointsBalance: 2100,
    lifetimePoints: 5800,
    status: 'Active',
    location: 'Biratnagar, Nepal',
    avatarColor: 'bg-rose-100 text-rose-700',
  },
];

export const MOCK_FILE_INFO = {
  fileName: 'reloopin-customers-september.csv',
  fileType: 'CSV file',
  size: '1.8 MB',
  rows: '248 customer rows',
  columns: '18 columns found',
};

export const MOCK_IMPORT_RESULTS = {
  total: 248,
  completeSuccess: {
    imported: 248,
    skipped: 0,
    notImported: 0,
  },
  completeWithSkipped: {
    imported: 231,
    skipped: 17,
    notImported: 0,
  },
  inProgress: {
    percentage: 68,
    label: '169 of 248 customers',
  },
};

export interface PreviewStateOption {
  id: ImportScreenState;
  stepNumber: number;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
}

export const PREVIEW_STATE_OPTIONS: PreviewStateOption[] = [
  {
    id: 'upload_file',
    stepNumber: 1,
    title: '1. Upload file',
    subtitle: 'Initial empty upload state with sample template download',
  },
  {
    id: 'file_selected',
    stepNumber: 1,
    title: '2. File selected',
    subtitle: 'File card presented, ready for mapping',
  },
  {
    id: 'map_columns',
    stepNumber: 2,
    title: '3. Map columns',
    subtitle: '18 file columns matched to customer fields',
  },
  {
    id: 'customer_preview',
    stepNumber: 3,
    title: '4. Customer preview',
    subtitle: '5 sample customers table and import preferences',
  },
  {
    id: 'importing',
    stepNumber: 4,
    title: '5. Importing',
    subtitle: 'Progress card at 68% (169 of 248 customers)',
  },
  {
    id: 'import_complete',
    stepNumber: 4,
    title: '6. Import complete',
    subtitle: '248 imported, 0 skipped success card',
    badge: 'Success',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'complete_with_skipped',
    stepNumber: 4,
    title: '7. Complete with skipped rows',
    subtitle: '231 imported, 17 skipped existing records',
    badge: '17 Skipped',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'import_failed',
    stepNumber: 4,
    title: '8. Import failed',
    subtitle: 'Error card with retry option and untouched list',
    badge: 'Failed',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];
