export const usageCode = `// in your main css file(e.g index.css)
@import "tailwindcss";
// import universal color palette
@import "tailwindcss-colors-palette/colors/universal.css";
// or you can import it in full, but not recommended
// @import "tailwindcss-colors-palette";

// App.tsx
export default function App() {
  return (
    <div className="text-uni-gray-6">tailwindcss-colors-palette</div>
  )
}`;
