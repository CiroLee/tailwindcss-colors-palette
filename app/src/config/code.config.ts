export const usageCode = `@import "tailwindcss";
/* import universal color palette */
@import "tailwindcss-colors-palette/colors/universal.css";

/* or fully import */
/* @import "tailwindcss-colors-palette"; */
`;

export const useInComponent = `export default function App() {
  return (
    <div className="text-uni-gray-6">tailwindcss-colors-palette</div>
  )
}`;
