const rand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function makeWorld() {
  const trees = [];
  for (let i = 0; i < 140; i++) {
    const x = rand(i * 3) * 1160 - 30,
      y = rand(i * 3 + 1) * 840 - 40;
    const clearing = Math.hypot((x - 530) * 0.92, y - 440) < 190;
    const path = Math.abs(x - (700 - (y - 200) * 0.6)) < 52 && y < 370;
    const pond = x > 810 && y > 440;
    if (!clearing && !path && !pond && !(x > 750 && y < 220))
      trees.push({ x, y, s: 0.65 + rand(i + 400) * 0.65, t: rand(i + 500) });
  }
  const resources = [
    { x: 460, y: 505, type: "wood" },
    { x: 640, y: 485, type: "stone" },
    { x: 430, y: 385, type: "berry" },
    { x: 360, y: 540, type: "wood" },
    { x: 685, y: 375, type: "wood" },
    { x: 625, y: 570, type: "berry" },
    { x: 750, y: 330, type: "stone" },
    { x: 315, y: 440, type: "stone" },
    { x: 570, y: 300, type: "wood" },
  ];
  for (let i = 0; i < 34; i++) {
    let x = 80 + rand(i + 600) * 910,
      y = 210 + rand(i + 700) * 480;
    if (x > 810 && y > 440) continue;
    resources.push({ x, y, type: ["wood", "stone", "berry"][i % 3] });
  }
  return {
    trees,
    resources,
    enemies: [
      { x: 230, y: 330, homeX: 230, homeY: 330 },
      { x: 740, y: 600, homeX: 740, homeY: 600 },
      { x: 710, y: 250, homeX: 710, homeY: 250 },
    ],
  };
}
function ellipse(c, x, y, rx, ry, color) {
  c.fillStyle = color;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
}
function poly(c, pts, color) {
  c.fillStyle = color;
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fill();
}
function line(c, pts, color, width = 2) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.stroke();
}
function tree(c, o) {
  const { x, y, s, t } = o;
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  ellipse(c, 20, 8, 40, 13, "#253f3329");
  poly(
    c,
    [
      [-5, 0],
      [5, 0],
      [4, -50],
      [-3, -50],
    ],
    "#705c3d",
  );
  if (t > 0.22) {
    const colors =
      t > 0.7
        ? ["#66865b", "#78956a", "#88a376"]
        : ["#365f49", "#437457", "#548363"];
    poly(
      c,
      [
        [-42, -25],
        [0, -108],
        [43, -25],
      ],
      colors[0],
    );
    poly(
      c,
      [
        [-35, -50],
        [0, -128],
        [35, -50],
      ],
      colors[1],
    );
    poly(
      c,
      [
        [-27, -77],
        [0, -144],
        [27, -77],
      ],
      colors[2],
    );
    poly(
      c,
      [
        [0, -144],
        [0, -77],
        [27, -77],
      ],
      "#2e5d4930",
    );
    line(
      c,
      [
        [-26, -32],
        [0, -39],
        [29, -32],
      ],
      "#9fba8d23",
      2,
    );
  } else {
    line(
      c,
      [
        [0, -10],
        [-8, -87],
      ],
      "#716544",
      7,
    );
    ellipse(c, -16, -77, 37, 37, "#728e51");
    ellipse(c, 13, -90, 36, 40, "#87a05f");
    ellipse(c, -4, -111, 30, 30, "#96ac6c");
    ellipse(c, -28, -97, 21, 23, "#8ca465");
    ellipse(c, 27, -74, 22, 25, "#829b5b");
  }
  c.restore();
}
function stone(c, x, y, s = 1) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  ellipse(c, 3, 3, 15, 6, "#314a3022");
  poly(
    c,
    [
      [-14, 0],
      [-10, -13],
      [2, -20],
      [15, -11],
      [17, 0],
      [4, 6],
    ],
    "#8b9990",
  );
  poly(
    c,
    [
      [-10, -13],
      [2, -20],
      [15, -11],
      [1, -9],
    ],
    "#b2bcb0",
  );
  poly(
    c,
    [
      [1, -9],
      [15, -11],
      [17, 0],
      [4, 6],
    ],
    "#77877f",
  );
  c.restore();
}
function bush(c, x, y, t = 0) {
  ellipse(c, x + 3, y + 4, 23, 8, "#314b3325");
  ellipse(c, x - 10, y - 7, 14, 13, "#527548");
  ellipse(c, x + 10, y - 8, 15, 15, "#61824d");
  ellipse(c, x, y - 17, 15, 13, "#749056");
  for (let i = 0; i < 7; i++)
    ellipse(
      c,
      x + Math.sin(i * 5 + t) * 16,
      y - 8 + Math.cos(i * 7) * 11,
      3.3,
      3.3,
      i % 2 ? "#ba646a" : "#d1847d",
    );
}
function camp(c, s, t) {
  const x = 550,
    y = 430;
  ellipse(c, x, y + 10, 114, 58, "#b8ad7b60");
  ellipse(c, x, y + 8, 88, 44, "#d4c08e70");
  const fire = s.built.includes("fire");
  if (fire) {
    let glow = c.createRadialGradient(x, y, 8, x, y, 145);
    glow.addColorStop(0, "#ffd17940");
    glow.addColorStop(1, "#ffda6900");
    c.fillStyle = glow;
    c.fillRect(x - 150, y - 150, 300, 300);
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    stone(c, x + Math.cos(a) * 27, y + Math.sin(a) * 15, 0.45);
  }
  line(
    c,
    [
      [x - 16, y + 2],
      [x + 17, y - 4],
    ],
    "#745537",
    8,
  );
  line(
    c,
    [
      [x - 16, y - 5],
      [x + 14, y + 5],
    ],
    "#927046",
    7,
  );
  if (fire) {
    c.save();
    c.translate(x, y - 7);
    c.scale(1 + Math.sin(t / 130) * 0.07, 1 + Math.cos(t / 150) * 0.09);
    poly(
      c,
      [
        [-17, 0],
        [-14, -20],
        [-5, -36],
        [0, -21],
        [7, -49],
        [12, -28],
        [18, -16],
        [15, 0],
        [0, 6],
      ],
      "#e39549",
    );
    poly(
      c,
      [
        [-10, 0],
        [-6, -20],
        [0, -12],
        [7, -31],
        [11, -11],
        [8, 2],
      ],
      "#f4c76d",
    );
    poly(
      c,
      [
        [-5, 0],
        [0, -15],
        [5, 0],
      ],
      "#ffe5a0",
    );
    c.restore();
    for (let i = 0; i < 6; i++) {
      let p = (t / 1600 + i / 6) % 1;
      ellipse(
        c,
        x + Math.sin(i * 15 + p * 3) * 13,
        y - 30 - p * 65,
        1.5,
        2,
        "#edca85" +
          Math.floor((1 - p) * 200)
            .toString(16)
            .padStart(2, "0"),
      );
    }
  } else {
    line(
      c,
      [
        [x - 10, y - 22],
        [x + 9, y - 22],
      ],
      "#bcb18b",
      1,
    );
  }
  if (s.built.includes("tent")) {
    ellipse(c, 456, 424, 65, 17, "#38462d22");
    poly(
      c,
      [
        [404, 420],
        [451, 340],
        [501, 420],
      ],
      "#d1a264",
    );
    poly(
      c,
      [
        [451, 340],
        [489, 342],
        [541, 415],
        [501, 420],
      ],
      "#b58c55",
    );
    poly(
      c,
      [
        [422, 420],
        [451, 366],
        [481, 420],
      ],
      "#5b6350",
    );
    poly(
      c,
      [
        [451, 366],
        [451, 419],
        [481, 420],
      ],
      "#343e37",
    );
    line(
      c,
      [
        [398, 421],
        [451, 336],
        [505, 421],
      ],
      "#e0bf8a",
      3,
    );
    line(
      c,
      [
        [451, 336],
        [489, 339],
        [546, 417],
      ],
      "#d5b17b",
      2,
    );
    line(
      c,
      [
        [411, 408],
        [388, 428],
      ],
      "#d1c194",
      1,
    );
    line(
      c,
      [
        [529, 401],
        [552, 422],
      ],
      "#d1c194",
      1,
    );
  } else {
    poly(
      c,
      [
        [421, 410],
        [462, 387],
        [488, 404],
        [445, 429],
      ],
      "#8b9b7470",
    );
    line(
      c,
      [
        [420, 411],
        [445, 426],
        [486, 404],
      ],
      "#adb78b",
      2,
    );
  }
  line(
    c,
    [
      [596, 449],
      [639, 426],
    ],
    "#795e3e",
    11,
  );
  line(
    c,
    [
      [596, 444],
      [639, 421],
    ],
    "#a08456",
    9,
  );
  ellipse(c, 596, 445, 5, 6, "#b69b6c");
  line(
    c,
    [
      [616, 365],
      [616, 329],
    ],
    "#806843",
    5,
  );
  poly(
    c,
    [
      [594, 329],
      [637, 327],
      [639, 344],
      [596, 347],
    ],
    "#b19b68",
  );
  line(
    c,
    [
      [603, 336],
      [627, 335],
    ],
    "#635d40",
    2,
  );
  if (s.built.includes("signal")) {
    line(
      c,
      [
        [675, 375],
        [685, 275],
        [695, 375],
      ],
      "#917d52",
      5,
    );
    line(
      c,
      [
        [679, 340],
        [692, 340],
      ],
      "#917d52",
      3,
    );
    poly(
      c,
      [
        [685, 275],
        [718, 282],
        [685, 296],
      ],
      "#e3aa6c",
    );
  }
}
function person(c, s, t) {
  let moving = Math.sin(t / 140) * 2;
  c.save();
  c.translate(s.x, s.y);
  ellipse(c, 3, 2, 17, 7, "#29443636");
  line(
    c,
    [
      [-6, -11],
      [-7, 0],
    ],
    "#455250",
    5,
  );
  line(
    c,
    [
      [5, -11],
      [7, 0],
    ],
    "#455250",
    5,
  );
  poly(
    c,
    [
      [-12, -31],
      [8, -31],
      [13, -11],
      [-11, -10],
    ],
    "#cf9563",
  );
  poly(
    c,
    [
      [-12, -29],
      [-17, -26],
      [-17, -12],
      [-10, -12],
    ],
    "#6a7a54",
  );
  line(
    c,
    [
      [-10, -27],
      [-17, -16 + moving],
    ],
    "#d9b68b",
    5,
  );
  line(
    c,
    [
      [10, -26],
      [15, -16 - moving],
    ],
    "#d9b68b",
    5,
  );
  ellipse(c, 0, -40, 12, 13, "#e1bd8c");
  ellipse(c, 1, -49, 15, 7, "#ad774c");
  poly(
    c,
    [
      [-11, -47],
      [-7, -59],
      [8, -59],
      [12, -47],
    ],
    "#bd8c54",
  );
  ellipse(c, 1, -47, 19, 4, "#c79d64");
  ellipse(c, 5, -40, 1.1, 1.3, "#3a4938");
  poly(
    c,
    [
      [-9, -33],
      [6, -32],
      [2, -26],
      [-7, -27],
    ],
    "#c16450",
  );
  if (s.built.includes("torch")) {
    line(
      c,
      [
        [16, -18],
        [20, -40],
      ],
      "#876744",
      3,
    );
    ellipse(c, 21, -44, 5, 9, "#f6bb5b");
  }
  c.restore();
}
export function drawWorld(canvas, w, s, t, opts) {
  if (!canvas) return;
  const c = canvas.getContext("2d");
  c.clearRect(0, 0, 1100, 760);
  c.fillStyle = "#8f9e70";
  c.fillRect(0, 0, 1100, 760);
  let light = c.createRadialGradient(530, 370, 40, 550, 410, 700);
  light.addColorStop(0, "#bec28a");
  light.addColorStop(0.6, "#99ae79");
  light.addColorStop(1, "#667f5c");
  c.fillStyle = light;
  c.fillRect(0, 0, 1100, 760);
  // Distant mountains and mossy rock wall.
  poly(
    c,
    [
      [650, 140],
      [728, 15],
      [798, 88],
      [857, -22],
      [990, 115],
      [1100, 0],
      [1100, 240],
    ],
    "#7c8b7d",
  );
  poly(
    c,
    [
      [690, 144],
      [728, 15],
      [757, 71],
      [745, 61],
    ],
    "#b9c0a4",
  );
  poly(
    c,
    [
      [798, 88],
      [857, -22],
      [901, 41],
      [863, 22],
      [835, 60],
    ],
    "#c6cbb1",
  );
  poly(
    c,
    [
      [730, 182],
      [807, 97],
      [888, 143],
      [961, 66],
      [1100, 152],
      [1100, 265],
      [890, 228],
    ],
    "#738875",
  );
  poly(
    c,
    [
      [775, 163],
      [808, 97],
      [851, 129],
      [811, 122],
    ],
    "#aab59c",
  );
  // River and shoreline.
  c.beginPath();
  c.moveTo(1100, 410);
  c.bezierCurveTo(960, 430, 1020, 480, 916, 490);
  c.bezierCurveTo(811, 507, 876, 579, 854, 640);
  c.bezierCurveTo(832, 711, 1000, 737, 1100, 760);
  c.closePath();
  c.fillStyle = "#c1c19a";
  c.fill();
  c.beginPath();
  c.moveTo(1100, 424);
  c.bezierCurveTo(974, 445, 1032, 491, 927, 504);
  c.bezierCurveTo(830, 523, 900, 582, 874, 641);
  c.bezierCurveTo(864, 701, 1014, 724, 1100, 744);
  c.closePath();
  c.fillStyle = "#719f9a";
  c.fill();
  for (let i = 0; i < 35; i++) {
    const x = 896 + rand(i + 100) * 200,
      y = 510 + rand(i + 200) * 240;
    if (x > 945 || y > 560) {
      line(
        c,
        [
          [x, y],
          [x + 12 + rand(i) * 25, y],
        ],
        i % 3 ? "#a4c5ae60" : "#d3dcc460",
        1.5,
      );
    }
  }
  // Winding footpath.
  c.beginPath();
  c.moveTo(540, 790);
  c.bezierCurveTo(535, 685, 400, 615, 479, 524);
  c.bezierCurveTo(540, 451, 613, 397, 608, 339);
  c.bezierCurveTo(609, 255, 774, 255, 850, 151);
  c.strokeStyle = "#b3b082";
  c.lineWidth = 46;
  c.lineCap = "round";
  c.stroke();
  c.strokeStyle = "#c2bc8f";
  c.lineWidth = 29;
  c.stroke();
  // Ground details, tiny flowers, tufts and sunlit grass.
  for (let i = 0; i < 1100; i++) {
    const x = rand(i * 8 + 20) * 1100,
      y = rand(i * 8 + 21) * 760;
    if (x > 860 && y > 480) continue;
    const col = ["#6b895d65", "#d6d19b65", "#91a37380", "#5e7c5150"][i % 4];
    if (i % 5 === 0) {
      line(
        c,
        [
          [x - 3, y],
          [x - 5, y - 5],
          [x, y - 1],
          [x + 2, y - 7],
          [x + 4, y],
        ],
        col,
        0.9,
      );
    } else ellipse(c, x, y, 1 + rand(i) * 2, 0.7, col);
    if (i % 34 === 0) {
      for (let a = 0; a < 4; a++) {
        ellipse(
          c,
          x + Math.cos(a * 1.57) * 2,
          y + Math.sin(a * 1.57) * 2,
          1.6,
          1.6,
          "#e9deb2",
        );
      }
      ellipse(c, x, y, 1, 1, "#cfaf64");
    }
  }
  for (let i = 0; i < 12; i++) {
    const x = 750 + rand(i + 120) * 300,
      y = 200 + rand(i + 130) * 120;
    stone(c, x, y, 0.5 + rand(i) * 1.5);
  }
  const drawables = w.trees.map((o) => ({ y: o.y, draw: () => tree(c, o) }));
  for (const r of w.resources) {
    if (r.taken) continue;
    drawables.push({
      y: r.y,
      draw: () => {
        if (r.type === "wood") {
          ellipse(c, r.x, r.y + 3, 19, 6, "#3b513329");
          line(
            c,
            [
              [r.x - 15, r.y + 2],
              [r.x + 14, r.y - 12],
            ],
            "#796348",
            6,
          );
          line(
            c,
            [
              [r.x - 14, r.y],
              [r.x + 14, r.y - 14],
            ],
            "#b69a65",
            3,
          );
          line(
            c,
            [
              [r.x - 3, r.y - 5],
              [r.x - 4, r.y - 15],
            ],
            "#967d52",
            3,
          );
          line(
            c,
            [
              [r.x - 10, r.y - 7],
              [r.x + 9, r.y + 5],
            ],
            "#8d744e",
            4,
          );
        } else if (r.type === "stone") {
          stone(c, r.x, r.y, 0.75);
          stone(c, r.x + 15, r.y + 6, 0.4);
        } else bush(c, r.x, r.y);
        if (Math.hypot(s.x - r.x, s.y - r.y) < 66) {
          c.strokeStyle = "#fff4c4";
          c.lineWidth = 1.5;
          c.setLineDash([3, 4]);
          c.beginPath();
          c.ellipse(r.x, r.y, 28, 16, 0, 0, Math.PI * 2);
          c.stroke();
          c.setLineDash([]);
          c.fillStyle = "#334d3d";
          c.fillRect(r.x - 10, r.y - 47, 20, 20);
          c.fillStyle = "#fff4dc";
          c.font = "bold 12px sans-serif";
          c.textAlign = "center";
          c.fillText("E", r.x, r.y - 33);
        }
      },
    });
  }
  drawables.push({ y: 432, draw: () => camp(c, s, t) });
  drawables.push({ y: s.y, draw: () => person(c, s, t) });
  if (s.guard > 0)
    drawables.push({
      y: 150,
      draw: () => {
        c.save();
        c.translate(850, 140);
        ellipse(c, 3, 12, 33, 13, "#3c51454a");
        ellipse(c, 0, -13, 29, 33, "#79856d");
        ellipse(c, 0, -39, 23, 20, "#8e997c");
        ellipse(c, -23, -29, 10, 14, "#7e8a6e");
        ellipse(c, 23, -29, 10, 14, "#7e8a6e");
        poly(
          c,
          [
            [-19, -50],
            [-25, -65],
            [-8, -54],
          ],
          "#b9b394",
        );
        poly(
          c,
          [
            [19, -50],
            [24, -65],
            [8, -54],
          ],
          "#b9b394",
        );
        ellipse(c, -8, -41, 4, 4, "#d4d3a9");
        ellipse(c, 8, -41, 4, 4, "#d4d3a9");
        ellipse(c, -8, -40, 1.5, 2, "#364638");
        ellipse(c, 8, -40, 1.5, 2, "#364638");
        ellipse(c, 0, -31, 7, 4, "#6b7a63");
        bush(c, -12, -59, 1);
        c.fillStyle = "#354e3d";
        c.fillRect(-30, -87, 60, 5);
        c.fillStyle = "#dfb979";
        c.fillRect(-30, -87, (60 * s.guard) / 5, 5);
        c.restore();
      },
    });
  if (opts.night)
    for (const e of w.enemies) {
      if (e.scaredUntil && t < e.scaredUntil) continue;
      drawables.push({
        y: e.y,
        draw: () => {
          ellipse(c, e.x, e.y, 21, 9, "#28393355");
          ellipse(c, e.x, e.y - 15, 17, 20, "#647379");
          poly(
            c,
            [
              [e.x - 15, e.y - 27],
              [e.x - 17, e.y - 42],
              [e.x - 3, e.y - 30],
            ],
            "#647379",
          );
          poly(
            c,
            [
              [e.x + 15, e.y - 27],
              [e.x + 17, e.y - 42],
              [e.x + 3, e.y - 30],
            ],
            "#647379",
          );
          ellipse(c, e.x - 6, e.y - 19, 3, 4, "#dfdbb0");
          ellipse(c, e.x + 6, e.y - 19, 3, 4, "#dfdbb0");
        },
      });
    }
  drawables.sort((a, b) => a.y - b.y).forEach((o) => o.draw());
  // Floating pollen, birds and soft shafts of light.
  for (let i = 0; i < 18; i++) {
    let x = rand(i + 900) * 1100 + Math.sin(t / 3000 + i) * 14,
      y = rand(i + 950) * 760 + Math.cos(t / 2700 + i) * 9;
    ellipse(c, x, y, 1.6, 1.6, "#f6efbb8a");
  }
  c.save();
  c.globalAlpha = 0.045;
  c.fillStyle = "#fff8cf";
  poly(
    c,
    [
      [100, -20],
      [190, -20],
      [660, 760],
      [470, 760],
    ],
    "#fff8cf",
  );
  poly(
    c,
    [
      [350, -20],
      [385, -20],
      [880, 760],
      [790, 760],
    ],
    "#fff8cf",
  );
  c.restore();
  if (s.time > 95) {
    const alpha = s.time > 120 ? 0.48 : ((s.time - 95) / 25) * 0.26;
    c.fillStyle = `rgba(24,39,64,${alpha})`;
    c.fillRect(0, 0, 1100, 760);
    if (s.built.includes("fire")) {
      const glow = c.createRadialGradient(550, 410, 0, 550, 410, 155);
      glow.addColorStop(0, "#ffd07855");
      glow.addColorStop(1, "#ffd07800");
      c.fillStyle = glow;
      c.fillRect(390, 250, 320, 320);
    }
  }
  const vignette = c.createRadialGradient(550, 380, 260, 550, 380, 690);
  vignette.addColorStop(0, "#213b2b00");
  vignette.addColorStop(1, "#20372e45");
  c.fillStyle = vignette;
  c.fillRect(0, 0, 1100, 760);
  if (s.won) {
    c.save();
    c.translate(((t / 8) % 1600) - 200, 120);
    c.rotate(-0.12);
    c.fillStyle = "#f1e7c8";
    c.font = "90px sans-serif";
    c.fillText("✈", 0, 0);
    c.restore();
  }
}
