import { TopoSvgData } from '@/features/TopoPreview/topo.types';
import { Asset } from 'expo-asset';
import { XMLParser } from 'fast-xml-parser';

export async function loadTopoSvgPaths(
  assetModule: number,
): Promise<TopoSvgData> {
  const svgAsset = Asset.fromModule(assetModule);
  await svgAsset.downloadAsync();

  if (!svgAsset.localUri) {
    throw new Error('SVG asset has no local URI after download.');
  }

  const response = await fetch(svgAsset.localUri);
  const svgContent = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  const result = parser.parse(svgContent);
  const paths = result?.svg?.g?.path;
  const viewBox = result?.svg?.viewBox || undefined;

  if (!paths) {
    return { paths: [], viewBox };
  }

  const parsedPaths = (Array.isArray(paths) ? paths : [paths]).map((path) => {
    const styleAttr = path.style || '';
    const fillMatch = styleAttr.match(/fill:(#[0-9a-fA-F]{6})/);
    const color = fillMatch ? fillMatch[1] : '#00ff00';

    return {
      id: path.id || `path-${Math.random()}`,
      d: path.d,
      color,
    };
  });

  return { paths: parsedPaths, viewBox };
}
