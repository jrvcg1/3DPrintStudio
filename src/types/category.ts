export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Nombre del ícono Lucide (ej: 'Key', 'Box', 'Gamepad2', 'Sparkles')
  description: string;
  itemCount?: number;
}
