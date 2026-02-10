import { loadTopoSvgPaths, SvgPathConfig } from '@/services/topo/loadSvgPaths';
import { useEffect, useState } from 'react';

export const useLoadRouteSvgPaths = (imageSvgUrl: number) => {
  const [paths, setPaths] = useState<SvgPathConfig[]>([]);
  const [viewBox, setViewBox] = useState<string | null>(null);

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const { paths: svgPaths, viewBox } =
          await loadTopoSvgPaths(imageSvgUrl);

        const parsedPaths = svgPaths.map((path, index) => {
          // Generate climbing route data
          const routeData = {
            name: `Droga ${index + 1}`,
            length: Math.floor(15 + Math.random() * 35), // 15-50m
            bolts: Math.floor(5 + Math.random() * 15), // 5-20 przelotów
            grade: ['5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '7a'][
              Math.floor(Math.random() * 9)
            ],
            type: ['Sport', 'Trad', 'Multi-pitch'][
              Math.floor(Math.random() * 3)
            ],
            description: `Piękna droga wspinaczkowa na ścianie Słonia. ${['Wymaga dobrej techniki.', 'Idealna dla początkujących.', 'Trudne ruchy w górnej części.'][Math.floor(Math.random() * 3)]}`,
          };

          return { ...path, strokeWidth: 9, ...routeData };
        });

        setPaths(parsedPaths);
        setViewBox(viewBox ?? null);
      } catch (error) {
        console.error('Error loading route SVG paths:', error);
        setPaths([]);
        setViewBox(null);
      }
    };
    loadPaths();
  }, [imageSvgUrl]);
  return { paths, viewBox };
};
