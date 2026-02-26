import { loadTopoSvgPaths } from '@/services/topo/loadSvgPaths';
import { useEffect, useState } from 'react';
import { RouteConfig, SvgPathBounds } from './topo.types';

const getPathBounds = (pathData: string): SvgPathBounds | null => {
  const tokens = pathData.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) {
    return null;
  }

  const isCommandToken = (token: string) => /^[a-zA-Z]$/.test(token);
  const readNumber = (token: string | undefined) =>
    token === undefined ? NaN : Number.parseFloat(token);

  let index = 0;
  let command = '';
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const updateBounds = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  const hasNumbers = () =>
    index < tokens.length && !isCommandToken(tokens[index]);

  while (index < tokens.length) {
    const token = tokens[index];
    if (isCommandToken(token)) {
      command = token;
      index += 1;
      continue;
    }

    if (!command) {
      break;
    }

    switch (command) {
      case 'M':
      case 'm': {
        let isFirst = true;
        while (hasNumbers()) {
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            break;
          }
          if (command === 'm') {
            currentX += x;
            currentY += y;
          } else {
            currentX = x;
            currentY = y;
          }
          if (isFirst) {
            startX = currentX;
            startY = currentY;
            isFirst = false;
          }
          updateBounds(currentX, currentY);
        }
        command = command === 'm' ? 'l' : 'L';
        break;
      }
      case 'L':
      case 'l': {
        while (hasNumbers()) {
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            break;
          }
          if (command === 'l') {
            currentX += x;
            currentY += y;
          } else {
            currentX = x;
            currentY = y;
          }
          updateBounds(currentX, currentY);
        }
        break;
      }
      case 'H':
      case 'h': {
        while (hasNumbers()) {
          const x = readNumber(tokens[index++]);
          if (!Number.isFinite(x)) {
            break;
          }
          currentX = command === 'h' ? currentX + x : x;
          updateBounds(currentX, currentY);
        }
        break;
      }
      case 'V':
      case 'v': {
        while (hasNumbers()) {
          const y = readNumber(tokens[index++]);
          if (!Number.isFinite(y)) {
            break;
          }
          currentY = command === 'v' ? currentY + y : y;
          updateBounds(currentX, currentY);
        }
        break;
      }
      case 'C':
      case 'c': {
        while (hasNumbers()) {
          const x1 = readNumber(tokens[index++]);
          const y1 = readNumber(tokens[index++]);
          const x2 = readNumber(tokens[index++]);
          const y2 = readNumber(tokens[index++]);
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (
            !Number.isFinite(x1) ||
            !Number.isFinite(y1) ||
            !Number.isFinite(x2) ||
            !Number.isFinite(y2) ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
          ) {
            break;
          }
          const absoluteX1 = command === 'c' ? currentX + x1 : x1;
          const absoluteY1 = command === 'c' ? currentY + y1 : y1;
          const absoluteX2 = command === 'c' ? currentX + x2 : x2;
          const absoluteY2 = command === 'c' ? currentY + y2 : y2;
          const absoluteX = command === 'c' ? currentX + x : x;
          const absoluteY = command === 'c' ? currentY + y : y;
          updateBounds(absoluteX1, absoluteY1);
          updateBounds(absoluteX2, absoluteY2);
          updateBounds(absoluteX, absoluteY);
          currentX = absoluteX;
          currentY = absoluteY;
        }
        break;
      }
      case 'S':
      case 's': {
        while (hasNumbers()) {
          const x2 = readNumber(tokens[index++]);
          const y2 = readNumber(tokens[index++]);
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (
            !Number.isFinite(x2) ||
            !Number.isFinite(y2) ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
          ) {
            break;
          }
          const absoluteX2 = command === 's' ? currentX + x2 : x2;
          const absoluteY2 = command === 's' ? currentY + y2 : y2;
          const absoluteX = command === 's' ? currentX + x : x;
          const absoluteY = command === 's' ? currentY + y : y;
          updateBounds(absoluteX2, absoluteY2);
          updateBounds(absoluteX, absoluteY);
          currentX = absoluteX;
          currentY = absoluteY;
        }
        break;
      }
      case 'Q':
      case 'q': {
        while (hasNumbers()) {
          const x1 = readNumber(tokens[index++]);
          const y1 = readNumber(tokens[index++]);
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (
            !Number.isFinite(x1) ||
            !Number.isFinite(y1) ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
          ) {
            break;
          }
          const absoluteX1 = command === 'q' ? currentX + x1 : x1;
          const absoluteY1 = command === 'q' ? currentY + y1 : y1;
          const absoluteX = command === 'q' ? currentX + x : x;
          const absoluteY = command === 'q' ? currentY + y : y;
          updateBounds(absoluteX1, absoluteY1);
          updateBounds(absoluteX, absoluteY);
          currentX = absoluteX;
          currentY = absoluteY;
        }
        break;
      }
      case 'T':
      case 't': {
        while (hasNumbers()) {
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            break;
          }
          currentX = command === 't' ? currentX + x : x;
          currentY = command === 't' ? currentY + y : y;
          updateBounds(currentX, currentY);
        }
        break;
      }
      case 'A':
      case 'a': {
        while (hasNumbers()) {
          const rx = readNumber(tokens[index++]);
          const ry = readNumber(tokens[index++]);
          const rotation = readNumber(tokens[index++]);
          const largeArc = readNumber(tokens[index++]);
          const sweep = readNumber(tokens[index++]);
          const x = readNumber(tokens[index++]);
          const y = readNumber(tokens[index++]);
          if (
            !Number.isFinite(rx) ||
            !Number.isFinite(ry) ||
            !Number.isFinite(rotation) ||
            !Number.isFinite(largeArc) ||
            !Number.isFinite(sweep) ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
          ) {
            break;
          }
          const absoluteX = command === 'a' ? currentX + x : x;
          const absoluteY = command === 'a' ? currentY + y : y;
          updateBounds(absoluteX, absoluteY);
          currentX = absoluteX;
          currentY = absoluteY;
        }
        break;
      }
      case 'Z':
      case 'z': {
        currentX = startX;
        currentY = startY;
        updateBounds(currentX, currentY);
        index += 1;
        break;
      }
      default: {
        index += 1;
        break;
      }
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return null;
  }

  return { minX, minY, maxX, maxY };
};

export const useLoadRouteSvgPaths = (imageSvgUrl: number) => {
  const [paths, setPaths] = useState<RouteConfig[]>([]);
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
            rating: Math.floor(Math.random() * 5) + 1, // 1-5 gwiazdek
          };

          const bounds = getPathBounds(path.d) ?? undefined;
          return { ...path, strokeWidth: 9, bounds, ...routeData };
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
