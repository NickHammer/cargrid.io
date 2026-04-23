export interface Car {
  id: string;
  make: string;
  model: string;
  generation: number;
  brands: string[];
  country_of_origin: string;
  production_start: number;
  production_end: number | null;
  decades: string[];
  engine_layouts: string[];
  body_style: string;
  drivetrain: string[];
  car_class: string;
  power_output_hp_min: number;
  power_output_hp_max: number;
  power_output_ranges: string[];
  transmission: string[];
  fuel_type: string[];
  pop_culture: string[] | null;
  price_at_launch_usd: number | null;
  manufacturer_still_active: boolean;
  image_url: string;
}

export type ParameterType =
  | "brand"
  | "country_of_origin"
  | "decade"
  | "engine_layout"
  | "body_style"
  | "drivetrain"
  | "car_class"
  | "power_output"
  | "transmission"
  | "fuel_type"
  | "pop_culture"
  | "price_at_launch"
  | "manufacturer_still_active";

export interface GridParameter {
  type: ParameterType;
  value: string;
  label: string;
}

export interface GridLayout {
  id: string;
  date: string;
  rows: [GridParameter, GridParameter, GridParameter];
  columns: [GridParameter, GridParameter, GridParameter];
}

export interface CellState {
  solved: boolean;
  carId: string | null;
}

export interface GameState {
  date: string;
  gridId: string;
  /** 9 elements in row-major order: index = row * 3 + col */
  cells: CellState[];
  guessesUsed: number;
}
