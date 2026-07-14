export interface MenuFilter {
  id: number;
  key: string;
  name: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  img_url: string;
}

export interface MenuConfigResponse {
  filters: MenuFilter[];
  categories: MenuCategory[];
  success: boolean;
  message?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: number;
  category_name: string;
  food_type: string;
  available: boolean;
  popular: boolean;
  recommended: boolean;
  best_seller: boolean;
  chef_special: boolean;
  today_special: boolean;
  new_arrival: boolean;
  quick_bites: boolean;
  combo: boolean;
  spicy: boolean;
  jain: boolean;
  preparation_time: number;
}

export interface MenuItemWithQuantity extends MenuItem {
  quantity: number;
}

export interface MenuItemsResponse {
  success: boolean;
  items: MenuItem[];
  filter_id: number;
  filter_key: string;
  total_items: number;
  message?: string;
}
export interface WaiterMenuState {
  filters: MenuFilter[];
  categories: MenuCategory[];
  items: MenuItem[];
  selectedFilter: MenuFilter | null;
  selectedCategory: MenuCategory | null;

  loading: boolean;
  error: string | null;
}