import { motion } from 'framer-motion';

interface ColorPaletteProps {
  skinToneType: string;
}

interface ColorGroup {
  name: string;
  colors: { hex: string; name: string }[];
}

const palettes: Record<string, { title: string; description: string; groups: ColorGroup[]; avoid: { hex: string; name: string }[] }> = {
  warm: {
    title: '🔥 Warm Tone Palette',
    description: 'Earth tones and warm hues complement your golden undertones beautifully.',
    groups: [
      {
        name: 'Best Colors',
        colors: [
          { hex: '#D2691E', name: 'Chocolate' },
          { hex: '#E07C4E', name: 'Coral' },
          { hex: '#E8A87C', name: 'Peach' },
          { hex: '#DAA520', name: 'Goldenrod' },
          { hex: '#CC5500', name: 'Burnt Orange' },
          { hex: '#C19A6B', name: 'Camel' },
          { hex: '#8B4513', name: 'Saddle Brown' },
          { hex: '#B5651D', name: 'Amber' },
        ],
      },
      {
        name: 'Everyday Essentials',
        colors: [
          { hex: '#6B8E23', name: 'Olive Green' },
          { hex: '#556B2F', name: 'Dark Olive' },
          { hex: '#FAEBD7', name: 'Antique White' },
          { hex: '#F5DEB3', name: 'Wheat' },
          { hex: '#D2B48C', name: 'Tan' },
          { hex: '#CD853F', name: 'Peru' },
          { hex: '#A0522D', name: 'Sienna' },
          { hex: '#DEB887', name: 'Burlywood' },
        ],
      },
      {
        name: 'Statement Shades',
        colors: [
          { hex: '#B22222', name: 'Firebrick' },
          { hex: '#DC143C', name: 'Crimson' },
          { hex: '#FF6347', name: 'Tomato Red' },
          { hex: '#E9967A', name: 'Dark Salmon' },
          { hex: '#F08080', name: 'Light Coral' },
          { hex: '#E0C068', name: 'Mustard' },
          { hex: '#FFD700', name: 'Gold' },
          { hex: '#BDB76B', name: 'Dark Khaki' },
        ],
      },
    ],
    avoid: [
      { hex: '#C0C0C0', name: 'Silver' },
      { hex: '#ADD8E6', name: 'Icy Blue' },
      { hex: '#E6E6FA', name: 'Lavender' },
      { hex: '#FF69B4', name: 'Hot Pink' },
    ],
  },
  cool: {
    title: '❄️ Cool Tone Palette',
    description: 'Jewel tones and icy hues enhance your blue and pink undertones.',
    groups: [
      {
        name: 'Best Colors',
        colors: [
          { hex: '#4169E1', name: 'Royal Blue' },
          { hex: '#000080', name: 'Navy' },
          { hex: '#50C878', name: 'Emerald' },
          { hex: '#9966CC', name: 'Amethyst' },
          { hex: '#800080', name: 'Purple' },
          { hex: '#7B68EE', name: 'Medium Slate' },
          { hex: '#E6E6FA', name: 'Lavender' },
          { hex: '#C0C0C0', name: 'Silver' },
        ],
      },
      {
        name: 'Everyday Essentials',
        colors: [
          { hex: '#FFFFFF', name: 'True White' },
          { hex: '#F0F8FF', name: 'Alice Blue' },
          { hex: '#87CEEB', name: 'Sky Blue' },
          { hex: '#B0E0E6', name: 'Powder Blue' },
          { hex: '#708090', name: 'Slate Gray' },
          { hex: '#2F4F4F', name: 'Dark Slate' },
          { hex: '#778899', name: 'Light Slate' },
          { hex: '#D3D3D3', name: 'Light Gray' },
        ],
      },
      {
        name: 'Statement Shades',
        colors: [
          { hex: '#DC143C', name: 'Cherry' },
          { hex: '#8B008B', name: 'Dark Magenta' },
          { hex: '#C71585', name: 'Deep Pink' },
          { hex: '#722F37', name: 'Wine' },
          { hex: '#008080', name: 'Teal' },
          { hex: '#00CED1', name: 'Dark Turquoise' },
          { hex: '#DB7093', name: 'Pale Violet' },
          { hex: '#FF1493', name: 'Deep Rose' },
        ],
      },
    ],
    avoid: [
      { hex: '#FF8C00', name: 'Dark Orange' },
      { hex: '#DAA520', name: 'Goldenrod' },
      { hex: '#D2691E', name: 'Warm Brown' },
      { hex: '#E0C068', name: 'Mustard' },
    ],
  },
  neutral: {
    title: '⚪ Neutral Tone Palette',
    description: "You're lucky — both warm and cool colors look great on you! Muted, soft tones are your power shades.",
    groups: [
      {
        name: 'Best Colors',
        colors: [
          { hex: '#008B8B', name: 'Dark Cyan' },
          { hex: '#5F9EA0', name: 'Cadet Blue' },
          { hex: '#BC8F8F', name: 'Rosy Brown' },
          { hex: '#D4A5A5', name: 'Dusty Rose' },
          { hex: '#9DC183', name: 'Sage Green' },
          { hex: '#6B8E23', name: 'Olive' },
          { hex: '#607D8B', name: 'Blue Gray' },
          { hex: '#8FBC8F', name: 'Dark Sea Green' },
        ],
      },
      {
        name: 'Everyday Essentials',
        colors: [
          { hex: '#F5F5DC', name: 'Beige' },
          { hex: '#FAF0E6', name: 'Linen' },
          { hex: '#FFFAF0', name: 'Soft White' },
          { hex: '#D2B48C', name: 'Tan' },
          { hex: '#696969', name: 'Dim Gray' },
          { hex: '#808080', name: 'Medium Gray' },
          { hex: '#2F4F4F', name: 'Dark Slate' },
          { hex: '#36454F', name: 'Charcoal' },
        ],
      },
      {
        name: 'Statement Shades',
        colors: [
          { hex: '#483D8B', name: 'Dark Slate Blue' },
          { hex: '#6A5ACD', name: 'Slate Blue' },
          { hex: '#CD5C5C', name: 'Indian Red' },
          { hex: '#B8860B', name: 'Dark Gold' },
          { hex: '#2E8B57', name: 'Sea Green' },
          { hex: '#4682B4', name: 'Steel Blue' },
          { hex: '#DA70D6', name: 'Orchid' },
          { hex: '#20B2AA', name: 'Light Sea Green' },
        ],
      },
    ],
    avoid: [
      { hex: '#FF4500', name: 'Neon Orange' },
      { hex: '#00FF00', name: 'Neon Green' },
      { hex: '#FF00FF', name: 'Neon Pink' },
      { hex: '#FFFF00', name: 'Bright Yellow' },
    ],
  },
};

export default function ColorPalette({ skinToneType }: ColorPaletteProps) {
  const palette = palettes[skinToneType];
  if (!palette) return null;

  return (
    <section id="color-palette" className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {palette.title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {palette.description}
          </p>
        </motion.div>

        {/* Color Groups */}
        {palette.groups.map((group, groupIdx) => (
          <motion.div
            key={group.name}
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: groupIdx * 0.15 }}
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4 pl-2 border-l-4 border-purple-500">
              {group.name}
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
              {group.colors.map((color, colorIdx) => (
                <motion.div
                  key={color.hex}
                  className="flex flex-col items-center group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: colorIdx * 0.05 + groupIdx * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-purple-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-gray-500 mt-2 text-center leading-tight font-medium">
                    {color.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {color.hex}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Colors to Avoid */}
        <motion.div
          className="mt-12 p-6 bg-red-50/50 rounded-2xl border border-red-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Colors to Avoid
          </h3>
          <div className="flex flex-wrap gap-4">
            {palette.avoid.map((color) => (
              <div key={color.hex} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <div
                  className="w-8 h-8 rounded-lg relative"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{color.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          className="mt-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
            💡 Pro Tips
          </h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            {skinToneType === 'warm' && (
              <>
                <li>• Pair earth tones with denim for an effortless everyday look</li>
                <li>• Gold jewelry will complement your skin better than silver</li>
                <li>• Warm reds and oranges are your power colors for standout moments</li>
                <li>• Stick to warm whites (cream, ivory) over stark white</li>
              </>
            )}
            {skinToneType === 'cool' && (
              <>
                <li>• Silver and platinum jewelry will look stunning on you</li>
                <li>• Jewel tones (sapphire, emerald, ruby) make you glow</li>
                <li>• Icy pastels work beautifully for a softer, elegant look</li>
                <li>• True white is your go-to instead of cream or ivory</li>
              </>
            )}
            {skinToneType === 'neutral' && (
              <>
                <li>• You can wear both gold and silver jewelry effortlessly</li>
                <li>• Muted, dusty shades are your secret weapon</li>
                <li>• Avoid overly bright neon colors — they can wash you out</li>
                <li>• Medium-intensity colors work best — not too light, not too dark</li>
              </>
            )}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
