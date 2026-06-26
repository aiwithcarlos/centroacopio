export interface TagDefinition {
  slug: string;
  name: string;
  category: 'medico' | 'alimentos' | 'higiene' | 'ropa' | 'equipos' | 'refugio';
}

export const PREDEFINED_TAGS: TagDefinition[] = [
  // Médicos
  { slug: 'agua-potable', name: 'Agua potable', category: 'alimentos' },
  { slug: 'alcohol', name: 'Alcohol', category: 'medico' },
  { slug: 'agua-oxigenada', name: 'Agua oxigenada', category: 'medico' },
  { slug: 'gasas', name: 'Gasas', category: 'medico' },
  { slug: 'vendas', name: 'Vendas', category: 'medico' },
  { slug: 'jeringas', name: 'Jeringas', category: 'medico' },
  { slug: 'guantes-quirurgicos', name: 'Guantes quirúrgicos', category: 'medico' },
  { slug: 'mascarillas', name: 'Mascarillas', category: 'medico' },
  { slug: 'analgesicos', name: 'Analgésicos', category: 'medico' },
  { slug: 'antibioticos', name: 'Antibióticos', category: 'medico' },
  { slug: 'antiinflamatorios', name: 'Antiinflamatorios', category: 'medico' },
  { slug: 'suero-fisiologico', name: 'Suero fisiológico', category: 'medico' },
  { slug: 'cal', name: 'Cal', category: 'medico' },
  { slug: 'formol', name: 'Formol', category: 'medico' },
  // Higiene
  { slug: 'panales', name: 'Pañales', category: 'higiene' },
  { slug: 'toallas-sanitarias', name: 'Toallas sanitarias', category: 'higiene' },
  // Alimentos
  { slug: 'enlatados', name: 'Enlatados', category: 'alimentos' },
  { slug: 'leche-formulada', name: 'Leche formulada', category: 'alimentos' },
  { slug: 'leche-liquida', name: 'Leche líquida', category: 'alimentos' },
  { slug: 'frutas', name: 'Frutas', category: 'alimentos' },
  // Ropa
  { slug: 'sabanas-cobijas', name: 'Sábanas o cobijas', category: 'ropa' },
  { slug: 'ropa', name: 'Ropa', category: 'ropa' },
  { slug: 'zapatos', name: 'Zapatos', category: 'ropa' },
  // Equipos
  { slug: 'linternas', name: 'Linternas', category: 'equipos' },
  { slug: 'pilas', name: 'Pilas', category: 'equipos' },
  { slug: 'cargadores-portatiles', name: 'Cargadores portátiles', category: 'equipos' },
  // Refugio
  { slug: 'carpa-toldo', name: 'Carpa o toldo', category: 'refugio' },
];
