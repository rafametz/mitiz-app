export type UnitType = "kg" | "unidade" | "pacote";

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  unit_type: UnitType;
  price_per_unit: number;
  ncm: string | null;
  product_code: string | null;
  brand: string | null;
  grams_per_unit: number | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
};

export type Promotion = {
  id: string;
  product_id: string | null;
  title: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  starts_at: string | null;
  ends_at: string | null;
  image_url: string | null;
  is_active: boolean;
};

export type NewsItem = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  published_at: string;
  is_active: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  is_active: boolean;
};

export type CalculatorSettings = {
  id: string;
  grams_per_adult: number;
  grams_per_child: number;
  bread_product_id: string | null;
  bread_units_per_package: number;
  cheese_product_id: string | null;
  cheese_people_per_package: number;
};

export type CalculatorGroup = {
  id: string;
  key: string;
  label: string;
  percent: number;
  category_id: string | null;
  max_selections: number;
  sort_order: number;
};

export type CartItem = {
  productId: string;
  name: string;
  unitType: UnitType;
  unitPrice: number;
  quantity: number;
};

export type OrderStatus =
  | "novo"
  | "em_analise"
  | "confirmado"
  | "entregue"
  | "cancelado";

export type Order = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  total_estimated: number;
  notes: string | null;
  whatsapp_sent_at: string | null;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_snapshot: number;
  subtotal: number;
  products: { name: string } | null;
};

export type PointsTransaction = {
  id: string;
  customer_id: string;
  order_id: string | null;
  type: "ganho" | "resgate" | "ajuste";
  points: number;
  description: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  role: "cliente" | "admin";
  points_balance: number;
  created_at: string;
};

export type Reward = {
  id: string;
  title: string;
  description: string | null;
  points_cost: number;
  reward_type: "desconto_percent" | "desconto_fixo" | "brinde";
  value: number | null;
  stock: number | null;
  is_active: boolean;
};
