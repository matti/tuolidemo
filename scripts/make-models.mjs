import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";
import fs from "node:fs";
const pieces = [];
function box(w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
  let g = new RoundedBoxGeometry(w, h, d, 1, Math.min(w, h, d) * 0.25);
  g.rotateX(rx);
  g.rotateY(ry);
  g.rotateZ(rz);
  g.translate(x, y, z);
  pieces.push(g);
}
// One original, stackable municipal chair. Real geometry, including open back slots.
box(1.25, 0.13, 1.18, 0, 1.03, 0);
for (let x of [-1, 1])
  for (let z of [-1, 1])
    box(0.105, 1.07, 0.105, x * 0.52, 0.52, z * 0.49, z * 0.12, 0, -x * 0.1);
for (let x of [-1, 1]) box(0.13, 1.13, 0.14, x * 0.55, 1.6, -0.51, -0.12);
box(1.2, 0.14, 0.14, 0, 2.16, -0.58, -0.12);
box(1.15, 0.12, 0.13, 0, 1.38, -0.49, -0.12);
for (let i = -2; i <= 2; i++)
  box(0.13, 0.75, 0.095, i * 0.19, 1.77, -0.535, -0.12, 0, -i * 0.018);
for (let x of [-1, 1]) box(0.085, 0.085, 0.88, x * 0.49, 0.39, 0);
const geo = mergeGeometries(pieces);
const mesh = new T.Mesh(geo, new T.MeshPhongMaterial());
fs.writeFileSync(
  "public/data/chair.obj",
  "mtllib chair.mtl\nusemtl chair\n" + new OBJExporter().parse(mesh),
);
console.log("chair triangles", geo.attributes.position.count / 3);

fs.writeFileSync(
  "public/data/chair.mtl",
  "newmtl chair\nKa 0.1 0.1 0.1\nKd 1.0 1.0 1.0\nKs 0.25 0.25 0.25\nNs 80\nillum 2\n",
);
